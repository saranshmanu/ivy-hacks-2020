const mongoose = require('mongoose');

const schema = mongoose.Schema(
	{
        name: {
            type: mongoose.SchemaTypes.String,
            ref: 'Name',
			required: true
        },
        vaccineName: {
            type: mongoose.SchemaTypes.String,
            ref: 'VaccineName',
            unique: true,
			required: true
        },
        description: {
            type: mongoose.SchemaTypes.String,
			ref: 'Description',
			default: '-'
        }
	},
	{
		timestamps: true,
		toObject: { getters: true },
		toJSON: { getters: true }
	}
);

const Manufacturer = mongoose.model('Manufacturer', schema);
module.exports = Manufacturer;