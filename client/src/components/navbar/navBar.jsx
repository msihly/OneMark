import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import { Account, NavMenu, SearchBar, SortButton } from "./";
import { Modal } from "../popovers";
import { Editor } from "../bookmarks";
import Auth from "../../utils/auth";
import { toast } from "react-toastify";

class NavBar extends Component {
    openEditor = () => this.props.openModal("bookmark-create");

    openAccount = () => this.props.openModal("account");

    openPrivacyPolicy = () => this.props.history.push("/privacy");

    logout = async () => {
        const { resetState, history } = this.props;
        let res = await Auth.logout();
        if (res.success) {
            resetState();
            toast.success("Logout successful");
            setTimeout(() => history.push("/login"), 500);
        } else { toast.error(res.message); }
    }

	render() {
        const { isEditorOpen, isAccountOpen } = this.props;
		return (
			<nav className="navbar">
				<div onClick={this.openEditor} className="nav-btn create-bookmark">
                    { isEditorOpen && (
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
                    <div onClick={this.openAccount} className="side-menu-btn">ACCOUNT</div>
                    { isAccountOpen && (
                        <Modal id="account" classes="account-modal" hasBackdrop>
                            <Account />
                        </Modal>
                    )}
                    <div onClick={this.openPrivacyPolicy} className="side-menu-btn">PRIVACY</div>
                    <div onClick={this.logout} className="side-menu-btn">LOGOUT</div>
                </NavMenu>
			</nav>
		);
	}
}

const mapStateToProps = (state) => ({
    isEditorOpen: Object(state.modals.find(modal => modal.id === "bookmark-create")).isOpen || false,
    isAccountOpen: Object(state.modals.find(modal => modal.id === "account")).isOpen || false,
});

const mapDispatchToProps = dispatch => ({
    openModal: id => dispatch(actions.modalOpened(id)),
    resetState: () => dispatch(actions.stateReset()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));