const mongoose = require('mongoose');

const schema = mongoose.Schema(
	{
        quantity: {
            type: mongoose.SchemaTypes.Number,
			ref: 'Quantity',
            required: true,
            default: 1,
        },
        distributor: {
            type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
			required: true
        },
        manufacturer: {
            type: mongoose.SchemaTypes.ObjectId,
			ref: 'Manufacturer',
			required: true
        },
        approved: {
            type: mongoose.SchemaTypes.Boolean,
			ref: 'Approved',
			default: false
        },
        delivered: {
            type: mongoose.SchemaTypes.Boolean,
			ref: 'Delivered',
			default: false
        },
        description: {
            type: mongoose.SchemaTypes.String,
			ref: 'Description',
			default: 'No logistic data available'
        }
	},
	{
		timestamps: true,
		toObject: { getters: true },
		toJSON: { getters: true }
	}
);

const Order = mongoose.model('Order', schema);
module.exports = Order;