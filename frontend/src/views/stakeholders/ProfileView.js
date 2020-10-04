import React from 'react';
import { Container, Row, Col } from 'shards-react';
import { PageTitle, NotificationCenter, VaccinationHistory, ProfileCard } from '../../components';
import { Dispatcher, Constants, AuthStore, PatientStore } from "../../flux";

class DashboardView extends React.Component {

	render() {
		return (
			<Container fluid className="main-content-container pb-4">
				<Row>
                    <Col lg="2"></Col>
					<Col lg="4">
                        <PageTitle title={'Patient'} subtitle="One Tracker" md="12" className="ml-sm-auto mr-sm-auto" />
                        <ProfileCard name={this.state.name} vaccinated={this.state.vaccinated} signature={this.state.signature} />
                    </Col>
                    <Col lg="4">
                        <Row>
                            <Col lg="12">
                                <PageTitle title={'Notification Center'} subtitle="One Tracker" md="12" className="ml-sm-auto mr-sm-auto" />
                                <NotificationCenter data={this.state.notifications} />
                            </Col>
                            <Col lg="12">
                                <PageTitle title={'Vaccination History'} subtitle="One Tracker" md="12" className="ml-sm-auto mr-sm-auto" />
                                <VaccinationHistory data={this.state.history} />
                            </Col>
                        </Row>
					</Col>
                    <Col lg="2"></Col>
				</Row>
			</Container>
		);
    }

    componentWillMount() {
		PatientStore.addPatientListener(this.onPatientFetch);
    }
    
    componentDidMount() {
        Dispatcher.dispatch({ 
			actionType: Constants.FETCH_PATIENT_PROFILE,
			payload: {
				token: AuthStore.getToken(),
			} 
		});
    }
	
	componentWillUnmount() {
		PatientStore.removePatientListener(this.onPatientFetch);
	}

	onPatientFetch() {
        const data = PatientStore.getInformation()
        this.setState({
            name: data.name,
            signature: data.signature,
            history: data.vaccination_history,
            vaccinated: data.vaccinated,
            notifications: data.notifications
        })
	}
    
    constructor(props) {
        super(props);
        this.onPatientFetch = this.onPatientFetch.bind(this);
		this.state = {
            name: '',
            vaccinated: false,
            signature: '',
            history: [],
            notifications: []
        };
	}
}

export default DashboardView;
