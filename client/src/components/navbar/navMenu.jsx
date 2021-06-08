import React, { cloneElement, isValidElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions";

const NavMenu = ({ children, classes, id }) => {
    const dispatch = useDispatch();

    const isOpen = useSelector(state => state.menus.find(menu => menu.id === id)?.isOpen || false);

    const toggleMenu = event => {
        event.stopPropagation();
		dispatch(isOpen ? actions.menuClosed(id) : actions.menuOpened(id));
    };

    return (
        <div className="nav-menu">
            <div className={`nav-btn ${classes ?? ""}`.trim()} onClick={toggleMenu} />
            <div className={`nav-menu-content${isOpen ? "" : " hidden"}`}>
                {children.map((child, key) => {
                    return !isValidElement(child) ? child : cloneElement(child, { key, onClick: event => {
                        event.stopPropagation();
                        dispatch(actions.menuClosed(id));
                        child.props.onClick();
                    } });
                })}
            </div>
        </div>
    );
};

export default NavMenu;