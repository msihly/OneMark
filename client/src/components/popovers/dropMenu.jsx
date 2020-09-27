import React, { Component, isValidElement, cloneElement } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";

class DropMenu extends Component {
	toggleMenu = (event) => {
		event.stopPropagation();
		const { id, isOpen, closeMenu, openMenu } = this.props;
		isOpen ? closeMenu(id) : openMenu(id);
    }

	render() {
        const { children, id, isOpen, isWrapped, retainOnClick, contentClasses, toggleClasses, closeMenu } = this.props;
		return (
            <ConditionalWrap condition={isWrapped} wrap={children => <div class="menu">{children}</div>}>
                <React.Fragment>
                    <div className={`${contentClasses ? contentClasses : "menu-content"}${isOpen ? "" : " hidden"}`}>
                        {children.map((child, key) => {
                            return !isValidElement(child) ? child : cloneElement(child, {
                                key,
                                onClick: (event) => {
                                    event.stopPropagation();
                                    if (!retainOnClick) { closeMenu(id); }
                                    if (child.props.handleClick) { child.props.handleClick(); }
                                }
                            });
                        })}
                    </div>
                    <div onClick={this.toggleMenu} className={toggleClasses ? toggleClasses : "menu-toggle"}></div>
                </React.Fragment>
            </ConditionalWrap>
		);
	}
}

const ConditionalWrap = ({ condition, wrap, children }) => ( condition ? wrap(children) : children );

const mapStateToProps = (state, ownProps) => ({
	isOpen: Object(state.menus.find(menu => menu.id === ownProps.id)).isOpen || false,
});

const mapDispatchToProps = dispatch => ({
	closeMenu: id => dispatch(actions.menuClosed(id)),
	openMenu: (id, parent) => dispatch(actions.menuOpened(id, parent)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DropMenu);