import React from 'react';
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem, CardFooter, Row, Col } from 'shards-react';

const VaccinationHistory = ({ data }) => (
    <Card small>
        <CardHeader className="border-bottom">
            <h6 className="m-0">{'Track Record'}</h6>
            <div className="block-handle" />
        </CardHeader>
        <CardBody className="p-0">
            <ListGroup small flush className="list-group-small">
                {data.map((item, idx) => (
                    <ListGroupItem key={idx} className="d-flex px-3">
                        <span className="text-semibold text-fiord-blue"><i>{item.title}</i></span>
                        <span className="ml-auto text-right text-semibold text-reagent-gray">{item.date}</span>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </CardBody>
        <CardFooter className="border-top">
            <Row>
                <Col className="text-right view-report">
                    <a href="#">Full report &rarr;</a>
                </Col>
            </Row>
        </CardFooter>
    </Card>
);

export default VaccinationHistory;
