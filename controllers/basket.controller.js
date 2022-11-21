const db = require("../models");
const Basket = db.basket;
const Op = db.Sequelize.Op;

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