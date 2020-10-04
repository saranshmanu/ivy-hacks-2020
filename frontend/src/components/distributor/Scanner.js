import React from 'react';
import QrReader from 'react-qr-reader';

class ProfileCardComponent extends React.Component {
	state = { result: 'No result' };

	handleError = (err) => console.error(err);
	handleScan = (data) => {
		this.props.scan(data);
		if (data) this.setState({ result: data });
	};

	render() {
		return (
			<QrReader
				delay={3000}
				onError={this.handleError}
				onScan={this.handleScan}
				style={{ width: '100%' }}
			/>
		);
	}
}

export default ProfileCardComponent;
