import React from 'react';
import States from '../../utils/CovidData.json';
import {
	Card,
	CardHeader,
	ListGroup,
	ListGroupItem,
	Row,
	Col,
	Form,
	FormInput,
	Button,
	Container,
	Alert,
	FormSelect
} from 'shards-react';
import PageTitle from "../../components/common/PageTitle";
import { Dispatcher, Constants, AuthStore } from "../../flux";
import { Link } from 'react-router-dom';

class RegisterView extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPasswordTextboxDanger: false,
			alertShow: false,
			alertMessage: '',
			location: ''
		};
		this.confirmPasswordHandle = this.confirmPasswordHandle.bind(this);
		this.onSuccessfulRegister = this.onSuccessfulRegister.bind(this);
		this.registerRequest = this.registerRequest.bind(this);
	}

	confirmPasswordHandle(e) {
		this.setState({ confirmPasswordTextboxDanger: e.target.value !== '' && e.target.value !== this.state.password })
	}

	componentWillMount() {
		AuthStore.addRegisterListener(this.onSuccessfulRegister);
	}

	componentDidMount() {
		this.setState({ location: States[0].name })
	}
	
	componentWillUnmount() {
		AuthStore.removeRegisterListener(this.onSuccessfulRegister);
	}

	onSuccessfulRegister() {
		const role = AuthStore.getRole()
		if(role == 'distributor') this.props.history.push('/distributor')
		if(role == 'user') this.props.history.push('/patient-profile')
	}

	registerRequest(e, role) {
		e.preventDefault();
		Dispatcher.dispatch({ 
			actionType: Constants.REGISTER_ACTION,
			payload: {
				role: role,
				name: this.state.firstName + ' ' + this.state.lastName,
				email: this.state.email,
				password: this.state.password,
				state: this.state.location
			} 
		});
	}

	render() {
		return (
			<Container fluid className="p-4">
				<Row noGutters className="page-header py-4">
					<PageTitle title="One-Tracker" subtitle="Lets get started" md="6" className="ml-sm-auto mr-sm-auto" />
				</Row>
				<Row>
					<Col lg="6" className="ml-sm-auto mr-sm-auto">
						<Card small className="mb-4">
							<CardHeader className="border-bottom">
								<h6 className="m-0">{'Registration'}</h6>
							</CardHeader>
							<ListGroup flush>
								<ListGroupItem className="p-3">
								<Form>
									<Row form>
										<Col md="6" className="form-group">
											<label htmlFor="feFirstName">First Name</label>
											<FormInput
												id="feFirstName"
												placeholder="John"
												onChange={(e) => this.setState({ firstName: e.target.value })}
											/>
										</Col>
										<Col md="6" className="form-group">
											<label htmlFor="feLastName">Last Name</label>
											<FormInput
												id="feLastName"
												placeholder="Doe"
												onChange={(e) => this.setState({ lastName: e.target.value })}
											/>
										</Col>
									</Row>
										<Row form>
											<Col md="12" className="form-group">
												<label htmlFor="feEmail">Email</label>
												<FormInput
													type="email"
													id="feEmail"
													value={this.state.email}
													placeholder="admin@one-tracker.ai"
													onChange={(e) => this.setState({ email: e.target.value })}
													autoComplete="email"
												/>
											</Col>
											<Col md="12" className="form-group">
												<label htmlFor="feState">State</label>
												<FormSelect onChange={(e) => this.setState({ location: e.currentTarget.value })}>
													{States.map((state) => (
														<option id={state.name} value={state.name}>{state.name}</option>
													))}
												</FormSelect>
											</Col>
										</Row>
										<Row form>
											<Col md="6" className="form-group">
												<label htmlFor="fePassword">Password</label>
												<FormInput
													type="password"
													id="fePassword"
													placeholder="****************"
													onChange={(e) => this.setState({ password: e.target.value })}
													autoComplete="current-password"
												/>
											</Col>
											<Col md="6" className="form-group">
												<label htmlFor="fePassword">Confirm Password</label>
												<FormInput
													invalid={this.state.confirmPasswordTextboxDanger}
													type="password"
													id="feConfirmPassword"
													placeholder="****************"
													onChange={this.confirmPasswordHandle}
													autoComplete="current-password"
												/>
											</Col>
										</Row>
										<Row>
											<Col md="12">
												<Alert open={this.state.alertShow} theme="danger">{this.state.alertMessage}</Alert>
											</Col>
										</Row>
										<div style={{ display: 'flex' }}>
											<Button pill type="submit" style={{ marginRight: '10px' }} onClick={(e) => this.registerRequest(e, 'user')}>{'Register Patient'}</Button>
											<Button pill type="submit" style={{ marginRight: '10px' }} onClick={(e) => this.registerRequest(e, 'distributor')}>{'Register Healthcare Organisation'}</Button>
											<Link to="/login">
												<Button pill outline>Login</Button>
											</Link>
										</div>
									</Form>
								</ListGroupItem>
							</ListGroup>
						</Card>
					</Col>
				</Row>
			</Container>

		)
	}
}

export default RegisterView;
