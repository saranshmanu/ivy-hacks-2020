const express = require('express');
const auth = require('../../middlewares/auth');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), userController.createUser)
  .get(auth(), userController.getUser)

router
  .route('/order')
  .post(auth(), userController.placeVaccinationOrder)

router
  .route('/vaccinate')
  .post(auth(), userController.vaccinatePatient)


module.exports = router;
