import React from "react";
import { Redirect } from "react-router-dom";

import { DefaultLayout, ClearLayout, AuthLayout } from "./layouts";
import Errors from "./views/Errors";
import DashboardView from "./views/stakeholders/DashboardView";
import ProfileView from "./views/stakeholders/ProfileView";
import DistributorView from "./views/stakeholders/DistributorView";
import LoginView from "./views/authentication/LoginView";
import RegisterView from "./views/authentication/RegisterView";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/login" />
  },
  {
    path: "/login",
    layout: AuthLayout,
    component: LoginView
  },
  {
    path: "/register",
    layout: AuthLayout,
    component: RegisterView
  },
  {
    path: "/dashboard",
    layout: ClearLayout,
    component: DashboardView
  },
  {
    path: "/patient-profile",
    layout: ClearLayout,
    component: ProfileView
  },
  {
    path: "/distributor",
    layout: ClearLayout,
    component: DistributorView
  },
  {
    path: "*",
    layout: AuthLayout,
    component: Errors
  }
];
