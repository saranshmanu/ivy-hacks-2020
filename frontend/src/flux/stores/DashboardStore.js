import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import Constants from '../constants';
import CovidData from '../../utils/CovidData.json'
import configuration from '../../configuration.js'
import _ from 'lodash'

let _store = {
    manufacturer: [],
    vaccinatedToday: 0,
    vaccinatedTotal: 0,
    timelineTotalDays: 6,
    totalVaccinations: 0,
    totalPopulation: 0,
    location: CovidData,
    timeline: [],
};

class Store extends EventEmitter {
	constructor() {
		super();
		this.registerToActions = this.registerToActions.bind(this);
		this.insightRequest = this.insightRequest.bind(this);
		Dispatcher.register(this.registerToActions.bind(this));
	}

	registerToActions({ actionType, payload }) {
		switch (actionType) {
			case Constants.GET_INSIGHT:
				this.insightRequest(payload);
				break;
			default:
		}
    }
    
    getDateBefore = (days) => {
        const today = new Date()
        var date = new Date(new Date().setDate(today.getDate() - days))
        return date.toLocaleDateString()
    }

	insightRequest() {
		const baseURL = configuration
		fetch(baseURL + '/dashboard', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(function(res) { return res.json(); })
		.then(function(data) { 
			try {
                // data manipulation for location wise
                var totalVaccinations = 0
                var totalPopulation = 0
                const flag = _store.location
                flag.map((record, index) => {
                    totalPopulation += record.population
                })
                Object.keys(data.data.location).map((state) => {
                    const vaccinatedPeople = data.data.location[state]
                    const flag = _store.location
                    totalVaccinations += vaccinatedPeople
                    flag.map((record, index) => {
                        if(record.name == state) {
                            flag[index].vaccinated = vaccinatedPeople
                        }
                    })
                    _store.location = flag
                })
                _store.totalVaccinations = totalVaccinations
                _store.totalPopulation = totalPopulation
                // data manipulation for daywise cases
                _store.date = {}
                _store.vaccinatedTotal = 0
                Object.keys(data.data.timeline).map((day) => {
                    const date = new Date(day)
                    _store.vaccinatedTotal += data.data.timeline[day]
                    _store.date[date.toLocaleDateString()] = data.data.timeline[day]
                })
                const dateToday = new Date()
                _store.vaccinatedToday = _store.date[dateToday.toLocaleDateString()]
                // data manipulation for timeline
                _store.timeline = []
                for(var i=_store.timelineTotalDays;i>=0;i--) {
                    const date = this.getDateBefore(i)
                    _store.timeline.push(_store.date[date])
                }
                // data manipulation by manufacturer
                _store.manufacturer = []
                const manufacturer = data.data.manufacturer
                Object.keys(manufacturer).map((vaccine) => {
                    _store.manufacturer.push({ name: vaccine, total: manufacturer[vaccine] })
                })
                this.emit(Constants.INSIGHT)
			} catch(e) {
				console.log(e)
			}
		}.bind(this));
	}

	getInformation() {
		return _store;
	}

	addInsightListener(callback) {
		this.on(Constants.INSIGHT, callback);
	}

	removeInsightListener(callback) {
		this.removeListener(Constants.INSIGHT, callback);
	}
}

export default new Store();
