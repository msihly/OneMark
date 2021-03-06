import * as types from "./types";
import { toast } from "react-toastify";
import { getLocalDate } from "../../utils";
import Auth from "../../utils/auth";
import * as Media from "../../media";

/******************** RESET STATE ********************/
export const stateReset = () => ({
    type: types.RESET,
    payload: {}
});

/******************** ACCOUNT ********************/
export const getAccount = () => async (dispatch) => {
    try {
        let res = await (await fetch("/api/user/info", { method: "GET" })).json();
        if (!res.success) { throw new Error(res.message); };
        await dispatch(accountRetrieved(res.info));
        return true;
    }  catch (e) {
        toast.error(e.message);
        if (e.message === "Unauthorized access") { Auth.localLogout(); }
    }
};

export const accountRetrieved = (info) => ({
    type: types.ACCOUNT_RETRIEVED,
    payload: { info }
});

export const updateAccount = (formData) => async (dispatch) => {
    try {
        let res = await (await fetch("/api/user/profile", { method: "PUT", body: formData })).json();
        if (!res.success) { throw new Error(res.message); };
        await dispatch(accountUpdated(formData.get("username"), formData.get("email")));
        toast.success("Account updated")
        return true;
    }  catch (e) {
        toast.error(e.message);
        if (e.message === "Unauthorized access") { Auth.localLogout(); }
    }
};

export const accountUpdated = (username, email) => ({
    type: types.ACCOUNT_UPDATED,
    payload: { username, email }
});

/******************** BOOKMARKS ********************/
export const bookmarkCreated = (bookmark) => ({
    type: types.BOOKMARK_CREATED,
    payload: { bookmark }
});

export const bookmarkDeleted = (bookmark) => ({
    type: types.BOOKMARK_DELETED,
    payload: { bookmark }
});

export const bookmarkEdited = (bookmark) => ({
    type: types.BOOKMARK_EDITED,
    payload: { bookmark }
});

export const bookmarksDeleted = (bookmarkIds) => ({
    type: types.BOOKMARKS_DELETED,
    payload: { bookmarkIds }
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

export const bookmarksSorted = (sortCase) => {
    if (!sortCase) { sortCase = localStorage.getItem("sort") ?? "Date Modified-desc"; }
    localStorage.setItem("sort", sortCase);
    return { type: types.BOOKMARKS_SORTED, payload: { sortCase } };
};

export const bookmarksUnselected = () => ({
    type: types.BOOKMARKS_UNSELECTED,
    payload: {}
});

export const bookmarkViewed = (bookmarkId) => ({
    type: types.BOOKMARK_VIEWED,
    payload: { bookmarkId }
});

export const createBookmark = (formData) => async (dispatch) => {
    try {
        let res = await(await fetch("/api/bookmark", { method: "POST", body: formData })).json();
        if (!res.success) { throw new Error(res.message); }
        const { bookmark, bookmark: { dateCreated, dateModified, imagePath } } = res;
        await dispatch(bookmarkCreated({
            ...bookmark,
            dateCreated: getLocalDate(dateCreated),
            dateModified: getLocalDate(dateModified),
            imagePath: imagePath === "none" ? Media.NoImage : imagePath
        }));
        toast.success("Bookmark created");
        return true;
    } catch (e) {
        toast.error(e.message);
        if (e.message === "Unauthorized access") { Auth.localLogout(); }
    }
};

export const deleteBookmark = (bookmark) => async (dispatch) => {
    try {
        let res = await (await fetch(`/api/bookmark/${bookmark.bookmarkId}`, { method: "DELETE" })).json();
        if (!res.success) { throw new Error(res.message); };
        await dispatch(bookmarkDeleted(bookmark));
        toast.success("Bookmark deleted");
        return true;
    } catch (e) {
        toast.error(e.message);
        if (e.message === "Unauthorized access") { Auth.localLogout(); }
    }
};

export const deleteBookmarks = (formData) => async (dispatch) => {
    try {
        let res = await (await fetch(`/api/bookmarks`, { method: "DELETE", body: formData })).json();
        if (!res.success) { throw new Error(res.message); };
        await dispatch(bookmarksDeleted(res.bookmarkIds));
        toast.success(`${res.bookmarkIds.length} bookmarks deleted`);
        return true;
    } catch (e) {
        toast.error(e.message);
        if (e.message === "Unauthorized access") { Auth.localLogout(); }
    }
}

export const editBookmark = (formData) => async (dispatch) => {
    try {
        let res = await (await fetch(`/api/bookmark/${formData.get("bookmarkId")}`, { method: "PUT", body: formData })).json();
        if (!res.success) { throw new Error(res.message); };
        const { bookmark, bookmark: { dateModified, imagePath } } = res;
        await dispatch(bookmarkEdited({
            ...bookmark,
            dateModified: getLocalDate(dateModified),
            imagePath: imagePath === "none" ? Media.NoImage : imagePath
        }));
        toast.success("Bookmark edited");
        return true;
    } catch (e) {
        toast.error(e.message);
        if (e.message === "Unauthorized access") { Auth.localLogout(); }
    }
};

export const editTags = (formData) => async (dispatch) => {
    try {
        let res = await (await fetch("/api/bookmarks/tags", { method: "PUT", body: formData })).json();
        if (!res.success) { throw new Error(res.message); };
        await dispatch(tagsUpdated(res.bookmarkIds, res.addedTags, res.removedTags, res.dateModified));
        toast.success("Tags updated");
        return true;
    } catch (e) {
        toast.error(e.message);
        if (e.message === "Unauthorized access") { Auth.localLogout(); }
    }
}

export const getBookmarks = () => async (dispatch) => {
    try {
        let res = await (await fetch("/api/bookmarks", { method: "GET" })).json();
        if (!res.success) { throw new Error(res.message); };
        const bookmarks = res.bookmarks.map(bk => ({
            ...bk,
            dateCreated: getLocalDate(bk.dateCreated),
            dateModified: getLocalDate(bk.dateModified),
            imagePath: bk.imagePath === "none" ? Media.NoImage : bk.imagePath,
            isDisplayed: true,
            isSelected: false
        }));

        await dispatch(bookmarksRetrieved(bookmarks));
        dispatch(bookmarksSorted());
        if (bookmarks.length === 0) { toast.info("No bookmarks found"); };
        return true;
    }  catch (e) {
        toast.error(e.message);
        if (e.message === "Unauthorized access") { Auth.localLogout(); }
    }
};

export const tagsUpdated = (bookmarkIds, addedTags, removedTags, dateModified) => ({
    type: types.TAGS_UPDATED,
    payload: { bookmarkIds, addedTags, removedTags, dateModified }
});

export const unselectAllBookmarks = () => (dispatch) => {
    dispatch(bookmarksUnselected());
    dispatch(multiSelectsUnselected());
};

export const viewBookmark = (bookmarkId) => async (dispatch) => {
    try {
        let res = await (await fetch(`/api/bookmark/${bookmarkId}/view`, { method: "PUT" })).json();
        if (!res.success) { throw new Error(res.message); };
        await dispatch(bookmarkViewed(bookmarkId));
        return true;
    } catch (e) {
        toast.error(e.message);
        if (e.message === "Unauthorized access") { Auth.localLogout(); }
    }
};

/******************** MENUS ********************/
export const externalClick = () => ({
    type: types.EXTERNAL_CLICK,
    payload: {}
});

export const menuClosed = (id, parent = "") => ({
    type: types.MENU_CLOSED,
    payload: { id, parent }
});

export const menuOpened = (id, parent = "") => ({
    type: types.MENU_OPENED,
    payload: { id, parent }
});

/******************** MODALS ********************/
export const modalClosed = (id) => ({
    type: types.MODAL_CLOSED,
    payload: { id }
});

export const modalOpened = (id) => ({
    type: types.MODAL_OPENED,
    payload: { id }
});

/******************** INPUTS ********************/
export const imageInputCreated = (id, value) => ({
    type: types.IMAGE_INPUT_CREATED,
    payload: { id, value }
});

export const imageInputUpdated = (id, value, isImageRemoved) => ({
    type: types.IMAGE_INPUT_UPDATED,
    payload: { id, value, isImageRemoved }
});

export const inputCreated = (id, value) => ({
    type: types.INPUT_CREATED,
    payload: { id, value }
});

export const inputDeleted = (id) => ({
    type: types.INPUT_DELETED,
    payload: { id }
});

export const inputUpdated = (id, value) => ({
    type: types.INPUT_UPDATED,
    payload: { id, value }
});

export const multiSelectsUnselected = () => ({
    type: types.MULTI_SELECTS_UNSELECTED,
    payload: {}
});

export const tagAdded = (id, value) => ({
    type: types.TAG_ADDED,
    payload: { id, value }
});

export const tagRemoved = (id, value) => ({
    type: types.TAG_REMOVED,
    payload: { id, value }
});

/******************** PANELS ********************/
export const panelCreated = (id, value) => ({
    type: types.PANEL_CREATED,
    payload: { id, value }
});

export const panelDeleted = (id) => ({
    type: types.PANEL_DELETED,
    payload: { id }
});

export const panelUpdated = (id, value) => ({
    type: types.PANEL_UPDATED,
    payload: { id, value }
});