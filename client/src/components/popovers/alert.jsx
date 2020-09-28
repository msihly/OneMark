import React, { Component, Children, cloneElement } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Modal from "./modal";

export class Button extends Component {
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

class Alert extends Component {
    closeAlert = () => {
        const { id, closeModal } = this.props;
        closeModal(id);
    }

    render() {
        const { children, id, modalClasses, iconClasses, icon, heading, subheading } = this.props;
        return (
            <Modal id={id} classes={modalClasses ?? null}>
                <div className="alert">
                    { icon && <img className={`alert-icon ${iconClasses ?? ""}`} src={icon} alt="" /> }
                    <div className="alert-heading">{heading}</div>
                    { subheading && <div className="alert-subheading">{subheading}</div> }
                    <div className="row j-center">
                        <Button text="Cancel" classes="grey" handleClose={this.closeAlert} />
                        {children && Children.map(children, child => cloneElement(child, { handleClose: this.closeAlert }))}
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapDispatchToProps = dispatch => ({
	closeModal: id => dispatch(actions.modalClosed(id)),
});

export default connect(null, mapDispatchToProps)(Alert);