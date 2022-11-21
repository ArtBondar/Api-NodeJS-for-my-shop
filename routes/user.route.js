module.exports = app => {
    const user = require("../controllers/user.controller.js");
    const router = require("express").Router();

    router.post("/", user.create);

    router.post("/login", user.login);

    router.post("/register", user.register);

    router.get("/info", user.verifyToken, user.info);

    router.get("/", user.findAll);

    router.get("/:id", user.findOne);

    router.put("/:id", user.update);

    router.delete("/:id", user.delete);

    router.delete("/", user.deleteAll);

    app.use('/api/user', router)
}