import React from 'react';
import { Card, CardBody, ListGroup, ListGroupItem, Button } from 'shards-react';

const OrderHistory = ({ data }) => (
	<Card small>
		<CardBody className="p-3" style={{height: '480px', overflow: 'scroll'}}>
			<ListGroup small flush className="list-group-small">
				{(data || []).map((item, idx) => (
                    <div>
                        <ListGroupItem style={{border: '0px'}} key={idx} className="d-flex pb-0 pt-1">
                            <span className="text-semibold text-fiord-blue">{item.name}</span>
                            <span className="ml-auto text-right text-semibold text-reagent-gray">{item.date.toDateString()}</span>
                        </ListGroupItem>
                        <ListGroupItem style={{border: '0px'}} key={idx} className="d-flex pt-0 pb-1">
                            <span className="text-semibold text-fiord-blue">
                                <i><small>{'(Quantity - ' + item.quantity + ')'}</small></i>
                            </span>
                            <span className="ml-auto text-right text-semibold" style={{color: 'green'}}>
                                <i><small>{item.delivered? 'Delivered': item.approved ? 'Approved': ''}</small></i>
                            </span>
                        </ListGroupItem>
                    </div>
				))}
			</ListGroup>
		</CardBody>
	</Card>
);

export default OrderHistory;
