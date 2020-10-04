import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Col } from 'shards-react';

const PageTitle = ({ title, subtitle, className, ...attrs }) => {
    const classes = classNames(className, 'text-center', 'text-md-left', 'mb-sm-0');

    return (
        <Col xs="12" sm="12" lg="12" className={classes} {...attrs}>
            <div noGutters className="page-header py-4">
                <span className="text-uppercase page-subtitle">{subtitle}</span>
                <h3 className="page-title">{title}</h3>
            </div>
        </Col>
    );
};

PageTitle.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string
};

export default PageTitle;
