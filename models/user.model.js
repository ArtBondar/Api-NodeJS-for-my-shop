module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        balance: {
            type: Sequelize.INTEGER
        },
        basket_id: {
            type: Sequelize.INTEGER
        },
        is_admin: {
            type: Sequelize.BOOLEAN
        },
        token: {
            type: Sequelize.STRING
        }
    });
    return User;
};