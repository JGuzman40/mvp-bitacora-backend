module.exports = (sequelize, DataTypes) => {
  const Reflexion = sequelize.define("Reflexion", {
    audio_url: {
      type: DataTypes.STRING(500),
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
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
  });
  return Reflexion;
};
