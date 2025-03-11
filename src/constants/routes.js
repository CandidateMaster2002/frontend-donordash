import { DONOR_SIGNUP, USER_LOGIN } from "./apiEndpoints";

const ROUTES = {
    DONOR_HOME: '/donor-home',
    SUPERVISOR_HOME: '/supervisor-home',
    DONOR_CULTIVATOR_HOME: '/donor-cultivator-home',
    ADMIN_DASHBOARD: '/admin-dashboard',
    USER_LOGIN: '/user-login',
    DONOR_SIGNUP: '/donor-signup',
};

export const DONOR_HOME = ROUTES.DONOR_HOME;
export const SUPERVISOR_HOME = ROUTES.SUPERVISOR_HOME;
export const DONOR_CULTIVATOR_HOME = ROUTES.DONOR_CULTIVATOR_HOME;
export const ADMIN_DASHBOARD = ROUTES.ADMIN_DASHBOARD;
export const USER_LOGIN_ROUTE = ROUTES.USER_LOGIN;
export const DONOR_SIGNUP_ROUTE = ROUTES.DONOR_SIGNUP;


export default ROUTES;