const httpStatus = require('http-status');
const async = require('async')
const _ = require('lodash')
const { Manufacturer, User, Order } = require('../models');
const fetch = require('node-fetch');

const createManufacturer = (req, res) => {
    async.autoInject({
        create: (cb) => Manufacturer.create(req.body, cb)
    }, (error, data) => {
        if(error) return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            data: error
        });
        return res.status(201).json({
            statusCode: 201,
            message: 'Created Manufacturer',
            data: data
        });
    })
};

const updateManufacturer = (req, res) => {
    async.autoInject({
        update: (cb) => Manufacturer.update(req.query.id, req.body, cb)
    }, (error, data) => {
        if(error) return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            data: error
        });
        return res.status(201).json({
            statusCode: 201,
            message: 'Updated Manufacturer',
            data: data
        });
    })
};

const getManufacturer = (req, res) => {
    async.autoInject({
        manufacturer: (cb) => Manufacturer.find({}, cb)
    }, (error, data) => {
        if(error) return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            data: error
        });
        return res.status(201).json({
            statusCode: 201,
            message: 'Found Manufacturer',
            data: data
        });
    })
};

const getVaccineOrder = (req, res) => {
    const manufacturerUUID = req.body.manufacturer.toString()
    async.autoInject({
        order: (cb) => Order.find({ manufacturer: manufacturerUUID }, cb)
    }, (error, data) => {
        if(error) return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            data: error
        });
        return res.status(201).json({
            statusCode: 201,
            message: 'Found Manufacturer Orders',
            data: data
        });
    })
}

const approveVaccineOrder = (req, res) => {
    const orderUUID = req.body.order
    const manufacturerUUID = req.body.manufacturer
    async.autoInject({
        order: (cb) => Order.findOne({ _id: orderUUID }, cb),
        approve_order: (order, cb) => {
            if(!order) return cb('No orders found')
            if(_.get(order, 'manufacturer') != manufacturerUUID) return cb('Order not placed by this manufacturer')
            if(_.get(order, 'approved') == true) return cb('Order already approved and delivered')
            return Order.updateOne({ _id: orderUUID }, {
                approved: true,
                delivered: true
            }, cb)
        },
        user: (order, cb) => User.findOne({_id: order.distributor}, cb),
        deliver_order: (user, order, cb) => {
            var inventory = user.inventory
            const vaccineUUID = order.manufacturer
            const index = _.findIndex(inventory, { id: vaccineUUID });
            if(index == -1) inventory.push({ id: vaccineUUID, quantity: order.quantity })
            else inventory[index].quantity += order.quantity
            User.updateOne({ _id: order.distributor }, {
                inventory: inventory
            }, cb)
        },
		blockchain_update: (order, cb) => {
			const baseURL = "http://157.245.216.42:3000"
			fetch(baseURL + '/vaccines/changeVaccineOwner', {
				method: 'PATCH',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					"vaccineId": "VACBATCH542e14f3-54d2-4e0d-abf1-35515f8907a1",
					"newOwner": order.distributor
				})
			})
			.then(res => { return res.json(); })
			.then(data => { 

			})
			cb(null, 'Updated')
		}
    }, (error, data) => {
        if(error) return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            data: error
        });
        return res.status(201).json({
            statusCode: 201,
            message: 'Approved and Delivered Distributor Orders',
            data: data
        });
    })
}

module.exports = {
  createManufacturer,
  updateManufacturer,
  getManufacturer,
  getVaccineOrder,
  approveVaccineOrder
};
