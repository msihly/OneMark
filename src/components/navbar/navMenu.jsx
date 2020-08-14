import React, { Component, isValidElement, cloneElement } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions.js";

class NavMenu extends Component {
	toggleMenu = (event) => {
        event.stopPropagation();
		const { id, isOpen, closeMenu, openMenu } = this.props;
		isOpen ? closeMenu(id) : openMenu(id);
    }

    render() {
        const { id, classes, children, isOpen, closeMenu } = this.props;
        return (
			<div className="nav-menu">
				<div onClick={this.toggleMenu} className={`nav-btn ${classes ? classes : ""}`}></div>
				<div className={`nav-menu-content${isOpen ? "" : " hidden"}`}>
					{children.map((child, key) => {
                        return !isValidElement(child) ? child : cloneElement(child, { key, onClick: (event) => {
                            event.stopPropagation();
                            closeMenu(id);
                            child.props.handleClick();
                        } });
                    })}
				</div>
			</div>
		);
    }
}

const mapStateToProps = (state, ownProps) => ({
	isOpen: Object(state.menus.find(menu => menu.id === ownProps.id)).isOpen || false,
});

const mapDispatchToProps = dispatch => ({
	closeMenu: id => dispatch(actions.menuClosed(id)),
	openMenu: (id, parent) => dispatch(actions.menuOpened(id, parent)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavMenu);