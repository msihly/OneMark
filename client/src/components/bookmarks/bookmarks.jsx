import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";
import { Bookmark } from "./";

const Bookmarks = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.getBookmarks())
    }, [dispatch]);

    const bookmarks = useSelector(state => state.bookmarks);

    return (
        <div className={`bookmark-container${bookmarks.filter(b => b.isDisplayed).length === 0 ? " empty" : ""}`}>
            {bookmarks.length > 0 && bookmarks.map(b => <Bookmark key={b.bookmarkId} bookmark={b} />)}
        </div>
    );
};

export default Bookmarks;