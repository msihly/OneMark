import React, { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { SortContext } from "components/views";
import { Bookmark } from "./";
import { sortArray } from "utils";

const NUMERICAL_ATTRIBUTES = ["imageSize", "views"];

const Bookmarks = () => {
    const { sortKey, sortDir } = useContext(SortContext);

    const bookmarks = useSelector(state => state.bookmarks);

    const sorted = useMemo(() =>
        sortArray(bookmarks, sortKey, sortDir === "desc", NUMERICAL_ATTRIBUTES.includes(sortKey))
    , [bookmarks, sortKey, sortDir]);

    return (
        <main className={`bookmark-container${sorted.filter(b => b.isDisplayed).length === 0 ? " empty" : ""}`}>
            {sorted?.map(({ bookmarkId }) => <Bookmark {...{ key: `bk-${bookmarkId}`, bookmarkId }} />)}
        </main>
    );
};

export default Bookmarks;