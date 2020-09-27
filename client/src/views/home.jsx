import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import NavBar from "../components/navbar/navBar";
import Bookmarks from "../components/bookmarks/bookmarks";
import MultiSelectBar from "../components/multiSelect/actionBar";

class Home extends Component {
    componentDidMount() {
        document.title = "Home - OneMark";
        this.props.getAccount();
    }

    render() {
        return (
            <div className="common home dark">
                <NavBar />
                <Bookmarks />
                <MultiSelectBar />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    getAccount: () => dispatch(actions.getAccount()),
});

export default connect(null, mapDispatchToProps)(Home);