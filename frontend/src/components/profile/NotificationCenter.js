import React from 'react';
import { Card, CardBody, ListGroup, ListGroupItem } from 'shards-react';

const NotificationCenter = ({ data }) => (
    <Card small style={{height: '200px', overflow: 'scroll'}}>
        <CardBody className="p-3">
            <ListGroup small flush className="list-group-small">
                {data.map((item, idx) => (
                    <ListGroupItem key={idx} className="d-flex px-3">
                        <span className="text-semibold text-fiord-blue"><i>{item.message}</i></span>
                        <span className="ml-auto text-right text-semibold text-reagent-gray">{item.date}</span>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </CardBody>
    </Card>
);

export default NotificationCenter;
