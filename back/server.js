const app = require('./app');
const sequelize = require('./config/database');


const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: false }) // Met à jour la table pour correspondre au modèle
  .then(() => {
    app.listen(PORT, () => { // Une fois que c'est fini, le serveur est démarré
        console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });