const { User } = require("../db");
const bcrypt = require("bcryptjs");

const createUserService = async (data) => {
  const { name, email, password, role, imageUrl, isActive } = data;

  // Verificar si ya existe un usuario con ese email
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser)
    throw new Error("Ya existe un usuario asociado a este e-mail");

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
  });

  return newUser;
};

const getUsersService = async () => {
  return await User.findAll({
    where: {
      isActive: true,
    },
    attributes: { exclude: ["password"] }, // Oculta el password
  });
};

const getUserByIdService = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] }, // Oculta el password
  });
  if (!user) throw new Error("Usuario no encontrado");
  return user;
};

const updateUserService = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");

  const { name, email, password, role, isActive, imageUrl } = data;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.isActive = isActive !== undefined ? isActive : user.isActive;
  user.imageUrl = imageUrl || user.imageUrl;

  await user.save();
  return user;
};

const deleteUserService = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");

  user.isActive = false; // Soft delete
  await user.save();
};

module.exports = {
  createUserService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
};
