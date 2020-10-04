import React from 'react';
import millify from 'millify';
import { Container, Row, Col, Button, Modal, ModalBody, ModalHeader, ListGroupItem, ListGroup } from "shards-react";
import { PageTitle, VaccinationTimeline, VaccineManufacturer, VaccineRegionDistributionTable, DailyInsights, MapSection } from '../../components';
import { DashboardStore } from "../../flux";

class DashboardView extends React.Component {

	componentWillMount() {
		DashboardStore.addInsightListener(this.onInsightFetch);
    }
	
	componentWillUnmount() {
		DashboardStore.removeInsightListener(this.onInsightFetch);
	}

	onInsightFetch() {
		const data = DashboardStore.getInformation()
        this.setState({
			vaccines: data.manufacturer,
			vaccinatedTotal: data.vaccinatedTotal,
			vaccinatedToday: data.vaccinatedToday,
			timeline: data.timeline,
			timelineTotalDays: data.timelineTotalDays,
			locations: data.location,
			totalPopulation: data.totalPopulation,
			totalVaccinations: data.totalVaccinations
        })
	}

	togglePredictionModal = () => this.setState({ predictionModal: !this.state.predictionModal })

	render() {
		return (
			<Container fluid className="main-content-container pb-4">
				<Modal size="lg" open={this.state.predictionModal} toggle={this.togglePredictionModal}>
					<ModalHeader>{'Herd Immunity'}</ModalHeader>
					<ModalBody>
						<div className="p-3">
							<h3>One-Tracker predicts...</h3>
							<span>
								Vaccinations required to achieve Herd Immunity. When a high percentage
								of the population is vaccinated, it is difficult for infectious diseases to spread, because there are not many
								people who can be infected.
							</span>
							<div className="mt-3" style={{ height: 400, overflow: 'scroll', border: '1px solid #eee' }}>
								<ListGroup small flush className="list-group-small">
									{this.state.locations.map((item, idx) => (
										<ListGroupItem key={idx} className="d-flex px-3" style={{border: '0px'}}>
											<span className="text-semibold text-fiord-blue"><i>{item.name}</i></span>
											<span className="ml-auto text-right text-semibold text-reagent-gray">{parseInt((item.population - item.vaccinated)*0.4)}</span>
										</ListGroupItem>
									))}
								</ListGroup>
							</div>
							<p className="mt-4">
								<i>"People yet to receive vaccination for achieving Herd Immunity in the region"</i>
								<h4 style={{backgroundColor: '#a91101', color: 'white', padding: 10, borderRadius: 10, marginTop: 15, textAlign: 'right'}}>
									= {millify((this.state.totalPopulation - this.state.totalVaccinations)*0.4)}
								</h4>
							</p>
						</div>
					</ModalBody>
				</Modal>
				<Row>
					<Col lg="1"/>
					<Col lg="5">
						<Row>
							<Col lg="12">
								<PageTitle title={'Heatmap'} subtitle="One Tracker" md="12" className="ml-sm-auto mr-sm-auto" />
								<MapSection data={this.state.locations} />
								<Button onClick={this.togglePredictionModal} size="lg" style={{width: '100%'}}>
									{'Get Predictions'}
								</Button>
							</Col>
							<Col lg="12">
								<PageTitle title={'Vaccination Timeline'} subtitle="One Tracker" md="12" className="ml-sm-auto mr-sm-auto" />
								<VaccinationTimeline days={this.state.timelineTotalDays} data={this.state.timeline} />
							</Col>
							<Col lg="12">
								<PageTitle title={'Vaccine Manufacturer'} subtitle="One Tracker" md="12" className="ml-sm-auto mr-sm-auto" />
								<VaccineManufacturer data={this.state.vaccines} />
							</Col>
						</Row>
					</Col>
					<Col lg="5">
						<Row>
							<Col lg="12">
								<PageTitle title={'Daily Insights'} subtitle="One Tracker" md="12" className="ml-sm-auto mr-sm-auto" />
								<DailyInsights vaccinatedTotal={this.state.vaccinatedTotal} vaccinatedToday={this.state.vaccinatedToday} />
							</Col>
							<Col lg="12">
								<PageTitle title={'Region Distribution'} subtitle="One Tracker" md="12" className="ml-sm-auto mr-sm-auto" />
								<VaccineRegionDistributionTable data={this.state.locations} />
							</Col>
						</Row>
					</Col>
					<Col lg="1"/>
				</Row>
			</Container>
		)
	}

	constructor() {
		super();
		this.onInsightFetch = this.onInsightFetch.bind(this);
		this.state = {
			totalVaccinations: 0,
			totalPopulation: 0,
			predictionModal: false,
			timelineTotalDays: 0,
			timeline: [],
			vaccinatedTotal: 0,
			vaccinatedToday: 0,
			vaccines: [],
			locations: []
		};
	}
}

export default DashboardView;
