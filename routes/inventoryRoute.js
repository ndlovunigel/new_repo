// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../validators/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by inventory detail
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

router.get('/trigger-error', (req, res, next) => {
    const error = new Error('This is an intentional 500 error.');
    error.status = 500;
    next(error);
  });

// Route to build management view
router.get("/", utilities.handleErrors((invController.buildManagement)));

// Route to add new classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

router.post("/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.insertClassification));

// Route to add new vehicle
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

router.post("/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.insertInventory)
);

module.exports = router;