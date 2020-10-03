import React from 'react';
import { Container, Row, Col } from 'shards-react';

const signupBoxStyle = {
	height: '100vh',
	alignItems: 'center'
};

const Auth = ({ children }) => (
	<Container fluid>
		<Row style={signupBoxStyle}>
			<Col className="main-content p-0 center-block">{children}</Col>
		</Row>
	</Container>
);

export default Auth;
