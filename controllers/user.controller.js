const db = require("../models");
const User = db.user;
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
const JWT_SECRET = "dwad128d19rjn01938uj8924htjwodnbi9231h4ien1omnddwad128d19rjn01938uj8924htjwodnbi9231h4ien1omnddwad128d19rjn01938uj8924htjwodnbi9231h4ien1omnd";
const Basket = db.basket;

// Create and Save
exports.create = (req, res) => {
  // Validate request
  if (!req.body.email || !req.body.password) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create
  const user = {
    email: req.body.email,
    password: crypto.pbkdf2Sync(req.body.password, JWT_SECRET, 1000, 64, `sha512`).toString(`hex`),
    basket_id: null,
    is_admin: req.body.is_admin,
    balance: req.body.balance,
    token: null
  };
  // Save to db
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

exports.findAll = (req, res) => {
  User.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products."
      });
    });
};

// Find One
exports.findOne = (req, res) => {
  const id = req.params.id;
  User.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id = " + id
      });
    });
};

// Update 
exports.update = (req, res) => {
  const id = req.params.id;
  var data = req.body;
  var user_data = User.findByPk(id);
  user_data.email = data.email;
  user_data.is_admin = data.is_admin;
  user_data.balance = data.balance;
  User.update(user_data, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// Delete
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({ where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id = ${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Delete all
exports.deleteAll = (req, res) => {
  User.destroy({ where: {}, truncate: false })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};

// Get info for user
exports.info = (req, res) => {
  let email = "";
  // VERIFY TOKEN
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    email = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  // -- VERIFY TOKEN
  User.findOne({ where: { email: email } })
    .then(elem => {
      res.status(200).send({
        email: elem.email,
        balance: elem.balance,
        basket_id: elem.basket_id,
        is_admin: elem.is_admin,
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};

// Get Baskets for user
exports.userbasket = (req, res) => {
  // VERIFY TOKEN
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    User.findOne({ where: { email: decoded } })
      .then(elem => {
        Basket.findAll({ where: { user_id: elem.dataValues.id } })
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while removing all users."
            });
          });
      });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

function SetToken(id, token) {
  var user = User.findByPk(id);
  user.token = token;
  User.update(user, { where: { id: id } });
}

// Login
exports.login = (req, res) => {
  const email = req.body.email;
  if (!req.body.password || !email) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  User.findOne({ where: { email: email } })
    .then(elem => {
      if (elem.dataValues.password == crypto.pbkdf2Sync(req.body.password, JWT_SECRET, 1000, 64, `sha512`).toString(`hex`)) {
        const token = jwt.sign(email, JWT_SECRET);
        SetToken(elem.id, token);
        res.status(200).send({ token: token });
      }
      else
        res.status(500).send({ message: "Password not correct." });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};

// Register
exports.register = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  User.findOne({ where: { email: req.body.email, } })
    .then(elem => {
      res.status(500).send({ message: `Email ${elem.dataValues.email} is busy.` });
    })
    .catch(e => {
      const user = {
        email: req.body.email,
        password: crypto.pbkdf2Sync(req.body.password, JWT_SECRET, 1000, 64, `sha512`).toString(`hex`),
        is_admin: false,
        balance: 0
      };
      User.create(user)
        .then(data => {
          res.send(data);
        });
    });
};