const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { Manufacturer, Order, User, Vaccination, Notification } = require('../models');
const async = require('async');
const _ = require('lodash');
const fetch = require('node-fetch');

const createUser = catchAsync(async (req, res) => {
	const user = await userService.createUser(req.body);
	res.status(httpStatus.CREATED).send(user.transform());
});

const getUser = catchAsync(async (req, res) => {
	return async.autoInject({
		user: (cb) => User.findById(req.user.id, cb).populate('inventory.id', '-_id -__v -createdAt -updatedAt'),
		vaccination_history: (cb) => Vaccination.find({ person: req.user.id }, cb).populate('manufacturer').populate('distributor', '-_id -__v -createdAt -updatedAt -inventory'),
		vaccine_manufacturer: (cb) => Manufacturer.find({}, cb),
		order_history: (user, cb) => Order.find({ distributor: user._id}, cb).populate('manufacturer'),
		distributor_history: (user, cb) => {
			if (user.role == "distributor") Vaccination.find({ distributor: user._id}, cb).populate('manufacturer', '-_id -__v -createdAt -updatedAt').populate('person', '-_id -__v -createdAt -updatedAt')
			else cb(null)
		},
		notifications: (cb) => Notification.find({person: req.user.id}, cb)
	}, (error, data) => {
		if (error)
			return res.status(500).json({
				statusCode: 500,
				message: 'Internal Server Error',
				data: error
			});
		return res.status(201).json({
			statusCode: 201,
			message: 'Fetched User Information',
			data: data
		});
	});
});

const placeVaccinationOrder = (req, res) => {
	return async.autoInject({
		distributor: (cb) => User.findById(req.user.id, cb),
		manufacturer: (cb) => Manufacturer.findById(req.body.manufacturer, cb),
		place_order: (manufacturer, distributor, cb) => {
			if(distributor.role == 'user') return cb('User not authorized for distribution')
			if(!manufacturer) return cb('Cannot find Manufacturer')
			return Order.create({
				quantity: req.body.quantity,
				distributor: req.user.id,
				manufacturer: req.body.manufacturer
			}, cb)
		},
		blockchain_update: (cb) => {
			try {
				const baseURL = "http://157.245.216.42:3000"
				fetch(baseURL + '/manufacturers/createVaccineBatch', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						"qty": req.body.quantity.toString(),
						"manufacturerId" : req.body.manufacturer,
						"distributorId" : req.user.id,
						"manufactureDate" : "01-Oct-2020",
						"expiryDate" : "02-Dec-2020"
					})
				})
				.then(res => { return res.json(); })
				.then(data => { })
			} catch {}
			cb(null, 'Updated')
		}
	}, (error, data) => {
		if (error)
			return res.status(500).json({
				statusCode: 500,
				message: 'Internal Server Error',
				data: error
			});
		return res.status(201).json({
			statusCode: 201,
			message: 'Placed Order',
			data: data
		});
	});
};

const vaccinatePatient = (req, res) => {
	const distributorUUID = req.user._id
	const patientUUID = req.body.patient
	const vaccineSignature = req.body.vaccineSignature
	const vaccineUUID = req.body.manufacturer.toString()

	return async.autoInject({
		patient: (cb) => User.findById(patientUUID, cb),
		manufacturer: (cb) => Manufacturer.findById(vaccineUUID, cb),
		inventory: (cb) => {
			const inventory = req.user.inventory
			var found = false
			inventory.map((vaccine, index) => {
				const uuid = vaccine.id.toString()
				if (uuid == vaccineUUID) {
					found = true
					if(vaccine.quantity == 0) return cb ('Vaccine out of stock')
					inventory[index].quantity -= 1
					return cb(null, inventory)
				} 
			})
			if(!found) return cb('Cannot find vaccine with the uuid')
		},
		vaccinate: (manufacturer, patient, cb) => {
			if(!patient) return cb('Signature is not valid')
			if(!manufacturer) return cb('Cannot find vaccine with the given id')
			Vaccination.create({
				vaccineSignature: vaccineSignature,
				manufacturer: vaccineUUID,
				person: patientUUID,
				distributor: distributorUUID
			}, cb)
		},
		update_inventory: (inventory, cb) => {
			User.updateOne({_id: distributorUUID}, { inventory: inventory }, cb)
		},
		patient_signature_shared_notification: (cb) => {
			Notification.create({
				person: patientUUID,
				message: 'Shared the signature for verification with ' + req.user.name
			}, cb)
		},
		successful_vaccination_notification: (manufacturer, cb) => {
			Notification.create({
				person: patientUUID,
				message: 'The patient got vaccinated with ' + manufacturer.vaccineName + ' by ' + req.user.name
			}, cb)
		},
		blockchain_update: (patient, cb) => {
			try {
				const baseURL = "http://157.245.216.42:3000"
				fetch(baseURL + '/vaccines/changeVaccineBatchOwner', {
					method: 'PATCH',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						"vaccineBatchId": "VACCINEa4e5039f-bf65-4ab5-b728-f3a63807cf79",
						"newOwner": patient._id
					})
				})
				.then(res => { return res.json(); })
				.then(data => { })
			} catch {}
			cb(null, 'Updated')
		}
	}, (error, data) => {
		if (error)
			return res.status(500).json({
				statusCode: 500,
				message: 'Internal Server Error',
				data: error
			});
		return res.status(201).json({
			statusCode: 201,
			message: 'Vaccinated Patient',
			data: data
		});
	});
};

module.exports = {
	createUser,
	getUser,
	placeVaccinationOrder,
	vaccinatePatient
};
