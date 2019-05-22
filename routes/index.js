const moment = require('moment');
const express = require('express');
const Sequelize = require('sequelize');
const models = require('../models/');

const router = express.Router();

router.post('/add-task', function(req, res, next){
  const started_at = new Date(`${req.body.started_at_date} ${req.body.started_at_time}`);
  const finished_at = new Date(`${req.body.finished_at_date} ${req.body.finished_at_time}`);

  models.Task
    .create({
      category: req.body.category,
      description: req.body.description,
      started_at,
      finished_at
    }).then(function() {
        res.redirect('/');
    })
    .catch(function(err) {
      console.log(err);
    });
});

router.get('/', function(req, res, next) {
  models.sequelize
    .query(`
      select
      sum(extract (epoch from (finished_at - started_at))::integer/60) expended_minutes, to_char(finished_at, 'MM-DD') date, category
      from "Tasks"
      group by date, category
      order by date asc
    `, {
      model: models.Task,
    })
    .then(tasksAgg => {
      models.Task.findAll({
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
