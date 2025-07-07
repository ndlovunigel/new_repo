const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const vehicleHtml = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()
  const pageTitle = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
  console.log(vehicleHtml)
  res.render("./inventory/detail", {
    title: pageTitle,
    nav,
    vehicleDetailHtml: vehicleHtml,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("message"),
  });
};

/* ***************************
 *  Build add new classsification rule view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: [],
    message: null,
  });
};

invCont.insertClassification = async function (req, res) {
  const { classification_name } = req.body;
  const nav = await utilities.getNav();
  const success = await invModel.addClassification(classification_name);
  if (success) {
    req.flash("message", "Classification added successfully.");
    const newNav = await utilities.getNav(); // refresh nav
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav: newNav,
      message: req.flash("message"),
    });
  } else {
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: [{ msg: "Failed to add classification." }],
      message: null,
    });
  }
};

/* ***************************
 *  Build add vehicle rule view
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    message: null,
    errors: [],
    classificationList,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: ""
  });
};

invCont.insertInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body;

  const classificationList = await utilities.buildClassificationList(classification_id);
  const result = await invModel.addInventory({
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  });

  if (result) {
    req.flash("message", "Inventory item successfully added.");
    res.redirect("/inv/");
  } else {
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      message: "Failed to add inventory item.",
      errors: [],
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    });
  }
};

module.exports = invCont