import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";
import { DropMenu, Modal } from "../popovers";
import { Editor, Info } from ".";
import { Checkbox } from "../form";
import * as Media from "../../media";

const Bookmark = ({ bookmark, bookmark: { bookmarkId, isDisplayed, imagePath, pageUrl, title } }) => {
    const dispatch = useDispatch();

    const isEditorOpen = useSelector(state => state.modals.find(modal => modal.id === `${bookmarkId}-edit`)?.isOpen ?? false);
    const isInfoOpen = useSelector(state => state.modals.find(modal => modal.id === `${bookmarkId}-info`)?.isOpen ?? false);

    const [isLazy, setIsLazy] = useState(true);

    const bookmarkRef = useRef(null);

    const openBookmark = () => {
        window.open(pageUrl);
        dispatch(actions.bookmarkViewed(bookmarkId));
    };

    useEffect(() => {
        const lazyObserver = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    setIsLazy(false);
                    lazyObserver.disconnect();
                }
            });
        }, { root: document.querySelector(".bookmark-container"), rootMargin: "200px" });

        lazyObserver.observe(bookmarkRef.current);
    }, [bookmarkRef]);

    return (
        <figure ref={bookmarkRef} className={`bookmark${isDisplayed ? "" : " hidden"}`} onClick={openBookmark}
            onMouseDown={event => event.button === 1 && openBookmark()}>
            <figcaption className="title">{title}</figcaption>
            <img className="image" src={isLazy ? Media.Loading : imagePath} alt="" />
            <Checkbox id={`${bookmarkId}-multi-select`} classes="multi-select-checkbox"
                handleClick={() => dispatch(actions.bookmarkSelected(bookmarkId))} />
            <DropMenu id={bookmarkId} isWrapped>
                <div onClick={() => dispatch(actions.modalOpened(`${bookmarkId}-info`))}>Info</div>
                <div onClick={() => dispatch(actions.modalOpened(`${bookmarkId}-edit`))}>Edit</div>
                <div onClick={() => dispatch(actions.deleteBookmark(bookmark))}>Delete</div>
            </DropMenu>
            {isEditorOpen && (
                <Modal id={`${bookmarkId}-edit`} classes={`pad-ctn-2${isEditorOpen ? "" : " hidden"}`} hasHeader hasBackdrop>
                    <Editor id={bookmarkId} bookmark={bookmark} />
                </Modal>
            )}
            {isInfoOpen && (
                <Modal id={`${bookmarkId}-info`} classes={`pad-ctn-1${isInfoOpen ? "" : " hidden"}`} hasBackdrop>
                    <Info bookmark={bookmark} />
                </Modal>
            )}
        </figure>
    );
};

export default Bookmark;