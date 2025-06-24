const {
  createReflexionService,
  getAllReflexionesService,
  getReflexionByIdService,
  updateReflexionService,
  deleteReflexionService,
} = require("../services/ReflexionService");

const catchAsync = require("../utils/catchAsync");

const createReflexion = async (req, res) => {
    console.log("🟢 REQ.BODY:", req.body);
  console.log("🟡 REQ.FILE:", req.file);
  
  const audio_url = req.file ? req.file.path : null;
  const usuarioId = req.body.usuarioId || req.body["usuarioId"];
  console.log("🔎 Usuario ID recibido:", usuarioId);
  const data = {
    ...req.body,
    audio_url,
    usuarioId,
  };
  const newReflexion = await createReflexionService(data);
  res.status(201).json({
    message: "Reflexión creada exitosamente",
    reflexion: newReflexion,
  });
};

const getAllReflexiones = async (req, res) => {
  const reflexiones = await getAllReflexionesService();
  res.status(200).json(reflexiones);
};

const getReflexionById = async (req, res) => {
  const reflexion = await getReflexionByIdService(req.params.id);
  res.status(200).json(reflexion);
};

const updateReflexion = async (req, res) => {
  const audio_url = req.file ? req.file.path : null;
  const updatedReflexion = await updateReflexionService(req.params.id, {
    ...req.body,
    ...(audio_url && { audio_url }),
  });
  res.status(200).json({
    message: "Reflexión actualizada exitosamente",
    reflexion: updatedReflexion,
  });
};

const deleteReflexion = async (req, res) => {
  await deleteReflexionService(req.params.id);
  res.status(200).json({
    message: "Reflexión desactivada exitosamente",
  });
};

module.exports = {
  createReflexion: catchAsync(createReflexion),
  getAllReflexiones: catchAsync(getAllReflexiones),
  getReflexionById: catchAsync(getReflexionById),
  updateReflexion: catchAsync(updateReflexion),
  deleteReflexion: catchAsync(deleteReflexion),
};
