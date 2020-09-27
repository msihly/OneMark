import React, { Component, isValidElement, cloneElement } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";

class DropSelect extends Component {
    state = {
        value: this.props.initValue
    }

	toggleMenu = (event) => {
		const { id, parent, isOpen, closeMenu, openMenu } = this.props;
		event.stopPropagation();
		isOpen ? closeMenu(id, parent) : openMenu(id, parent);
    }

    selectOption = (event) => {
        const { id, parent, option, closeMenu, handleSelect } = this.props;
        event.stopPropagation();
        this.setState({value: event.target.innerHTML});
        handleSelect(option, event.target.innerHTML);
        closeMenu(id, parent);
    }

	render() {
		const [{ children, isOpen }, { value }] = [this.props, this.state];
		return (
            <span onClick={this.toggleMenu} className="relative">
                <div className={`drop-menu-content${isOpen ? "" : " hidden"}`}>
                    {children.map((child, key) => {
                        return !isValidElement(child) ? child : cloneElement(child, {
                            key,
                            title: child.props.children,
                            className: `drop-btn ${child.props.className}`,
                            onClick: this.selectOption
                        });
                    })}
                </div>
                <span className="dropdown down-arrow">{value}</span>
            </span>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	isOpen: Object(state.menus.find(menu => menu.id === ownProps.id)).isOpen || false,
});

const mapDispatchToProps = dispatch => ({
	closeMenu: (id, parent) => dispatch(actions.menuClosed(id, parent)),
	openMenu: (id, parent) => dispatch(actions.menuOpened(id, parent)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DropSelect);