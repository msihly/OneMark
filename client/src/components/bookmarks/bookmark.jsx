import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions";
import { Modal } from "components/popovers";
import { DropMenu, DropButton } from "components/dropdowns";
import { Checkbox } from "components/form";
import { Editor, Info } from "./";
import * as Media from "media";

const Bookmark = ({ bookmarkId }) => {
    const history = useHistory();

    const bookmarkRef = useRef(null);

    const dispatch = useDispatch();

    const { isDisplayed, imageUrl, pageUrl, title } = useSelector(state => state.bookmarks.find(b => b.bookmarkId === bookmarkId)) ?? { };

    const modals = useSelector(state => state.modals);
    const [isEditorOpen, isInfoOpen] = [`${bookmarkId}-edit`, `${bookmarkId}-info`].map(id => modals.find(m => m.id === id)?.isOpen ?? false);

    const [isLazy, setIsLazy] = useState(true);

    const deleteBookmark = () => {
        const formData = new FormData();
        formData.append("bookmarkIds", JSON.stringify([bookmarkId]));
        dispatch(actions.deleteBookmarks(formData, history));
    };

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
        }, { root: document.querySelector(".bookmark-container"), rootMargin: "300px" });

        lazyObserver.observe(bookmarkRef.current);
    }, [bookmarkRef]);

    return (
        <figure ref={bookmarkRef} className={`bookmark${isDisplayed ? "" : " hidden"}`} onClick={openBookmark}
            onMouseDown={event => event.button === 1 && openBookmark()}>
            <figcaption className="title">{title}</figcaption>

            <img src={isLazy ? Media.ImageLoading : (imageUrl ?? Media.NoImage)}
                className={`image${(!isLazy && !imageUrl) ? " no-image" : ""}`} alt="" />

            <Checkbox id={`${bookmarkId}-multi-select`} classes="multi-select-checkbox"
                handleClick={() => dispatch(actions.bookmarkSelected(bookmarkId))} />

            <DropMenu id={`bk-menu-${bookmarkId}`} isWrapped>
                <DropButton label="Info" icon={<Media.InfoSVG />} onClick={() => dispatch(actions.modalOpened(`${bookmarkId}-info`))} />
                <DropButton label="Edit" icon={<Media.PencilSVG />} onClick={() => dispatch(actions.modalOpened(`${bookmarkId}-edit`))} />
                <DropButton label="Delete" icon={<Media.TrashcanSVG />} onClick={deleteBookmark} />
            </DropMenu>

            {isEditorOpen && (
                <Modal id={`${bookmarkId}-edit`} classes="pad-ctn-2" hasHeader hasBackdrop>
                    <Editor {...{ bookmarkId }} />
                </Modal>
            )}

            {isInfoOpen && (
                <Modal id={`${bookmarkId}-info`} classes="pad-ctn-1" hasBackdrop>
                    <Info {...{ bookmarkId }} />
                </Modal>
            )}
        </figure>
    );
};

export default Bookmark;