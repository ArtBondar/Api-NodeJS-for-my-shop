module.exports = app => {
    const basket = require("../controllers/basket.controller");
    const router = require("express").Router();

    router.post("/", basket.create);

    router.get("/", basket.findAll);

    router.get("/:id", basket.findOne);

    router.put("/:id", basket.update);

    router.delete("/:id", basket.delete);

    router.delete("/", basket.deleteAll);

    router.get("/paid/:id", basket.basketpaid);

    app.use('/api/basket', router)
}