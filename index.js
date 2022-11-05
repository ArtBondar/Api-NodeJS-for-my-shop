const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./models');
db.sequelize.sync();

app.get("/", (req, res) =>{
  res.json({message: "Welcome to my APP REST API"});
});

require("./routes/category.route")(app);
require("./routes/product.route")(app);
require("./routes/user.route")(app);
require("./routes/basket.route")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});