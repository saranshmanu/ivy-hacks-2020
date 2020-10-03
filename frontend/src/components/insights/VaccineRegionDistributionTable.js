import React from 'react';
import { Card, CardBody } from 'shards-react';


class VaccineRegionDistributionTable extends React.Component {
    render() {
        return (
            <Card small className="overflow-hidden">
                <CardBody className="bg-dark p-3">
                    <table className="table table-sm table-striped table-dark mb-0">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col" className="border-0">{'Region'}</th>
                                <th scope="col" className="border-0">{'Population'}</th>
                                <th scope="col" className="border-0">{'Active Cases'}</th>
                                <th scope="col" className="border-0">{'Total Cases'}</th>
                                <th scope="col" className="border-0">{'Vaccinated People'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(this.props.data || []).map((region) => (
                                <tr>
                                    <td>{region.name}</td>
                                    <td>{region.population}</td>
                                    <td>{region['active-cases']}</td>
                                    <td>{region['total-cases']}</td>
                                    <td>{region.vaccinated}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
        )
    }
}

export default VaccineRegionDistributionTable;
