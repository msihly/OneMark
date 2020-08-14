import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions.js";

class SortButton extends Component {
    handleClick = () => {
        const { type, direction, sortBookmarks } = this.props;
        sortBookmarks(`${type}-${direction}`);
    }

    render() {
        const { type, direction } = this.props;
        return (
            <div onClick={this.handleClick} className={`sort-menu-btn${localStorage.getItem("sort") === `${type}-${direction}` ? " active" : ""}`}>
                <span>{type}</span>
                <span>{direction === "desc" ? "\u2193" : "\u2191"}</span>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    sortBookmarks: (sortCase) => dispatch(actions.bookmarksSorted(sortCase)),
});

export default connect(null, mapDispatchToProps)(SortButton);