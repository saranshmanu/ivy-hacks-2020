const express = require('express');
const manufacturerController = require('../../controllers/manufacturer.controller');
const router = express.Router();

router
  .route('/')
  .get(manufacturerController.getManufacturer)
  .post(manufacturerController.createManufacturer)

router
  .route('/:id')
  .put(manufacturerController.updateManufacturer)

router
  .route('/order')
  .get(manufacturerController.getVaccineOrder)

router
  .route('/order/approve')
  .post(manufacturerController.approveVaccineOrder)

module.exports = router;
