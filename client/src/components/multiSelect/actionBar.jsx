import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";
import { Alert, AlertButton, Modal, Portal } from "../popovers";
import { MultiSelectButton } from "../multiSelect";
import { Tagger } from "../tags";
import * as Media from "../../media";

const MultiSelectBar = () => {
    const dispatch = useDispatch();

    const bookmarks = useSelector(state => state.bookmarks.filter(bookmark => bookmark.isSelected === true) || []);
    const isConfirmationOpen = useSelector(state => state.modals.find(modal => modal.id === "confirm-delete")?.isOpen || false);
    const isTaggerOpen = useSelector(state => state.modals.find(modal => modal.id === "tagger")?.isOpen || false);

    const deleteBookmarks = () => {
        const formData = new FormData();
        formData.append("bookmarkIds", JSON.stringify(bookmarks.map(b => b.bookmarkId)));
        dispatch(actions.bookmarksDeleted(formData));
    };

    return (
        <Portal>
            {bookmarks.length > 0 && (
                <div className="multi-select-bar">
                    <MultiSelectButton text="Edit Tags" icon={Media.MultiTags} onClick={() => dispatch(actions.modalOpened("tagger"))} />
                    {isTaggerOpen && (
                        <Modal id="tagger" classes={`pad-ctn-1${isTaggerOpen ? "" : " hidden"}`} hasHeader hasBackdrop>
                            <Tagger bookmarks={bookmarks} />
                        </Modal>
                    )}
                    <MultiSelectButton text="Delete" icon={Media.MultiDelete} onClick={() => dispatch(actions.modalOpened("confirm-delete"))} />
                    <MultiSelectButton text="Unselect" icon={Media.MultiUnselect} onClick={() => dispatch(actions.unselectAllBookmarks())} />
                    {isConfirmationOpen && (
                        <Alert id="confirm-delete" modalClasses="pad-ctn-2 border-red" iconClasses="red-1-svg" icon={Media.MultiDelete}
                            heading={["Delete ", <span className="red-2">{bookmarks.length}</span>, ` bookmark${bookmarks.length > 1 ? "s" : ""}`]}
                            subheading="This process cannot be undone.">
                            <AlertButton text="Delete" classes="red" onClick={deleteBookmarks} />
                        </Alert>
                    )}
                </div>
            )}
        </Portal>
    );
}

export default MultiSelectBar;