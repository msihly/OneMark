import * as types from "store/actions/types";
import * as actions from "store/actions";
import { toast } from "react-toastify";
import { castObjectNumbers, emptyStringsToNull } from "utils";
import { fetchAuthed, handleErrors } from "utils/auth";

/* ---------------------------- PLAIN ACTIONS ---------------------------- */
export const bookmarkCreated = (bookmark) => ({
    type: types.BOOKMARK_CREATED,
    payload: { bookmark }
});

export const bookmarksDeleted = (bookmarkIds) => ({
    type: types.BOOKMARKS_DELETED,
    payload: { bookmarkIds }
});

export const bookmarkEdited = (bookmark) => ({
    type: types.BOOKMARK_EDITED,
    payload: { bookmark }
});

export const bookmarksFiltered = (bookmarks) => ({
    type: types.BOOKMARKS_FILTERED,
    payload: { bookmarks }
});

export const bookmarksRetrieved = (bookmarks) => ({
    type: types.BOOKMARKS_RETRIEVED,
    payload: { bookmarks }
});

export const bookmarkSelected = (bookmarkId) => ({
    type: types.BOOKMARK_SELECTED,
    payload: { bookmarkId }
});

export const bookmarksUnselected = () => ({
    type: types.BOOKMARKS_UNSELECTED,
    payload: { }
});

export const bookmarkViewed = (bookmarkId) => ({
    type: types.BOOKMARK_VIEWED,
    payload: { bookmarkId }
});

export const tagsUpdated = ({ bookmarkIds, addedTags, removedTags, dateModified }) => ({
    type: types.TAGS_UPDATED,
    payload: { bookmarkIds, addedTags, removedTags, dateModified }
});

export const unselectAllBookmarks = () => (dispatch) => {
    dispatch(bookmarksUnselected());
    dispatch(actions.multiSelectsUnselected());
};

/* -------------------------------- THUNKS ------------------------------- */
export const createBookmark = (formData, history) => handleErrors(async (dispatch) => {
    const res = await fetchAuthed("/api/bookmark", { method: "POST", body: formData });

    const bookmark = emptyStringsToNull(res.bookmark);
    dispatch(bookmarkCreated(bookmark));

    toast.success("Bookmark created");
    return { success: true, bookmark };
}, { isAuth: true, hasToast: true, history });

export const deleteBookmarks = (formData, history) => handleErrors(async (dispatch) => {
    const res = await fetchAuthed("/api/bookmarks", { method: "DELETE", body: formData });

    dispatch(bookmarksDeleted(res.bookmarkIds));

    toast.success(`${res.bookmarkIds.length} bookmarks deleted`);
    return res;
}, { isAuth: true, hasToast: true, history });

export const editBookmark = (formData, history) => handleErrors(async (dispatch) => {
    const res = await fetchAuthed(`/api/bookmark`, { method: "PUT", body: formData });

    const bookmark = castObjectNumbers(res.bookmark);
    dispatch(bookmarkEdited(bookmark));

    toast.success("Bookmark edited");
    return { success: true, bookmark };
}, { isAuth: true, hasToast: true, history });

export const editTags = (formData, history) => handleErrors(async (dispatch) => {
    const res = await fetchAuthed("/api/bookmark/tags", { method: "PUT", body: formData });

    dispatch(tagsUpdated(res));

    toast.success("Tags updated");
    return res;
}, { isAuth: true, hasToast: true, history });

export const getBookmarks = (history) => handleErrors(async (dispatch) => {
    const res = await fetchAuthed("/api/bookmarks", { method: "GET" });

    const bookmarks = res.bookmarks.map(bk => ({ ...bk, isDisplayed: true, isSelected: false }));
    dispatch(bookmarksRetrieved(bookmarks));

    bookmarks.length > 0 ? toast.success("Bookmarks loaded") : toast.info("No bookmarks found");
    return { success: true, bookmarks };
}, { isAuth: true, hasToast: true, history });

export const viewBookmark = (bookmarkId, history) => handleErrors(async (dispatch) => {
    await fetchAuthed(`/api/bookmark/${bookmarkId}/view`, { method: "PUT" });

    dispatch(bookmarkViewed(bookmarkId));

    return { success: true };
}, { isAuth: true, history });