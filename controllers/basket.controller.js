const db = require("../models");
const Basket = db.basket;
const User = db.user;
const Product = db.product;
const jwt = require('jsonwebtoken');
const JWT_SECRET = "dwad128d19rjn01938uj8924htjwodnbi9231h4ien1omnddwad128d19rjn01938uj8924htjwodnbi9231h4ien1omnddwad128d19rjn01938uj8924htjwodnbi9231h4ien1omnd";


// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.user_id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create
  const basket = {
    user_id: req.body.user_id,
    product_id: req.body.product_id,
    count: req.body.count,
    is_paid: req.body.is_paid
  };

  // Save
  Basket.create(basket)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Basket."
      });
    });
};

exports.findAll = (req, res) => {
  Basket.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving baskets."
      });
    });
};

// Find One
exports.findOne = (req, res) => {
  const id = req.params.id;
  Basket.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Basket with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Basket with id=" + id
      });
    });
};

// Update
exports.update = (req, res) => {
  const id = req.params.id;
  Basket.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Basket was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Basket with id=${id}. Maybe Basket was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Basket with id=" + id
      });
    });
};

// Delete
exports.delete = (req, res) => {
  const id = req.params.id;
  Basket.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Basket was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Basket with id=${id}. Maybe Basket was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Basket with id=" + id
      });
    });
};

// Delete all
exports.deleteAll = (req, res) => {
  Basket.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Baskets were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all baskets."
      });
    });
};

exports.basketpaid = (req, res) => {
  // VERIFY TOKEN
  const { authorization } = req.headers;
  const id = req.params.id;
  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    User.findOne({ where: { email: decoded } })
      .then(elem => {
        const user_balance = elem.dataValues.balance;
        const user_id = elem.dataValues.id;
        Basket.findByPk(id)
          .then(data => {
            var product_price = 0.0;
            var product_count = data.count;
            console.log(`product_id: ${data.product_id}`);
            Product.findByPk(data.product_id)
              .then(data => {
                product_price = data.price;
                console.log(`price: ${product_price}, count: ${product_count}, user balance: ${user_balance}`);
                //
                if (user_balance >= (product_price * product_count)) {
                  //
                  var user_data = { balance: user_balance - (product_price * product_count) };
                  console.log(user_data);
                  User.update(user_data, { where: { id: user_id } })
                    .then(num => {
                      Basket.update({ is_paid: true }, {
                        where: { id: id }
                      })
                        .then(num => {
                          res.status(200).send({
                            message: "Basket was paid."
                          });
                        });
                    });
                } else {
                  res.status(404).send({
                    message: `Balance < Price...`
                  });
                }
              });
          })
          .catch(err => {
            res.status(500).send({
              message: "Error retrieving Basket with id=" + id
            });
          });
      });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

exports.basketproduct = (req, res) => {
  const { authorization } = req.headers;
  const product_id = req.body.product_id;
  const count = req.body.count;
  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    User.findOne({ where: { email: decoded } })
      .then(elem => {
        const basket = {
          user_id: elem.dataValues.id,
          product_id: product_id,
          count: count,
          is_paid: false
        };
        // Save
        Basket.create(basket)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Basket."
            });
          });
      });
  }
  catch (err) {
    return res.status(401).send("Invalid Token");
  }
};