const { User } = require("../db");
const { sendAdminWelcomeEmail, sendParticipantWelcomeEmail, } = require("./EmailService");
const bcrypt = require("bcryptjs");

// Crear usuario (admin o participante)
const createUserService = async (data) => {
  const { name, email, password, role, imageUrl, isActive, adminId } = data;

  // Verificar si ya existe un usuario con ese email
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser)
    throw new Error("Ya existe un usuario asociado a este e-mail");

  // Validar adminId si se proporciona
  if (adminId) {
    const adminUser = await User.findByPk(adminId);
    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("adminId inválido o no corresponde a un administrador");
    }
  }

  // Encriptar contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Crear nuevo usuario
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    imageUrl,
    isActive,
    adminId: adminId || null,
  });

  // Enviar correo si es un administrador
  if (role === "admin") {
    await sendAdminWelcomeEmail({ name, email, password });
  } else if (role === "participante") {
    try {
      await sendParticipantWelcomeEmail({ name, email, password });
    } catch (err) {
      console.error("Error al enviar correo a participante:", err.message);
    }
  }
  return newUser;
};

// Obtener todos los usuarios activos (sin contraseñas)
const getUsersService = async () => {
  return await User.findAll({
    where: { isActive: true },
    attributes: { exclude: ["password"] },
  });
};

// Obtener un usuario por ID
const getUserByIdService = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) throw new Error("Usuario no encontrado");
  return user;
};

// Obtener los participantes registrados por un admin
const getParticipantesByAdminService = async (adminId) => {
  const admin = await User.findByPk(adminId, {
    include: [{
      model: User,
      as: "participantes",
      attributes: { exclude: ["password"] },
    }],
  });

  if (!admin || admin.role !== "admin") {
    throw new Error("Administrador no válido o no encontrado");
  }

  return admin.participantes;
};

// Actualizar usuario
const updateUserService = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");

  const { name, email, password, role, isActive, imageUrl, adminId } = data;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  // Si se provee un nuevo adminId, validar que sea un admin existente
  if (adminId) {
    const adminUser = await User.findByPk(adminId);
    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("adminId inválido o no corresponde a un administrador");
    }
    user.adminId = adminId;
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.isActive = isActive !== undefined ? isActive : user.isActive;
  user.imageUrl = imageUrl || user.imageUrl;

  await user.save();
  return user;
};

// Eliminar (desactivar) usuario
const deleteUserService = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");

  user.isActive = false;
  await user.save();
};

module.exports = {
  createUserService,
  getUsersService,
  getUserByIdService,
  getParticipantesByAdminService,
  updateUserService,
  deleteUserService,
};
