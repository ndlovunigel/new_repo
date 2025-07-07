const { body, validationResult } = require("express-validator");

const classificationRules = () => {
  return [body("classification_name")
    .trim()
    .isLength({ min: 1 })
    .isAlphanumeric()
    .withMessage("Only letters and numbers are allowed.")];
};

const checkClassificationData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = req.nav;
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      message: null,
    });
  } else {
    next();
  }
};

const inventoryRules = () => {
  return [
    body("classification_id").isInt().withMessage("Classification is required."),
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Valid year required."),
    body("inv_description").trim().notEmpty().withMessage("Description required."),
    body("inv_image").trim().notEmpty().withMessage("Image path required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Valid price required."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Valid mileage required."),
    body("inv_color").trim().notEmpty().withMessage("Color required."),
  ];
};

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await require("../utilities/").getNav();
  const classificationList = await require("../utilities/").buildClassificationList(req.body.classification_id);

  if (!errors.isEmpty()) {
    return res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      message: null,
      errors: errors.array(),
      classificationList,
      ...req.body
    });
  }
  next();
};

module.exports = { classificationRules, checkClassificationData, inventoryRules, checkInventoryData };