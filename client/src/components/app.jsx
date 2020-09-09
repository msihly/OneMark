import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../store/actions.js";
import AuthRoute from "../views/authRoute.jsx";
import Home from "../views/home.jsx";
import Login from "../views/login.jsx";
import PrivacyPolicy from "../views/privacyPolicy.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/index.scss";
import PageNotFound from "../images/page-not-found.svg";

toast.configure({
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0,
    toastClassName: "Toastify__toast--dark"
});

class App extends Component {
	componentDidMount() {
		window.addEventListener("click", this.props.closeMenus);
    }

    componentWillUnmount() {
        window.removeEventListener("click", this.props.closeMenus);
    }

	render() {
		return (
            <BrowserRouter>
                <Switch>
                    <AuthRoute exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/privacy" component={PrivacyPolicy} />
                    <Route path="*" component={() =>
                        <div className="notFound">
                            <div className="heading">404</div>
                            <div className="subheading">Page Not Found</div>
                            <img src={PageNotFound} alt=""/>
                        </div>} />m
                </Switch>
            </BrowserRouter>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	closeMenus: () => dispatch(actions.externalClick()),
});

export default connect(null, mapDispatchToProps)(App);
