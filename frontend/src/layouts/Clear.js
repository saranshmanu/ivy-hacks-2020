import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'shards-react';

import MainNavbar from '../components/layout/MainNavbar/MainNavbar';
import MainFooter from '../components/layout/MainFooter';

const ClearLayout = ({ children, noNavbar, noFooter }) => (
    <Container fluid>
        <Row>
            <Col
                className="main-content p-0"
                sm="12"
                tag="main"
            >
                {!noNavbar && <MainNavbar />}
                {children}
                {!noFooter && <MainFooter />}
            </Col>
        </Row>
    </Container>
);

ClearLayout.propTypes = {
    noNavbar: PropTypes.bool,
    noFooter: PropTypes.bool
};

ClearLayout.defaultProps = {
    noNavbar: false,
    noFooter: false
};

export default ClearLayout;
