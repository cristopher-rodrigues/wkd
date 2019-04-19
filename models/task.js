'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    category: Sequelize.STRING,
    description: Sequelize.TEXT,
    started_at: Sequelize.DATE,
    finished_at: Sequelize.DATE,
    createdAt: {
       field: 'created_at',
       type: Sequelize.DATE,
     },
     updatedAt: {
       field: 'updated_at',
       type: Sequelize.DATE,
     }, {})
   })
  return Task;
};
