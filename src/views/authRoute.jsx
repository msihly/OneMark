import React from "react";
import { Route, Redirect } from "react-router-dom";
import Auth from "../utils/auth.js";

const AuthRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props => {
            return Auth.getStatus() ? <Component {...props} /> : <Redirect from={props.location} to="/login" />;
        }} />
    );
}

export default AuthRoute;