import React from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../store/actions";

const SortButton = ({ direction, type }) => {
    const dispatch = useDispatch();

    return (
        <div className={`sort-menu-btn${localStorage.getItem("sort") === `${type}-${direction}` ? " active" : ""}`}
            onClick={() => dispatch(actions.bookmarksSorted(`${type}-${direction}`))}>
            <span>{type}</span>
            <span>{direction === "desc" ? "\u2193" : "\u2191"}</span>
        </div>
    );
};

export default SortButton;