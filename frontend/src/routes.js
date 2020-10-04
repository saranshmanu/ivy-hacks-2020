import React from 'react';
import { Redirect } from 'react-router-dom';
import { DefaultLayout, ClearLayout, AuthLayout } from './layouts';
import { Errors, DashboardView, ProfileView, DistributorView, LoginView, RegisterView } from './views';

export default [
	{
		path: '/',
		exact: true,
		layout: DefaultLayout,
		component: () => <Redirect to="/login" />
	},
	{
		path: '/login',
		layout: AuthLayout,
		component: LoginView
	},
	{
		path: '/register',
		layout: AuthLayout,
		component: RegisterView
	},
	{
		path: '/dashboard',
		layout: ClearLayout,
		component: DashboardView
	},
	{
		path: '/patient-profile',
		layout: ClearLayout,
		component: ProfileView
	},
	{
		path: '/distributor',
		layout: ClearLayout,
		component: DistributorView
	},
	{
		path: '*',
		layout: AuthLayout,
		component: Errors
	}
];
