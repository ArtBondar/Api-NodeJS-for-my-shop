const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data/ShopDBForApi.sqlite'
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.product = require('./product.model')(sequelize, Sequelize);
db.category = require('./category.model')(sequelize, Sequelize);
db.user = require('./user.model')(sequelize, Sequelize);
db.basket = require('./basket.model')(sequelize, Sequelize);

module.exports = db;