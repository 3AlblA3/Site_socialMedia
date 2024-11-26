const app = require('./app');
const sequelize = require('./config/database');


const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: false }) 
  .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });

