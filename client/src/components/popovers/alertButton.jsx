import React, { Component } from "react";

class AlertButton extends Component {
    handleClick = () => {
        const { handleClick, handleClose } = this.props;
        if (handleClick) { handleClick(); }
        handleClose();
    }

    render() {
        const { text, classes } = this.props;
        return (
            <div className={`alert-button ${classes ?? ""}`} onClick={this.handleClick}>{text}</div>
        );
    }
};

export default AlertButton;