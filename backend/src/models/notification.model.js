const mongoose = require('mongoose');

const schema = mongoose.Schema(
	{
        person: {
            type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
			required: true
        },
        message: {
            type: mongoose.SchemaTypes.String,
			default: '-'
        }
	},
	{
		timestamps: true,
		toObject: { getters: true },
		toJSON: { getters: true }
	}
);

const Notification = mongoose.model('Notification', schema);
module.exports = Notification;