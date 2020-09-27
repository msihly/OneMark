import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Bookmark from "./bookmark";

class Bookmarks extends Component {
    componentDidMount() {
        this.props.getBookmarks();
    }

	render() {
        const { bookmarks } = this.props;
        return (
            <div className="bookmark-container">
                {bookmarks.length > 0 && bookmarks.map(b => <Bookmark key={b.bookmarkId} bookmark={b} />)}
            </div>
        );
	}
}

const mapStateToProps = state => ({
	bookmarks: state.bookmarks,
});

const mapDispatchToProps = dispatch => ({
    getBookmarks: () => dispatch(actions.getBookmarks()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bookmarks);