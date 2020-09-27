import { Component, cloneElement } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";

class PanelButton extends Component {
    handleClick = () => {
        const { parent, target, updatePanel } = this.props;
        updatePanel(parent, target);
    }

    render() {
        const { children } = this.props;
        return (
             cloneElement(children, { onClick: this.handleClick })
        );
    }
}

const mapDispatchToProps = dispatch => ({
    updatePanel: (id, value) => dispatch(actions.panelUpdated(id, value)),
});

export default connect(null, mapDispatchToProps)(PanelButton);