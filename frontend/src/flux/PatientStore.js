import { EventEmitter } from 'events';
import Dispatcher from './dispatcher';
import Constants from './constants';
import configuration from '../configuration.js'

let _store = {
	notifications: [],
    vaccinated: false,
    vaccination_history: [],
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
		Dispatcher.register(this.registerToActions.bind(this));
	}

	registerToActions({ actionType, payload }) {
		switch (actionType) {
			case Constants.FETCH_PATIENT_PROFILE:
				this.profileRequest(payload);
				break;
			default:
		}
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
                _store.vaccination_history = []
                const history = data.data.vaccination_history
                history.map((record) => {
                    _store.vaccination_history.push({
                        title: record.manufacturer.vaccineName + ', ' + record.manufacturer.name,
                        date: (new Date(record.createdAt)).toDateString()
                    })
				})
				_store.notifications = []
                const notifications = data.data.notifications
                notifications.map((notification) => {
					_store.notifications.push({
                        message: notification.message,
                        date: (new Date(notification.createdAt)).toDateString()
                    })
				})
				_store.signature = data.data.user._id
                _store.vaccinated = (history.length != 0) ? true: false
				_store.name = data.data.user.name
				_store.email = data.data.user.email
				_store.role = data.data.user.role
				this.emit(Constants.PATIENT_PROFILE); 
			} catch(e) {
				console.log(e)
			}
		}.bind(this));
	}

	getInformation() {
		return _store;
	}

	addPatientListener(callback) {
		this.on(Constants.PATIENT_PROFILE, callback);
	}

	removePatientListener(callback) {
		this.removeListener(Constants.PATIENT_PROFILE, callback);
	}
}

export default new Store();
