import * as types from "../actions/types";
import { uniqueArrayMerge } from "../../utils";

const bookmark = (state = [], action) => {
    switch (action.type) {
        case types.BOOKMARK_CREATED: {
            const { bookmark } = action.payload;
            return [...state, { ...bookmark, isDisplayed: true, isSelected: false }];
        } case types.BOOKMARK_DELETED: {
            const { bookmarkId } = action.payload.bookmark;
            return state.filter(bookmark => bookmark.bookmarkId !== bookmarkId);
        } case types.BOOKMARKS_DELETED: {
            const { bookmarkIds } = action.payload;
            return state.filter(bookmark => !bookmarkIds.includes(bookmark.bookmarkId));
        } case types.BOOKMARK_EDITED: {
            const { bookmarkId, dateModified, imagePath, imageSize, pageUrl, tags, title } = action.payload.bookmark;
            return state.map(bookmark => bookmark.bookmarkId === bookmarkId ? { ...bookmark, dateModified, imagePath, imageSize, pageUrl, tags, title } : bookmark);
        } case types.BOOKMARKS_FILTERED: {
            const { bookmarks } = action.payload;
            return state.map(bookmark => ({ ...bookmark, isDisplayed: bookmarks === null ? true : bookmarks.some(filtered => filtered.bookmarkId === bookmark.bookmarkId) }));
        } case types.BOOKMARKS_RETRIEVED: {
            const { bookmarks } = action.payload;
            return bookmarks.length > 0 ? state.concat(bookmarks) : state;
        } case types.BOOKMARK_SELECTED: {
            const { bookmarkId } = action.payload;
            return state.map(bookmark => bookmark.bookmarkId === bookmarkId ? { ...bookmark, isSelected: !bookmark.isSelected } : bookmark);
        } case types.BOOKMARKS_UNSELECTED: {
            return state.map(bookmark => ({ ...bookmark, isSelected: false }));
        } case types.BOOKMARKS_SORTED: {
            let sorted = [...state];
            switch (action.payload.sortCase) {
                case "Date Modified-desc": return sorted.sort((a, b) => b.dateModified.localeCompare(a.dateModified));
                case "Date Modified-asc": return sorted.sort((a, b) => a.dateModified.localeCompare(b.dateModified));
                case "Date Created-desc": return sorted.sort((a, b) => b.dateCreated.localeCompare(a.dateCreated));
                case "Date Created-asc": return sorted.sort((a, b) => a.dateCreated.localeCompare(b.dateCreated));
                case "Title-desc": return sorted.sort((a, b) => b.title.localeCompare(a.title));
                case "Title-asc": return sorted.sort((a, b) => a.title.localeCompare(b.title));
                case "Views-desc": return sorted.sort((a, b) => b.views - a.views);
                case "Views-asc": return sorted.sort((a, b) => a.views - b.views);
                case "Image Size-desc": return sorted.sort((a, b) => b.imageSize - a.imageSize);
                case "Image Size-asc": return sorted.sort((a, b) => a.imageSize - b.imageSize);
                default: return state;
            }
        } case types.TAGS_UPDATED: {
            const { bookmarkIds, addedTags, removedTags, dateModified } = action.payload;
            return state.map(bookmark => bookmarkIds.includes(bookmark.bookmarkId) ? {
                    ...bookmark,
                    tags: uniqueArrayMerge(bookmark.tags, addedTags).filter(tag => !removedTags.includes(tag)),
                    dateModified
                } : bookmark);
        } case types.BOOKMARK_VIEWED: {
            const { bookmarkId } = action.payload;
            return state.map(bookmark => bookmark.bookmarkId === bookmarkId ? { ...bookmark, views: +bookmark.views + 1 } : bookmark);
        } default: {
            return state;
        }
    }
}

export default bookmark;