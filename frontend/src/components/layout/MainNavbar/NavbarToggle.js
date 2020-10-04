import React from 'react';
import { Dispatcher, Constants } from '../../../flux';

class NavbarToggle extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        Dispatcher.dispatch({
            actionType: Constants.TOGGLE_SIDEBAR
        });
    }

    render() {
        return (
            <nav className="nav">
                <a href="#" onClick={this.handleClick} className="nav-link nav-link-icon toggle-sidebar d-sm-inline d-md-inline d-lg-none text-center">
                    <i className="material-icons">&#xE5D2;</i>
                </a>
            </nav>
        );
    }
}

export default NavbarToggle;
