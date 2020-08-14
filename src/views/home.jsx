import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions.js";
import NavBar from "../components/navbar/navBar.jsx";
import Bookmarks from "../components/bookmarks/bookmarks.jsx";
import "../css/home.css";

class Home extends Component {
    componentDidMount() {
        this.props.getAccount();
    }

    render() {
        return (
            <div className="dark">
                <NavBar />
                <Bookmarks />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    getAccount: () => dispatch(actions.getAccount()),
});

export default connect(null, mapDispatchToProps)(Home);