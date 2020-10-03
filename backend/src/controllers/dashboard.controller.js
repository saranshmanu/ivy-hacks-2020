const async = require('async')
const _ = require('lodash')
const { Vaccination } = require('../models');

const insights = (req, res) => {
    async.autoInject({
        timeline: (cb) => {
            return Vaccination.find({}, function(error, data) {
                if(error) return cb(error)
                var sorted = {}
                data.map((record) => {
                    const date = new Date(record.createdAt)
                    sorted[date.toLocaleDateString()] == null ? 
                        sorted[date.toLocaleDateString()] = 1:
                        sorted[date.toLocaleDateString()] += 1
                })
                return cb(null, sorted)
            })
        },
        manufacturer: (cb) => {
            return Vaccination.find({}, function(error, data) {
                if(error) return cb(error)
                var sorted = {}
                data.map((record) => {
                    const name = record.manufacturer.vaccineName + ', ' + record.manufacturer.name
                    sorted[name] == null ? 
                        sorted[name] = 1:
                        sorted[name] += 1
                })
                return cb(null, sorted)
            }).populate('manufacturer')
        },
        location: (cb) => {
            return Vaccination.find({}, function(error, data) {
                if(error) return cb(error)
                var sorted = {}
                data.map((record) => {
                    const location = record.distributor.state
                    sorted[location] == null ? 
                        sorted[location] = 1:
                        sorted[location] += 1
                })
                return cb(null, sorted)
            }).populate('distributor')
        },

    }, (error, data) => {
        if(error) return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            data: error
        });
        return res.status(201).json({
            statusCode: 201,
            message: 'Fetched Insights',
            data: data
        });
    })
};

module.exports = {
    insights
};
  