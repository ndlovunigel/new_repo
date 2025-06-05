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

module.exports = invCont