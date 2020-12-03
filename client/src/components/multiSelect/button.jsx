import React from "react";

const MultiSelectButton = ({ icon, text, onClick }) => (
    <div onClick={onClick} className="multi-select-btn">
        <img src={icon} alt="" />
        <span>{text}</span>
    </div>
);

export default MultiSelectButton;