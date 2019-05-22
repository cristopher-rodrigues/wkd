const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    category: DataTypes.STRING,
    description: DataTypes.TEXT,
    started_at: DataTypes.DATE,
    finished_at: DataTypes.DATE,
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
    },
  }, { modelName: 'Tasks', timestamps: false });
  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};
