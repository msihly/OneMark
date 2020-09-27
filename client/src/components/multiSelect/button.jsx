import React from "react";

const MultiSelectButton = ({ icon, text, handleClick }) => (
    <div onClick={handleClick} className="multi-select-btn">
        <img src={icon} alt="" />
        <span>{text}</span>
    </div>
);

export default MultiSelectButton;