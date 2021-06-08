import React from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions";
import { toast } from "react-toastify";
import { Modal } from "components/popovers";
import { Editor } from "components/bookmarks";
import { Account, NavMenu, SearchBar, SortRow } from "./";

const NavBar = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const isEditorOpen = useSelector(state => state.modals.find(m => m.id === "bookmark-create"))?.isOpen ?? false;
    const isAccountOpen = useSelector(state => state.modals.find(m => m.id === "account"))?.isOpen ?? false;

    const logout = async () => {
        const res = await dispatch(actions.logout());
        if (res?.success) {
            toast.success("Logout successful");
            history.push("/login");
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-btn create-bookmark" onClick={() => dispatch(actions.modalOpened("bookmark-create"))} />
            {isEditorOpen &&
                <Modal id="bookmark-create" classes="pad-ctn-2" hasHeader hasBackdrop>
                    <Editor />
                </Modal>
            }

            <SearchBar hasAdvanced />

            <NavMenu id="sort-menu" classes="sort-menu">
                <SortRow attribute="dateModified" title="Date Modified" />
                <SortRow attribute="dateCreated" title="Date Created" />
                <SortRow attribute="title" title="Title" />
                <SortRow attribute="views" title="Views" />
                <SortRow attribute="imageSize" title="Image Size" />
            </NavMenu>

            <NavMenu id="side-menu" classes="side-menu down-arrow">
                <div className="side-menu-btn" onClick={() => dispatch(actions.modalOpened("account"))}>ACCOUNT</div>
                <div className="side-menu-btn" onClick={() => window.open("/privacy", "_blank")}>PRIVACY</div>
                <div className="side-menu-btn" onClick={logout}>LOGOUT</div>
            </NavMenu>

            {isAccountOpen &&
                <Modal id="account" classes="account-modal" hasBackdrop>
                    <Account />
                </Modal>
            }
        </nav>
    );
};

export default NavBar;