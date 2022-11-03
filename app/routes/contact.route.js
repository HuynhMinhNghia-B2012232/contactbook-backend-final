const express = require("express");
const contacts = require("../controllers/contact.controller.js");
const user = require("../controllers/user.controller");

const router = express.Router();

router
  .route("/")
  .get(contacts.findAll)
  .post(user.protect, contacts.create)
  .delete(contacts.deleteAll);

router.route("/favorite").get(contacts.findAllFavorite);

router.route("/getallofme").get(user.protect, contacts.findAllOfMe);
router.route("/deleteallofme").get(user.protect, contacts.deleteAllOfMe);

router
  .route("/:id")
  .get(contacts.findOne)
  .put(contacts.update)
  .delete(contacts.delete);

module.exports = router;
