import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Portal from "../popovers/portal";
import Modal from "../popovers/modal";
import MultiSelectButton from "../multiSelect/button";
import Tagger from "../tags/tagger";
import EditTagsIcon from "../../images/multi-select-tags.svg";
import UnselectIcon from "../../images/multi-select-unselect.svg";

class MultiSelectBar extends Component {
    openTagEditor = () => {
        this.props.openModal("tagger");
    }

    unselectAll = () => {
        this.props.unselectAllBookmarks();
    }

    render() {
        const { selectedBookmarks, isTaggerOpen } = this.props;
        return (
            <Portal>
                { selectedBookmarks.length > 0 ? (
                    <div className="multi-select-bar">
                        <MultiSelectButton handleClick={this.openTagEditor} icon={EditTagsIcon} text="Edit Tags" />
                        { isTaggerOpen ? (
                            <Modal id="tagger" classes={`pad-ctn-1${isTaggerOpen ? "" : " hidden"}`} hasHeader>
                                <Tagger bookmarks={selectedBookmarks} />
                            </Modal>
                        ) : null}
                        <MultiSelectButton handleClick={this.unselectAll} icon={UnselectIcon} text="Unselect" />
                    </div>
                ) : null }
            </Portal>
        );
    }
}

const mapStateToProps = (state) => ({
    selectedBookmarks: state.bookmarks.filter(bookmark => bookmark.isSelected === true) || [],
	isTaggerOpen: Object(state.modals.find(modal => modal.id ==="tagger")).isOpen || false,
});

const mapDispatchToProps = dispatch => ({
    unselectAllBookmarks: () => dispatch(actions.unselectAllBookmarks()),
    openModal: id => dispatch(actions.modalOpened(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultiSelectBar);