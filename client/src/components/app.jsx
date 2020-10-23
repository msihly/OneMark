import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import { AuthRoute, Home, Login, NotFound, PrivacyPolicy} from "./views";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/index.scss";

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
	componentDidMount() { window.addEventListener("click", this.props.closeMenus); }

    componentWillUnmount() { window.removeEventListener("click", this.props.closeMenus); }

	render() {
		return (
            <BrowserRouter>
                <Switch>
                    <AuthRoute exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/privacy" component={PrivacyPolicy} />
                    <Route path="*" component={NotFound}/>
                </Switch>
            </BrowserRouter>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	closeMenus: () => dispatch(actions.externalClick()),
});

export default connect(null, mapDispatchToProps)(App);
