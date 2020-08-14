import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import * as actions from "../../store/actions.js";
import DropMenu from "../popovers/dropMenu.jsx";
import Modal from "../popovers/modal.jsx";
import Editor from "./editor.jsx";
import Info from "./info.jsx";
import NoImage from "../../images/No-Image.jpg";
import LoadingImage from "../../images/Lazy-Load.jpg";

class Bookmark extends Component {
    state = {
        image: LoadingImage
    }

    componentDidMount() {
        const { imagePath } = this.props.bookmark;
        const lazyObserver = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    this.setState({ image: /No-Image.*\.jpg$/i.test(imagePath) ? NoImage : imagePath });
                    lazyObserver.disconnect();
                }
            });
        }, { root: document.querySelector(".bookmark-container"), rootMargin: "200px" });
        lazyObserver.observe(ReactDOM.findDOMNode(this));
    }

    openBookmark = () => {
        const { bookmark: { bookmarkId, pageUrl }, addView } = this.props;
        window.open(pageUrl);
        addView(bookmarkId);
    }

    removeBookmark = () => {
        const { bookmark, deleteBookmark } = this.props;
        deleteBookmark(bookmark);
    }

    openEditor = () => {
        const { bookmark: { bookmarkId }, openModal } = this.props;
        openModal(`${bookmarkId}-edit`);
    }

    openInfo = () => {
        const { bookmark: { bookmarkId }, openModal } = this.props;
        openModal(`${bookmarkId}-info`);
    }

	render() {
		const { bookmark, bookmark: { bookmarkId, isDisplayed, title }, isEditorOpen, isInfoOpen } = this.props;
		return (
			<figure onClick={this.openBookmark} className={`bookmark${isDisplayed ? "" : " hidden"}`}>
				<figcaption className="title">{title}</figcaption>
				<img className="image" src={this.state.image} alt="" />
				<DropMenu id={bookmarkId} isWrapped>
					<div handleClick={this.openInfo}>Info</div>
					<div handleClick={this.openEditor}>Edit</div>
					<div handleClick={this.removeBookmark}>Delete</div>
				</DropMenu>
				{isEditorOpen ? (
					<Modal id={`${bookmarkId}-edit`} classes={`pad-ctn-2${isEditorOpen ? "" : " hidden"}`} hasHeader>
                        <Editor id={bookmarkId} bookmark={bookmark} />
					</Modal>
				) : null}
                {isInfoOpen ? (
                    <Modal id={`${bookmarkId}-info`} classes={`pad-ctn-1${isInfoOpen ? "" : " hidden"}`}>
                        <Info bookmark={bookmark} />
                    </Modal>
                ) : null}
			</figure>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
    isEditorOpen: Object(state.modals.find(modal => modal.id === `${ownProps.bookmark.bookmarkId}-edit`)).isOpen ?? false,
    isInfoOpen: Object(state.modals.find(modal => modal.id === `${ownProps.bookmark.bookmarkId}-info`)).isOpen ?? false,
});

const mapDispatchToProps = dispatch => ({
    addView: bookmarkId => dispatch(actions.viewBookmark(bookmarkId)),
    deleteBookmark: bookmark => dispatch(actions.deleteBookmark(bookmark)),
    openModal: id => dispatch(actions.modalOpened(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bookmark);