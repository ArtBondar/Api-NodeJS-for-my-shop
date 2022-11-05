module.exports = app => {
    const category = require("../controllers/category.controller");
    const router = require("express").Router();

    router.post("/", category.create);

    router.get("/", category.findAll);

    router.get("/:id", category.findOne);

    router.put("/:id", category.update);

    router.delete("/:id", category.delete);

    router.delete("/", category.deleteAll);

    app.use('/api/category', router)
}