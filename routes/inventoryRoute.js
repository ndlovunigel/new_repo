// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by inventory detail
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

router.get('/trigger-error', (req, res, next) => {
    const error = new Error('This is an intentional 500 error.');
    error.status = 500;
    next(error);
  });

module.exports = router;