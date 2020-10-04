import React from 'react';
import { Row, Col } from 'shards-react';
import SmallStats from '../../components/insights/SmallStats';

class DailyInsights extends React.Component {
	constructor() {
		super()
	}

	getSmallStats = () => {
		return [
			{
				label: 'Active Cases',
				value: '6339996',
				percentage: '27929',
				increase: true,
				chartLabels: [ null ],
				attrs: { md: '6', sm: '6' },
				datasets: [
					{
						label: 'Today',
						fill: 'start',
						borderWidth: 1.5,
						backgroundColor: 'rgba(0, 184, 216, 0.1)',
						borderColor: 'rgb(0, 184, 216)',
						data: [ 0 ]
					}
				]
			},
			{
				label: 'People Recovered',
				value: '5289425',
				percentage: '22246',
				increase: true,
				chartLabels: [ null ],
				attrs: { md: '6', sm: '6' },
				datasets: [
					{
						label: 'Today',
						fill: 'start',
						borderWidth: 1.5,
						backgroundColor: 'rgba(0, 184, 216, 0.1)',
						borderColor: 'rgb(0, 184, 216)',
						data: [ 0 ]
					}
				]
			},
			{
				label: 'People Vaccinated',
				value: this.props.vaccinatedTotal,
				percentage: this.props.vaccinatedToday,
				increase: true,
				chartLabels: [ null ],
				attrs: { md: '6', sm: '6' },
				datasets: [
					{
						label: 'Today',
						fill: 'start',
						borderWidth: 1.5,
						backgroundColor: 'rgba(0, 184, 216, 0.1)',
						borderColor: 'rgb(0, 184, 216)',
						data: [ 0 ]
					}
				]
			}
		]
	}

	render() {
		return (
			<Row>
				{this.getSmallStats().map((stats, idx) => (
					<Col className="col-lg" key={idx} {...stats.attrs}>
						<SmallStats
							id={`small-stats-${idx}`}
							variation="1"
							chartData={stats.datasets}
							chartLabels={stats.chartLabels}
							label={stats.label}
							value={stats.value}
							percentage={stats.percentage}
							increase={stats.increase}
							decrease={stats.decrease}
						/>
					</Col>
				))}
			</Row>
		)
	}
}

export default DailyInsights;
