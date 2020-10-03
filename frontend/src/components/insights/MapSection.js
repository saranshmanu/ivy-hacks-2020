import React from 'react';
import { Card, CardBody } from 'shards-react';
import india from '../../utils/india-district.json';
import india_zones from '../../utils/zones.json';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dispatcher, Constants, DashboardStore } from "../../flux";


class MapSection extends React.Component {
	mapReference = React.createRef();
    map;

    componentWillMount() {
		DashboardStore.addInsightListener(this.onInsightFetch);
    }
	
	componentWillUnmount() {
		DashboardStore.removeInsightListener(this.onInsightFetch);
	}

	onInsightFetch() {
		this.updateLocationData()
	}
    
	componentDidMount() {
        var zone = {}, mapDataZone = [];
        india_zones.zones.map((feature) => zone[feature.district + feature.state] = feature.zone)
        india.features.map((region) => {
            const color = zone[region.properties.district + region.properties.st_nm];
            switch (color) {
                case 'Green': region.properties['count'] = 1000; break;
                case 'Orange': region.properties['count'] = 500; break;
                default: region.properties['count'] = 0; break;
            }
            mapDataZone.push(region);
        })
        india.features = mapDataZone;
        mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
        this.map = new mapboxgl.Map({
			container: this.mapReference.current,
			style: 'mapbox://styles/mapbox/light-v9',
			center: [ 78.9629, 20.5937 ],
			zoom: 3.5
        });
        var popup = new mapboxgl.Popup();
		this.map.on('mouseenter', 'vaccination', e => {
			var coordinates = e.features[0].geometry.coordinates.slice();
			var description = e.features[0].properties.description;
			popup = new mapboxgl.Popup({ closeOnClick: true })
				.setLngLat(coordinates)
				.setHTML(description)
				.addTo(this.map);
		});
		this.map.on('mouseleave', 'vaccination', () => popup.remove());
		this.map.on('load', () => {
            Dispatcher.dispatch({ actionType: Constants.GET_INSIGHT });
			this.map.addSource('country', {
				type: 'geojson',
				data: india
            });
			this.map.addLayer({
				id: 'country',
				type: 'fill',
				source: 'country',
				paint: { 'fill-opacity': 0.2 }
            });
            const { property, stops } = {
                name: 'Zone',
                description: 'Estimated zone',
                property: 'count',
                stops: [ [ 0, '#d73027' ], [ 500, '#fee08b' ], [ 1000, '#66bd63' ] ]
            }
            this.map.setPaintProperty('country', 'fill-color', {
                property,
                stops
            });
        });
        
    }

    async updateLocationData() {
        var vaccinationPoints = {
            type: 'FeatureCollection',
            features: []
        };
        this.props.data.map((state, _) => {
            const latitude = state.latitude, longitude = state.longitude, vaccinated = state.vaccinated, stateName = state.name
            const html = '<div style="background-color:white;padding:20px;margin-top:5px">' + 
                '<strong>People Vaccinated</strong><span> - ' + vaccinated + '</span></br>' + 
                '<strong>Active Cases</strong><span> - ' + state["active-cases"] + '</span></br>' + 
                '<strong>Total Cases</strong><span> - ' + state["total-cases"] + '</span></br>' + 
                '<strong>State</strong><span> - ' + stateName + '</span>' + 
            '</div>'
            vaccinationPoints.features.push({
				type: 'Feature',
				properties: {
                    'vaccinated': state.vaccinated,
                    'circle-color': "#ee9592",
                    'circle-stroke-width': 4,
                    'circle-stroke-opacity': 1,
					'description': html,
				},
				geometry: {
					type: 'Point',
					coordinates: [ longitude, latitude ]
				}
            })
        })
        try {
            this.map.addSource('vaccination', {
				type: 'geojson',
				data: vaccinationPoints
            });
			this.map.addLayer({
				id: 'vaccination',
				type: 'circle',
                source: 'vaccination',
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#e55e5e',
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.5,
                }
			});
        } catch(error) {
            console.log(error)
        }
    }

	render() {
		return (
            <Card small className="pt-3">
                <CardBody className="border-bottom text-center">
                    <div ref={this.mapReference} style={{ height: '500px', width: '100%', overflow: 'hidden' }} className="absolute top right left bottom" />
                </CardBody>
            </Card>
        )
    }

    constructor() {
        super()
        this.onInsightFetch = this.onInsightFetch.bind(this)
    }
}

export default MapSection;