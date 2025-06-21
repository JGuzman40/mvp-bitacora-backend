module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "participante"),
      allowNull: false,
      defaultValue: "participante",
    },
    imageUrl: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
  });

  return User;
};
