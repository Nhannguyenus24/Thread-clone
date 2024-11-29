const models = require("./models");

app.get('/sync', (req, res) => {
  models.sequelize.sync().then( () => {
    res.send('Database sync completed!');
  });
});