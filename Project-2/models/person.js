module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define("Person", {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
      },
    },
    bloodType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
      },
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        len: [1],
      },
    },
    age: {
      type: DataTypes.STRING,
      validate: {
        len: [1],
      },
    },
  });

  Person.associate = (db) => {
    Person.belongsTo(db.Location, {
      foreignKey: {
        allowNull: false,
      },
    });
  };
  return Person;
};
