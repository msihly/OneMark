import React from "react";

const AlertButton = ({ text, classes, onClick, handleClose }) => {
    const handleClick = () => {
        if (onClick) onClick();
        handleClose();
    };

    return (
        <div className={`alert-button ${classes ?? ""}`} onClick={handleClick}>
            {text}
        </div>
    );
};

export default AlertButton;