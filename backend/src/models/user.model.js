const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { omit, pick } = require('lodash');

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Invalid email');
				}
			}
		},
		state: {
			type: String,
			required: true,
			enum : [
				"Andaman and Nicobar Islands, India",
				"Andhra Pradesh, India",
				"Arunachal Pradesh, India",
				"Assam, India",
				"Bihar, India",
				"Chhattisgarh, India",
				"Delhi, India",
				"Goa, India",
				"Gujarat, India",
				"Haryana, India",
				"Himachal Pradesh, India",
				"Karnataka, India",
				"Kerala, India",
				"Ladakh, India",
				"Madhya Pradesh, India",
				"Maharashtra, India",
				"Nagaland, India",
				"Meghalaya, India",
				"Mizoram, India",
				"Manipur, India",
				"Odisha, India",
				"Rajasthan, India",
				"Sikkim, India",
				"Tamil Nadu, India",
				"Telangana, India",
				"Tripura, India",
				"Uttar Pradesh, India",
				"Uttarakhand, India",
				"West Bengal, India",
				"Jharkhand, India"
			],
		},
		inventory: {
			type: [{
				id: {
					type: mongoose.Schema.ObjectId,
					required: true,
					ref:'Manufacturer'
				},
				quantity: Number,
			}],
			default: []
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minlength: 8,
			validate(value) {
				if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
					throw new Error('Password must contain at least one letter and one number');
				}
			}
		},
		role: {
			type: String,
			default: 'user'
		}
	},
	{
		timestamps: true,
		toObject: { getters: true },
		toJSON: { getters: true }
	}
);

userSchema.methods.toJSON = function() {
	const user = this;
	return omit(user.toObject(), [ 'password' ]);
};

userSchema.methods.transform = function() {
	const user = this;
	return pick(user.toJSON(), [ 'id', 'email', 'name', 'role' ]);
};

userSchema.pre('save', async function(next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
