const { Reflexion } = require("../db");

// Crear nueva reflexión
const createReflexionService = async ({ audio_url, texto, fecha }) => {
  const nuevaReflexion = await Reflexion.create({
    audio_url,
    texto,
    fecha, // opcional, si no se envía toma el default
  });
  return nuevaReflexion;
};

// Obtener todas las reflexiones activas
const getAllReflexionesService = async () => {
  const reflexiones = await Reflexion.findAll({
    where: { isActive: true },
    order: [["fecha", "DESC"]],
  });
  return reflexiones;
};

// Obtener una reflexión por ID
const getReflexionByIdService = async (id) => {
  const reflexion = await Reflexion.findByPk(id);
  if (!reflexion || !reflexion.isActive) {
    throw new Error("Reflexión no encontrada o inactiva");
  }
  return reflexion;
};

// Actualizar reflexión por ID
const updateReflexionService = async (id, data) => {
  const reflexion = await Reflexion.findByPk(id);
  if (!reflexion || !reflexion.isActive) {
    throw new Error("Reflexión no encontrada o inactiva");
  }

  const { audio_url, texto, fecha } = data;

  reflexion.audio_url = audio_url || reflexion.audio_url;
  reflexion.texto = texto || reflexion.texto;
  reflexion.fecha = fecha || reflexion.fecha;

  await reflexion.save();
  return reflexion;
};

// Eliminar (soft delete)
const deleteReflexionService = async (id) => {
  const reflexion = await Reflexion.findByPk(id);
  if (!reflexion || !reflexion.isActive) {
    throw new Error("Reflexión no encontrada o inactiva");
  }

  reflexion.isActive = false;
  await reflexion.save();
};

module.exports = {
  createReflexionService,
  getAllReflexionesService,
  getReflexionByIdService,
  updateReflexionService,
  deleteReflexionService,
};
