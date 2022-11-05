module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.INTEGER
        },
        img: {
            type: Sequelize.STRING
        },
        category_id: {
            type: Sequelize.INTEGER
        }
    });
    return Product;
};