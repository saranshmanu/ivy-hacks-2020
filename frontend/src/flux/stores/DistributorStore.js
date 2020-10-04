import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import Constants from '../constants';
import configuration from '../../configuration.js'

let _store = {
	errorMessage: '',
	manufacturers: [],
	inventory: [],
	orders: [],
    distributor_history: [],
    role: '',
    signature: '',
    name: '',
    email: ''
};

class Store extends EventEmitter {
	constructor() {
		super();
		this.registerToActions = this.registerToActions.bind(this);
		this.profileRequest = this.profileRequest.bind(this);
		this.placeVaccineOrder = this.placeVaccineOrder.bind(this);
		this.vaccinatePatient = this.vaccinatePatient.bind(this);
		Dispatcher.register(this.registerToActions.bind(this));
	}

	registerToActions({ actionType, payload }) {
		switch (actionType) {
			case Constants.FETCH_DISTRIBUTOR_PROFILE:
				this.profileRequest(payload);
				break;
			case Constants.PLACE_VACCINE_ORDER:
				this.placeVaccineOrder(payload);
				break;
			case Constants.VACCINATE_PATIENT:
				this.vaccinatePatient(payload);
				break;
			default:
		}
	}

	vaccinatePatient(payload) {
		const baseURL = configuration
		fetch(baseURL + '/users/vaccinate', {
			method: 'POST',
			headers: {
                Authorization: 'bearer ' + payload.token,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"patient": payload.patient,
				"manufacturer": payload.manufacturer,
				"vaccineSignature": payload.vaccineSignature
			})
		})
		.then(function(res) { return res.json(); })
		.then(function(data) { 
			try {
				if(data.statusCode == 201) this.emit(Constants.VACCINATE); 
				else {
					_store.errorMessage = data.message
					this.emit(Constants.FAILED_VACCINATION)
				}
			} catch(e) {
				console.log(e)
			}
		}.bind(this));
	}

	placeVaccineOrder(payload) {
		const baseURL = configuration
		fetch(baseURL + '/users/order', {
			method: 'POST',
			headers: {
                Authorization: 'bearer ' + payload.token,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"manufacturer": payload.manufacturer,
				"quantity": payload.quantity,
			})
		})
		.then(function(res) { return res.json(); })
		.then(function(data) { 
			try {
				if(data.statusCode == 201) this.emit(Constants.VACCINE_ORDER); 
			} catch(e) {
				console.log(e)
			}
		}.bind(this));
	}

	profileRequest(payload) {
		const baseURL = configuration
		fetch(baseURL + '/users', {
			method: 'GET',
			headers: {
                Authorization: 'bearer ' + payload.token,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(function(res) { return res.json(); })
		.then(function(data) { 
			try {
				_store.inventory = []
				const inventory = data.data.user.inventory
                inventory.map((vaccine) => {
                    _store.inventory.push({
                        name: vaccine.id.vaccineName + ', ' + vaccine.id.name,
                        total: vaccine.quantity
                    })
				})
				_store.distributor_history = []
				const distributor_history = data.data.distributor_history
                distributor_history.map((vaccinated_person) => {
                    _store.distributor_history.push({
						name: vaccinated_person.person.name,
                        vaccine: vaccinated_person.manufacturer.vaccineName + ', ' + vaccinated_person.manufacturer.name,
                        date: new Date(vaccinated_person.createdAt)
                    })
				})
				_store.orders = []
				const order_history = data.data.order_history
                order_history.map((order) => {
                    _store.orders.push({
						name: order.manufacturer.name,
						quantity: order.quantity,
						delivered: order.delivered,
						approved: order.approved,
                        date: new Date(order.createdAt)
                    })
				})
				_store.manufacturers = data.data.vaccine_manufacturer
				_store.signature = data.data.user._id
				_store.name = data.data.user.name
				_store.email = data.data.user.email
				_store.role = data.data.user.role
				this.emit(Constants.DISTRIBUTOR_PROFILE); 
			} catch(e) {
				console.log(e)
			}
		}.bind(this));
	}

	getInformation() {
		return _store;
	}

	addProfileRequestListener(callback) {
		this.on(Constants.DISTRIBUTOR_PROFILE, callback);
	}

	removeProfileRequestListener(callback) {
		this.removeListener(Constants.DISTRIBUTOR_PROFILE, callback);
	}

	addPlaceVaccineOrderListener(callback) {
		this.on(Constants.VACCINE_ORDER, callback);
	}

	removePlaceVaccineOrderListener(callback) {
		this.removeListener(Constants.VACCINE_ORDER, callback);
	}

	addVaccinatePatientListener(callback) {
		this.on(Constants.VACCINATE, callback);
	}

	removeVaccinatePatientListener(callback) {
		this.removeListener(Constants.VACCINATE, callback);
	}

	addFailedVaccinationListener(callback) {
		this.on(Constants.FAILED_VACCINATION, callback);
	}

	removeFailedVaccinationListener(callback) {
		this.removeListener(Constants.FAILED_VACCINATION, callback);
	}


}

export default new Store();
