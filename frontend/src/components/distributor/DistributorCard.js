import React from 'react';
import { Card, CardHeader, Button, ListGroup, ListGroupItem } from 'shards-react';

const DistributorCard = ({name, requestVaccineModal, scannerModal}) => (
    <Card small className="pt-3">
        <CardHeader className="border-bottom text-center">
            <img width="200" src="https://qphs.fs.quoracdn.net/main-qimg-c9836d2130f15a8a9c3fa38076fbdeb2" />
            <h4 className="mb-0">{name || ''}</h4>
            <span className="text-muted d-block mb-2">{'Healthcare vaccine distributor'}</span>
        </CardHeader>
        <ListGroup flush className="text-center">
            <ListGroupItem className="p-4">
                <div className="p-1"><Button size="lg" onClick={scannerModal}>{'Vaccinate'}</Button></div>
                <div className="p-1"><Button size="lg" onClick={requestVaccineModal}>{'Request Vaccine'}</Button></div>
            </ListGroupItem>
        </ListGroup>
    </Card>
);

export default DistributorCard;
