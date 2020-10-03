import React from 'react';
import { Container, Row, Col } from 'shards-react';
import PageTitle from '../../components/common/PageTitle';
import NotificationCenter from '../../components/NotificationCenter';
import VaccinationHistory from '../../components/VaccinationHistory';
import ProfileCard from '../../components/ProfileCard';
import { Dispatcher, Constants, AuthStore, PatientStore } from "../../flux";

class DashboardView extends React.Component {

	render() {
        const getHeading = (heading) => {
            return (
                <div noGutters className="page-header py-4">
                    <PageTitle title={heading} subtitle="One Tracker" md="12" className="ml-sm-auto mr-sm-auto" />
                </div>
            )
        }
		return (
			<Container fluid className="main-content-container pb-4">
				<Row>
                    <Col lg="2"></Col>
					<Col lg="4">
                        {getHeading('Patient')}
                        <ProfileCard name={this.state.name} vaccinated={this.state.vaccinated} signature={this.state.signature} />
                    </Col>
                    <Col lg="4">
                        <Row>
                            <Col lg="12">
                                {getHeading('Notification Center')}
                                <NotificationCenter data={this.state.notifications} />
                            </Col>
                            <Col lg="12">
                                {getHeading('Vaccination History')}
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
