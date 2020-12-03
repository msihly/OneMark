import React from "react";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";
import { toast } from "react-toastify";
import { Account, NavMenu, SearchBar, SortButton } from "./";
import { Modal } from "../popovers";
import { Editor } from "../bookmarks";
import Auth from "../../utils/auth";

const NavBar = ({ history }) => {
    const dispatch = useDispatch();

    const isEditorOpen = useSelector(state => state.modals.find(modal => modal.id === "bookmark-create")?.isOpen || false);
    const isAccountOpen = useSelector(state => state.modals.find(modal => modal.id === "account")?.isOpen || false);

    const logout = async () => {
        const res = await Auth.logout();
        if (!res.success) return toast.error(res.message);

        dispatch(actions.stateReset());
        toast.success("Logout successful");
        setTimeout(() => history.push("/login"), 500);
    };

    return (
        <nav className="navbar">
            <div className="nav-btn create-bookmark" onClick={() => dispatch(actions.modalOpened("bookmark-create"))}>
                {isEditorOpen && (
                    <Modal id="bookmark-create" classes={`pad-ctn-2${isEditorOpen ? "" : " hidden"}`} hasHeader hasBackdrop>
                        <Editor id="bookmark-create" bookmark={{}} />
                    </Modal>
                )}
            </div>
            <SearchBar hasAdvanced />
            <NavMenu id="sort-menu" classes="sort-menu">
                <SortButton type="Date Modified" direction="desc" />
                <SortButton type="Date Modified" direction="asc" />
                <SortButton type="Date Created" direction="desc" />
                <SortButton type="Date Created" direction="asc" />
                <SortButton type="Title" direction="desc" />
                <SortButton type="Title" direction="asc" />
                <SortButton type="Views" direction="desc" />
                <SortButton type="Views" direction="asc" />
                <SortButton type="Image Size" direction="desc" />
                <SortButton type="Image Size" direction="asc" />
            </NavMenu>
            <NavMenu id="side-menu" classes="side-menu down-arrow">
                <div className="side-menu-btn" onClick={() => dispatch(actions.modalOpened("account"))}>ACCOUNT</div>
                {isAccountOpen && (
                    <Modal id="account" classes="account-modal" hasBackdrop>
                        <Account />
                    </Modal>
                )}
                <div className="side-menu-btn" onClick={() => history.push("/privacy")}>PRIVACY</div>
                <div className="side-menu-btn" onClick={logout}>LOGOUT</div>
            </NavMenu>
        </nav>
    );
};

export default withRouter(NavBar);