import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import routes from './routes';
import withTracker from './withTracker';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/shards-dashboards.1.1.0.min.css';

export default () => (
	<Router basename={''}>
		<Switch>
			{routes.map((route, index) => {
				return (
					<Route
						key={index}
						path={route.path}
						exact={route.exact}
						component={withTracker((props) => {
							return (
								<route.layout {...props}>
									<route.component {...props} />
								</route.layout>
							);
						})}
					/>
				);
			})}
		</Switch>
	</Router>
);
