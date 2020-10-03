const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema(
	{
		manufacturer: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Manufacturer',
			required: true
		},
		distributor: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
			required: true
        },
        person: {
            type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
			required: true
		},
		vaccineSignature: {
			type: mongoose.SchemaTypes.String,
			required: false
		}
	},
	{
		timestamps: true,
		toObject: { getters: true },
		toJSON: { getters: true }
	}
);

const Token = mongoose.model('Vaccination', tokenSchema);

module.exports = Token;
