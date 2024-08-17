const { Router } = require("express");
const router = Router();
const  { get, put, migrate, gossip } = require("../controllers");
const { getconsistentindex } = require("../middlewares/getconsistentindex");

router.get("/get", getconsistentindex, get);

router.post("/put", getconsistentindex, put);

router.post("/migrate", migrate);

router.post("/gossip", gossip);

module.exports = {
    router
}