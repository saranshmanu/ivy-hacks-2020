import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import Constants from '../constants';
import cookie from 'react-cookies'
import configuration from '../../configuration.js'

let _store = {
	id: '',
	role: '',
	email: '',
	name: '',
	token: ''
};

class Store extends EventEmitter {
	constructor() {
		super();
		this.registerToActions = this.registerToActions.bind(this);
		this.loginRequest = this.loginRequest.bind(this);
		this.registerRequest = this.registerRequest.bind(this);
		Dispatcher.register(this.registerToActions.bind(this));
	}

	registerToActions({ actionType, payload }) {
		switch (actionType) {
			case Constants.LOGIN_ACTION:
				this.loginRequest(payload);
				break;
			case Constants.REGISTER_ACTION:
				this.registerRequest(payload);
				break;
			default:
		}
	}

	registerRequest(payload) {
		const baseURL = configuration
		fetch(baseURL + '/auth/register', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"role": payload.role,
				"name": payload.name,
				"email": payload.email,
				"password": payload.password,
				"state": payload.state
			})
		})
		.then(function(res) { return res.json(); })
		.then(function(data) { 
			try {
				_store.token = data.tokens.access.token
				_store.id = data.user.id
				_store.name = data.user.name
				_store.email = data.user.email
				_store.role = data.user.role
				cookie.save('token', _store.token, { path: '/' })
				this.emit(Constants.REGISTER); 
			} catch(e) {
				console.log(e)
			}
		}.bind(this));
	}

	loginRequest(payload) {
		const baseURL = configuration
		const email = payload.email;
		const password = payload.password;
		fetch(baseURL + '/auth/login', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: email, password: password })
		})
		.then(function(res) { return res.json(); })
		.then(function(data) { 
			try {
				_store.token = data.tokens.access.token
				_store.id = data.user.id
				_store.name = data.user.name
				_store.email = data.user.email
				_store.role = data.user.role
				cookie.save('token', _store.token, { path: '/' })
				this.emit(Constants.LOGIN); 
			} catch(e) {
				console.log(e)
			}
		}.bind(this));
	}

	getToken() {
		return cookie.load('token');
	}

	getRole() {
		return _store.role;
	}

	addLoginListener(callback) {
		this.on(Constants.LOGIN, callback);
	}

	removeLoginListener(callback) {
		this.removeListener(Constants.LOGIN, callback);
	}

	addRegisterListener(callback) {
		this.on(Constants.REGISTER, callback);
	}

	removeRegisterListener(callback) {
		this.removeListener(Constants.REGISTER, callback);
	}
}

export default new Store();
