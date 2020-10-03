import React from 'react';
import { Card, CardHeader, Button, ListGroup, ListGroupItem } from 'shards-react';
var QRCode = require('qrcode.react');
var Barcode = require('react-barcode');

const verification = (status) => (
	<Button pill theme={status ? 'success' : 'danger'} size="sm">
		<i className="material-icons mr-1">{status ? 'check' : 'block'}</i> {status ? 'Vaccinated' : 'Not Vaccinated'}
	</Button>
);

const ProfileCardComponent = ({name, vaccinated, signature}) => (
	<Card small className="mb-4 pt-3">
		<CardHeader className="border-bottom text-center">
			<img width="100" src="https://www.med9healthcare.com/assets/images/doctor.jpg" />
			<h4 className="mb-0 mt-2">{name || ''}</h4>
			<span className="text-muted d-block mb-2">{'Patient'}</span>
			{verification(vaccinated || false)}
		</CardHeader>
		<ListGroup flush>
			<ListGroupItem className="p-4">
				<h6 className="text-muted d-block mb-2 text-center">{'User Signature'}</h6>
				<p className="text-center"><i>{'Use the profile signature generated for verification'}</i></p>
				<div style={{ textAlign: 'center' }}>
					<QRCode level="H" value={signature || ''} /><br />
                    {'or'}<br />
                    <Barcode value={signature || ''} width="1" height="40" /><br />
                    <Button className="text-muted" theme="light" size="sm" href={"mailto:?body=" + signature}><i>{'Share or Export my Signature'}</i></Button>
				</div>
			</ListGroupItem>
		</ListGroup>
	</Card>
);

export default ProfileCardComponent;
