const express = require("express");
const {allMessages,sendMessage} = require("../Control/messagecon");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

 router.route("/").post(protect, sendMessage);
 router.route("/:chatId").get(protect, allMessages);

module.exports = router;