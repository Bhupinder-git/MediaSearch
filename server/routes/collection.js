// Collection routes
const express = require("express");
const router = express.Router();

// Import controllers
const {
  getCollection,
  addToCollection,
  removeFromCollection,
  clearCollection,
} = require("../controllers/user");

// Import middleware
const authentication = require("../middlewares/authentication");

// All collection routes are protected
router.get("/", authentication, getCollection);
router.post("/", authentication, addToCollection);
router.delete("/", authentication, clearCollection);
router.delete("/:itemId", authentication, removeFromCollection);

module.exports = router;
