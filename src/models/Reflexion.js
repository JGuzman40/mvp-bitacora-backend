module.exports = (sequelize, DataTypes) => {
  const Reflexion = sequelize.define("Reflexion", {
    audio_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  });
  return Reflexion;
};
