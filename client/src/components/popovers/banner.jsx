import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import { Portal } from "../popovers";

class Banner extends Component {
    close = () => {
        const { id, handleClose, closeBanner } = this.props;
        if (handleClose) { handleClose(); }
        closeBanner(id);
    }

    render() {
        const { children, classes } = this.props;
        return (
            <Portal>
                <div className={`banner ${classes ?? ""}`}>
                    <span onClick={this.close} className="close">&times;</span>
                    { children }
                </div>
            </Portal>
        );
    }
}
const mapDispatchToProps = dispatch => ({
    closeBanner: id => dispatch(actions.modalClosed(id)),
});

export default connect(null, mapDispatchToProps)(Banner);