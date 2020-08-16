import * as types from "../actionTypes.js";

const initState = [];

const bookmark = (state = initState, action) => {
    switch (action.type) {
        case types.BOOKMARK_CREATED: {
            return [...state, { ...action.payload.bookmark, isDisplayed: true }];
        } case types.BOOKMARK_EDITED: {
            const { bookmarkId, dateModified, imagePath, imageSize, pageUrl, tags, title } = action.payload.bookmark;
            return state.map(bookmark => {
                return bookmark.bookmarkId === bookmarkId ? { ...bookmark, dateModified, imagePath, imageSize, pageUrl, tags, title } : bookmark;
            });
        } case types.BOOKMARK_VIEWED: {
            return state.map(bookmark => {
                return bookmark.bookmarkId === action.payload.bookmarkId ? { ...bookmark, views: +bookmark.views + 1 } : bookmark;
            });
        } case types.BOOKMARKS_RETRIEVED: {
            const { bookmarks } = action.payload;
            return bookmarks.length > 0 ? state.concat(bookmarks) : state;
        } case types.BOOKMARKS_FILTERED: {
            const { bookmarks } = action.payload;
            return bookmarks !== null ? state.map(bookmark => {
                return {...bookmark, isDisplayed: bookmarks.find(filtered => filtered.bookmarkId === bookmark.bookmarkId) ? true : false};
            }) : state.map(bookmark => { return { ...bookmark, isDisplayed: true } });
        } case types.BOOKMARKS_SORTED: {
            let sorted = [...state];
            switch (action.payload.sortCase) {
                case "Date Modified-desc": return sorted.sort((a,b) => b.dateModified.localeCompare(a.dateModified));
                case "Date Modified-asc": return sorted.sort((a,b) => a.dateModified.localeCompare(b.dateModified));
                case "Date Created-desc": return sorted.sort((a,b) => b.dateCreated.localeCompare(a.dateCreated));
                case "Date Created-asc": return sorted.sort((a,b) => a.dateCreated.localeCompare(b.dateCreated));
                case "Title-desc": return sorted.sort((a,b) => b.title.localeCompare(a.title));
                case "Title-asc": return sorted.sort((a,b) => a.title.localeCompare(b.title));
                case "Views-desc": return sorted.sort((a,b) => b.views.toString().localeCompare(a.views.toString(), undefined, { numeric: true }));
                case "Views-asc": return sorted.sort((a,b) => a.views.toString().localeCompare(b.views.toString(), undefined, { numeric: true }));
                case "Image Size-desc": return sorted.sort((a,b) => b.imageSize - a.imageSize);
                case "Image Size-asc": return sorted.sort((a,b) => a.imageSize - b.imageSize);
                default: return state;
            }
        } case types.BOOKMARK_DELETED: {
            const { bookmarkId } = action.payload.bookmark;
            return state.filter(bookmark => bookmark.bookmarkId !== bookmarkId);
        } default: {
            return state;
        }
    }
}

export default bookmark;