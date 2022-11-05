module.exports = (sequelize, Sequelize) => {
    const Basket = sequelize.define("basket", {
        user_id: {
            type: Sequelize.INTEGER
        },
        product_id: {
            type: Sequelize.INTEGER
        },
        count: {
            type: Sequelize.INTEGER
        },
        is_paid: {
            type: Sequelize.BOOLEAN
        }
    });
    return Basket;
};