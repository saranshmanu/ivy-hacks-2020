import React from 'react';
import { Card, CardHeader, ListGroup, ListGroupItem, Row, Col, Form, FormInput, Button, Container, Alert } from 'shards-react';
import { Dispatcher, Constants, AuthStore } from "../../flux";
import { Link } from 'react-router-dom';
import Typist from 'react-typist';

class LoginView extends React.Component {

	onSuccessfulLogin() {
		const role = AuthStore.getRole()
		if(role == 'distributor') this.props.history.push('/distributor')
		if(role == 'user') this.props.history.push('/patient-profile')
	}

	loginRequest(e) {
		e.preventDefault();
		Dispatcher.dispatch({ 
			actionType: Constants.LOGIN_ACTION,
			payload: {
				email: this.state.email,
				password: this.state.password
			} 
		});
	}

	render() {
		return (
			<Container fluid className="p-4">
				<Row>
					<Col lg="6" className="ml-sm-auto mr-sm-auto my-3">
						<h1>
							<Typist>{'One-Tracker 2020'}</Typist>
						</h1>
						<span className="text-muted">
							Researchers worldwide are working around the clock to find a vaccine against SARS-CoV-2, the virus causing the
							COVID-19 pandemic. Experts estimate that a fast-tracked vaccine development process could speed a successful
							candidate to market in approximately 12-18 months – if the process goes smoothly from conception to market
							availability. Once the process of vaccine development is completed. The major challenge would be to develop an
							efficient way to track and distribute the vaccine so that people around the world could finally be able to get
							back to their everyday life. Developing countries and underdeveloped regions doesn't have an
							efficient healthcare infrastructure to support the process. One-Tracker aims to develop the most
							affordable way for the healthcare organisations like ICMR to support the process.
						</span>
					</Col>
				</Row>
				<Row>
					<Col lg="6" className="ml-sm-auto mr-sm-auto">
						<Card small className="mb-4">
							<CardHeader className="border-bottom">
								<h6 className="m-0">{'Authentication'}</h6>
							</CardHeader>
							<ListGroup flush>
								<ListGroupItem className="p-3">
									<Form>
										<Row form>
											<Col md="12" className="form-group">
												<label htmlFor="feEmail">Email</label>
												<FormInput type="email" id="feEmail" placeholder="admin@one-tracker.ai"
													onChange={(e) => this.setState({ email: e.target.value })}
													autoComplete="email"
												/>
											</Col>
											<Col md="12" className="form-group">
												<label htmlFor="fePassword">Password</label>
												<FormInput type="password" id="feConfirmPassword" placeholder="****************"
													onChange={(e) => this.setState({ password: e.target.value })}
													autoComplete="current-password"
												/>
											</Col>
										</Row>
										<Row>
											<Col md="12">
												<Alert open={this.state.alertShow} theme={this.state.alertType}>
													{this.state.alertMessage}
												</Alert>
											</Col>
										</Row>
										<div style={{ display: 'flex' }}>
											<Button pill md="12" type="submit" style={{ marginRight: '10px' }} onClick={this.loginRequest}>
												{'Login to the Dashboard'}
											</Button>
											<Link to="/register">
												<Button outline pill>{'Register'}</Button>
											</Link>
										</div>
									</Form>
								</ListGroupItem>
							</ListGroup>
						</Card>
					</Col>
				</Row>
			</Container>
		);
	}

	componentWillMount() {
		AuthStore.addLoginListener(this.onSuccessfulLogin);
	}
	
	componentWillUnmount() {
		AuthStore.removeLoginListener(this.onSuccessfulLogin);
	}

	constructor(props) {
		super(props);
		this.state = {
			email: null,
			password: null,
			redirect: false,
			alertShow: false,
			alertType: null,
			alertMessage: ''
		};
		this.loginRequest = this.loginRequest.bind(this);
		this.onSuccessfulLogin = this.onSuccessfulLogin.bind(this);
	}
}

export default LoginView;
