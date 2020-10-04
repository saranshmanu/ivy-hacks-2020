import React from 'react';
import { Scanner, PageTitle, DistributorCard, ScannedHistory, OrderHistory, VaccineInventory } from '../../components';
import { Container, Row, Col, Modal, ModalBody, ModalHeader, FormSelect, Button, Form, FormGroup, FormInput, Alert } from "shards-react";
import { Dispatcher, Constants, AuthStore, DistributorStore } from "../../flux";

class DistributorView extends React.Component {

	toggleScannerModal = () => this.setState({ openScannerModal: !this.state.openScannerModal })
	toggleRequestVaccineModal = () => this.setState({ openRequestVaccineModal: !this.state.openRequestVaccineModal })
	placeVaccineOrder = () => {
		Dispatcher.dispatch({ 
			actionType: Constants.PLACE_VACCINE_ORDER,
			payload: {
				token: AuthStore.getToken(),
				manufacturer: this.state.selectedVaccineOrderManufacturerUUID,
				quantity: this.state.selectedVaccineOrderQuantity
			} 
		});
	}
	setVaccineSignature = (vaccineSignature) => {
		if(!vaccineSignature) return
		this.setState({
			vaccineSignature: vaccineSignature,
			step: 1,
		})
	}
	vaccinatePatient = (patientSignature) => {
		if(!patientSignature) return
		Dispatcher.dispatch({ 
			actionType: Constants.VACCINATE_PATIENT,
			payload: {
				token: AuthStore.getToken(),
				patient: patientSignature,
				manufacturer: this.state.selectedVaccineManufacturerUUIDForVaccination,
				vaccineSignature: this.state.vaccineSignature
			} 
		});
	}

	render() {
		const vaccineScanner = () => {
			return (
				<div>
					<h4 className="mb-4">{'Vaccine Signature'}</h4>
					<p className="mb-4"><i>
						The signature is shared by the pharmaceutical manufacturer for 
						the authenticity of the vaccine administered to the patient
					</i></p>
					<Scanner scan={this.setVaccineSignature} />
				</div>
			)
		}
		const patientScanner = () => {
			return (
				<div>
					<div className="mb-3">
						<h4 className="mb-4">{'Patient Signature'}</h4>
						<b>{'Select the vaccine used in the process'}</b>
						<FormSelect onChange={(e) => this.setState({ selectedVaccineManufacturerUUIDForVaccination: e.currentTarget.value })}>
							{this.state.vaccine_manufacturer.map((vaccine) => (
								<option value={vaccine._id}>{vaccine.name}</option>
							))}
						</FormSelect>
					</div>
					<p className="mb-3"><i>{'Scan the patient unique signature after the successful distribution of the COVID-19 vaccine'}</i></p>
					<Scanner scan={this.vaccinatePatient} />
				</div>
			)
		}
		return (
			<Container fluid className="main-content-container pb-4">
				<Alert theme={this.state.alertType} dismissible={this.dismissAlert} open={this.state.visibleAlert}>
					{this.state.alertMessage}
				</Alert>
				<Modal open={this.state.openScannerModal} toggle={this.toggleScannerModal}>
					<ModalHeader>{'Signature Scanner'}</ModalHeader>
					<ModalBody>{this.state.step == 0 ? vaccineScanner(): patientScanner()}</ModalBody>
				</Modal>
				<Modal open={this.state.openRequestVaccineModal} toggle={this.toggleRequestVaccineModal}>
					<ModalHeader>{'Request Vaccine'}</ModalHeader>
					<ModalBody>
						<div className="mb-3">
							<div className="mb-3">
								<i>{'Select the vaccine to be ordered from the manufacturer'}</i>
							</div>
							<div className="pb-3">
								<Form>
									<FormGroup>
										<label htmlFor="#quantity">{'Quantity'}</label>
										<FormInput id="#quantity" 
											onChange={(e) => this.setState({ selectedVaccineOrderQuantity: e.target.value })}
											placeholder="Number of Batches" />
									</FormGroup>
									<FormSelect onChange={(e) => this.setState({ selectedVaccineOrderManufacturerUUID: e.currentTarget.value })}>
										{this.state.vaccine_manufacturer.map((vaccine) => (
											<option id={vaccine._id} value={vaccine._id}>{vaccine.name}</option>
										))}
									</FormSelect>
								</Form>
							</div>
							<Button onClick={this.placeVaccineOrder}>{'Place Order'}</Button>
						</div>
					</ModalBody>
				</Modal>
				<Row>
					<Col lg="2"/>
					<Col lg="4">
						<Row>
							<Col lg="12">
								<PageTitle title={'Distributor'} subtitle="One Tracker" md="12" className="ml-sm-auto mr-sm-auto" />
								<DistributorCard name={this.state.name} requestVaccineModal={this.toggleRequestVaccineModal} scannerModal={this.toggleScannerModal} />
							</Col>
							<Col lg="12">
								<PageTitle title={'Vaccine Inventory'} subtitle="One Tracker" md="12" className="ml-sm-auto mr-sm-auto" />
								<VaccineInventory data={this.state.inventory} />
							</Col>
						</Row>
					</Col>
					<Col lg="4">
						<Row>
							<Col lg="12">
							<	PageTitle title={'Order History'} subtitle="One Tracker" md="12" className="ml-sm-auto mr-sm-auto" />
								<OrderHistory data={this.state.order_history} />
							</Col>
							<Col lg="12">
								<PageTitle title={'Vaccination History'} subtitle="One Tracker" md="12" className="ml-sm-auto mr-sm-auto" />
								<ScannedHistory data={this.state.distributor_history} />
							</Col>
						</Row>
					</Col>
					<Col lg="2"/>
				</Row>
			</Container>
		)
	}

	componentWillMount() {
		DistributorStore.addProfileRequestListener(this.onDistributorFetch);
		DistributorStore.addPlaceVaccineOrderListener(this.onVaccineOrderPlaced);
		DistributorStore.addFailedVaccinationListener(this.onFailedVaccination);
		DistributorStore.addVaccinatePatientListener(this.onVaccinatePatient);
	}
	
	fetchProfile() {
		Dispatcher.dispatch({ 
			actionType: Constants.FETCH_DISTRIBUTOR_PROFILE,
			payload: {
				token: AuthStore.getToken(),
			} 
		});
	}
    
    componentDidMount() {
        this.fetchProfile()
    }
	
	componentWillUnmount() {
		DistributorStore.removeProfileRequestListener(this.onDistributorFetch);
		DistributorStore.removePlaceVaccineOrderListener(this.onVaccineOrderPlaced);
		DistributorStore.removeFailedVaccinationListener(this.onFailedVaccination);
		DistributorStore.removeVaccinatePatientListener(this.onVaccinatePatient);
	}

	onDistributorFetch() {
		const data = DistributorStore.getInformation()
        this.setState({
            name: data.name,
			inventory: data.inventory,
			order_history: data.orders,
			vaccine_manufacturer: data.manufacturers,
			distributor_history: data.distributor_history,
			selectedVaccineOrderManufacturerUUID: data.manufacturers[0]._id,
			selectedVaccineManufacturerUUIDForVaccination: data.manufacturers[0]._id
        })
	}

	onVaccineOrderPlaced() {
		this.setState({
			openRequestVaccineModal: false,
			alertType: 'success',
			alertMessage: "Vaccine Order Placed !"
		}, () => this.setState({
			visibleAlert: true
		}, () => this.fetchProfile()))
	}

	onFailedVaccination() {
		const data = DistributorStore.getInformation()
		this.setState({
			step: 0,
			openScannerModal: false,
			alertType: 'warning',
			alertMessage: data.errorMessage
		}, () => this.setState({
			visibleAlert: true
		}, () => this.fetchProfile()))
	}

	onVaccinatePatient() {
		this.setState({
			step: 0,
			openScannerModal: false,
			alertType: 'success',
			alertMessage: "Approved the vaccination !"
		}, () => this.setState({
			visibleAlert: true
		}, () => this.fetchProfile()))
	}

	dismissAlert() {
		this.setState({ visibleAlert: false });
	}

	constructor(props) {
		super(props);
		this.onVaccinatePatient = this.onVaccinatePatient.bind(this);
		this.onVaccineOrderPlaced = this.onVaccineOrderPlaced.bind(this);
		this.onDistributorFetch = this.onDistributorFetch.bind(this);
		this.onFailedVaccination = this.onFailedVaccination.bind(this);
		this.fetchProfile = this.fetchProfile.bind(this);
		this.dismissAlert = this.dismissAlert.bind(this);
		this.state = {
			step: 0,
			name: '',
			vaccineSignature: '',
			visibleAlert: false,
			alertType: 'success',
			alertMessage: '',
			openScannerModal: false,
			openRequestVaccineModal: false,
			vaccine_manufacturer: [],
			distributor_history: [],
			order_history: [],
			inventory: [],
			selectedVaccineManufacturerUUIDForVaccination: '',
			selectedVaccineOrderManufacturerUUID: '',
			selectedVaccineOrderQuantity: 0
		};
	}
}

export default DistributorView;
