import React, { Component } from "react";

class MultiSelectButton extends Component {
    render() {
        const { icon, text, handleClick } = this.props;
        return (
            <div onClick={handleClick} className="multi-select-btn">
                <img src={icon} alt="" />
                <span>{text}</span>
            </div>
        );
    }
}

export default MultiSelectButton;