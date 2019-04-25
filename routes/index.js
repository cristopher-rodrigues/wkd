const moment = require('moment');
const express = require('express');
const Sequelize = require('sequelize');

const router = express.Router();
const database = process.env.DATABASE;
const databaseHost = process.env.DATABASE_HOST;
const databasePort = process.env.DATABASE_PORT;
const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;
const databaseURI = `postgres://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${database}`;
const sequelize = new Sequelize(databaseURI);

class Tasks extends Sequelize.Model {}

Tasks.init({
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
   },
}, { sequelize, modelName: 'task' });

router.post('/add-task', function(req, res, next){
  Tasks
    .create({
      createdAt: new Date(),
      category: req.body.category,
      description: req.body.description,
      started_at: new Date(req.body.started_at),
      finished_at: new Date(req.body.finished_at)
    }).then(function() {
        res.redirect('/');
    })
    .catch(function(err) {
        // print the error details
        console.log(err);
    });
});

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
