import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Portal from "./portal";

class Modal extends Component {
    close = (event) => {
        event.stopPropagation();
        const { closeModal, id } = this.props;
        closeModal(id);
    }

    handleClick = (event) => {
        event.stopPropagation();
    }

    render() {
        const { children, classes, hasHeader} = this.props;
        return (
            <Portal>
                <div onMouseDown={this.close} onMouseUp={this.handleClick} onClick={this.handleClick} className="modal-container dark">
                    <div onMouseDown={this.handleClick} onMouseUp={this.handleClick} onClick={this.handleClick} className={`modal-content ${classes ?? ""}`}>
                        {hasHeader ? (
                            <div className="modal-header">
                                <span onClick={this.close} className="close">&times;</span>
                            </div>
                        ) : null}
                        {children}
                    </div>
                </div>
            </Portal>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
	isOpen: Object(state.modals.find(modal => modal.id === ownProps.id)).isOpen || false,
});

const mapDispatchToProps = dispatch => ({
	closeModal: id => dispatch(actions.modalClosed(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);