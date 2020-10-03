import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardBody } from 'shards-react';

class VaccinationTimeline extends React.Component {
    getDateLegend = () => {
        var days = []
        const today = new Date()
        for(let i=(this.props.days || 0); i >= 0; i--) {
            var date = new Date(new Date().setDate(today.getDate() - i))
            days.push(date.toLocaleDateString())
        }
        return days
    }
    getChartData = () => {
        return {
            labels: this.getDateLegend(),
            datasets: [
                {
                    label: 'Total people vaccinated',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.props.data
                }
            ]
        }
    }
    
	render() {
		return (
			<Card small className="pt-3">
                <CardBody className="border-bottom text-center">
                    {'The measure tracks total people who were vaccinated'}
                    <Line data={this.getChartData()} />
		        </CardBody>
			</Card>
		);
    }
}

export default VaccinationTimeline;

