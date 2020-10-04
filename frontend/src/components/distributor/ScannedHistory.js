import React from 'react';

const ScannedHistory = ({ data }) => (
	<div style={{height: '480px', overflow: 'scroll'}}>
		{data.map((record) => (
			<div style={{ backgroundColor: 'white', padding: '20px 30px 20px 30px', marginBottom: 10, borderRadius: 10 }}>
				<div className="mt-2">
					<span className="text-semibold text-fiord-blue">{record.name}</span><br />
					<i>{record.vaccine}</i>
					<p className="m-0 text-muted">Last vaccinated on {record.date.toDateString()}</p>
				</div>
			</div>
		))}
	</div>
);

export default ScannedHistory;
