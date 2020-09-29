import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Portal from "../popovers/portal";
import Modal from "../popovers/modal";
import Alert, { Button } from "../popovers/alert";
import MultiSelectButton from "../multiSelect/button";
import Tagger from "../tags/tagger";
import DeleteIcon from "../../images/multi-delete.svg";
import EditTagsIcon from "../../images/multi-tags.svg";
import UnselectIcon from "../../images/multi-unselect.svg";

class MultiSelectBar extends Component {
    deleteBookmarks = () => {
        const { bookmarks, deleteBookmarks } = this.props;
        const formData = new FormData();
        formData.append("bookmarkIds", JSON.stringify(bookmarks.map(b => b.bookmarkId)));
        deleteBookmarks(formData);
    }

    openDeleteAlert = () => this.props.openModal("confirm-delete");

    openTagEditor = () => this.props.openModal("tagger");

    unselectAll = () => this.props.unselectAllBookmarks();

    render() {
        const { bookmarks, isConfirmationOpen, isTaggerOpen } = this.props;
        return (
            <Portal>
                { bookmarks.length > 0 ? (
                    <div className="multi-select-bar">
                        <MultiSelectButton handleClick={this.openTagEditor} icon={EditTagsIcon} text="Edit Tags" />
                        { isTaggerOpen ? (
                            <Modal id="tagger" classes={`pad-ctn-1${isTaggerOpen ? "" : " hidden"}`} hasHeader>
                                <Tagger bookmarks={bookmarks} />
                            </Modal>
                        ) : null}
                        <MultiSelectButton handleClick={this.openDeleteAlert} icon={DeleteIcon} text="Delete" />
                        <MultiSelectButton handleClick={this.unselectAll} icon={UnselectIcon} text="Unselect" />
                        { isConfirmationOpen ? (
                            <Alert id="confirm-delete" modalClasses="pad-ctn-2 border-red" iconClasses="red-1-svg" icon={DeleteIcon}
                                heading={["Delete ", <span className="red-2">{bookmarks.length}</span>, ` bookmark${bookmarks.length > 1 ? "s" : ""}`]}
                                subheading="This process cannot be undone.">
                                <Button text="Delete" classes="red" handleClick={this.deleteBookmarks} />
                            </Alert>
                        ) : null}
                    </div>
                ) : null }
            </Portal>
        );
    }
}

const mapStateToProps = (state) => ({
    isConfirmationOpen: Object(state.modals.find(modal => modal.id ==="confirm-delete")).isOpen || false,
	isTaggerOpen: Object(state.modals.find(modal => modal.id ==="tagger")).isOpen || false,
    bookmarks: state.bookmarks.filter(bookmark => bookmark.isSelected === true) || [],
});

const mapDispatchToProps = dispatch => ({
    deleteBookmarks: bookmarkIds => dispatch(actions.deleteBookmarks(bookmarkIds)),
    openModal: id => dispatch(actions.modalOpened(id)),
    unselectAllBookmarks: () => dispatch(actions.unselectAllBookmarks()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultiSelectBar);