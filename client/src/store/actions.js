import * as types from "./actionTypes.js";
import Auth from "../utils/auth.js";
import { toast } from "react-toastify";

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
export const createBookmark = (formData) => async (dispatch) => {
    try {
        let res = await(await fetch("/api/bookmark", { method: "POST", body: formData })).json();
        if (!res.success) { throw new Error(res.message); }
        await dispatch(bookmarkCreated(res.bookmark));
        toast.success("Bookmark created");
        return true;
    } catch (e) {
        toast.error(e.message);
        if (e.message === "Unauthorized access") { Auth.localLogout(); }
    }
};

export const bookmarkCreated = (bookmark) => ({
    type: types.BOOKMARK_CREATED,
    payload: { bookmark }
});

export const editBookmark = (formData) => async (dispatch) => {
    try {
        let res = await (await fetch(`/api/bookmark/${formData.get("bookmarkId")}`, { method: "PUT", body: formData })).json();
        if (!res.success) { throw new Error(res.message); };
        await dispatch(bookmarkEdited(res.bookmark));
        return true;
    } catch (e) {
        toast.error(e.message);
        if (e.message === "Unauthorized access") { Auth.localLogout(); }
    }
};

export const bookmarkEdited = (bookmark) => ({
    type: types.BOOKMARK_EDITED,
    payload: { bookmark }
});

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

export const bookmarkViewed = (bookmarkId) => ({
    type: types.BOOKMARK_VIEWED,
    payload: { bookmarkId }
});

export const deleteBookmark = (bookmark) => async (dispatch) => {
    try {
        let res = await (await fetch(`/api/bookmark/${bookmark.bookmarkId}`, { method: "DELETE" })).json();
        if (!res.success) { throw new Error(res.message); };
        await dispatch(bookmarkDeleted(bookmark));
        toast.success("Bookmark deleted");
        return true;
    }  catch (e) {
        toast.error(e.message);
        if (e.message === "Unauthorized access") { Auth.localLogout(); }
    }
};

export const bookmarkDeleted = (bookmark) => ({
    type: types.BOOKMARK_DELETED,
    payload: { bookmark }
});

export const bookmarksRetrieved = (bookmarks) => ({
    type: types.BOOKMARKS_RETRIEVED,
    payload: { bookmarks }
});

export const getBookmarks = () => async (dispatch) => {
    try {
        let res = await (await fetch("/api/bookmarks", { method: "GET" })).json();
        if (!res.success) { throw new Error(res.message); };
        let bookmarks = res.bookmarks.map(bookmark => { return { ...bookmark, isDisplayed: true } });
        await dispatch(bookmarksRetrieved(bookmarks));
        if (bookmarks.length === 0) { toast.info("No bookmarks found"); };
        return true;
    }  catch (e) {
        toast.error(e.message);
        if (e.message === "Unauthorized access") { Auth.localLogout(); }
    }
};

export const bookmarksFiltered = (bookmarks) => ({
    type: types.BOOKMARKS_FILTERED,
    payload: { bookmarks }
});

export const bookmarksSorted = (sortCase) => {
    if (!sortCase) { sortCase = localStorage.getItem("sort") ?? "Date Modified-desc"; }
    localStorage.setItem("sort", sortCase);
    return { type: types.BOOKMARKS_SORTED, payload: { sortCase } };
}

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
export const inputCreated = (id, value) => ({
    type: types.INPUT_CREATED,
    payload: { id, value }
});

export const inputUpdated = (id, value) => ({
    type: types.INPUT_UPDATED,
    payload: { id, value }
});

export const inputDeleted = (id) => ({
    type: types.INPUT_DELETED,
    payload: { id }
});

export const imageInputCreated = (id, value) => ({
    type: types.IMAGE_INPUT_CREATED,
    payload: { id, value }
});

export const imageInputUpdated = (id, value, isImageRemoved) => ({
    type: types.IMAGE_INPUT_UPDATED,
    payload: { id, value, isImageRemoved }
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

export const panelUpdated = (id, value) => ({
    type: types.PANEL_UPDATED,
    payload: { id, value }
});

export const panelDeleted = (id) => ({
    type: types.PANEL_DELETED,
    payload: { id }
});