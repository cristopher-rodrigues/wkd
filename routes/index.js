const moment = require('moment');
const express = require('express');
const Sequelize = require('sequelize');

const router = express.Router();
const sequelize = new Sequelize('postgres://user:pass@localhost:5432/db');

class Tasks extends Sequelize.Model {}

Tasks.init({
  category: Sequelize.STRING,
  description: Sequelize.TEXT,
  started_at: Sequelize.DATE,
  finished_at: Sequelize.DATE
}, { sequelize, modelName: 'task' });

router.get('/', function(req, res, next) {
  sequelize
    .query(`
      select
      sum(extract (epoch from (finished_at - started_at))::integer/60) expended_minutes, to_char(finished_at, 'DD-MM') date, category
      from tasks
      group by date, category
      order by date asc
    `, {
      model: Tasks,
    })
    .then(tasksAgg => {
      Tasks.findAll({
        where: {
          started_at: {
            [Sequelize.Op.gte]: moment().subtract(30, 'days').toDate()
          },
        },
        order: [
          ['started_at', 'ASC'],
        ],
      })
      .then(tasks =>
        res.render('index', { tasksAgg: tasksAgg.map((task) => task.dataValues), tasks })
      );
    });
});

module.exports = router;
