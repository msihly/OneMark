import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions.js";

class Panels extends Component {
    componentDidMount = () => {
        const { id, initValue, createPanel } = this.props;
        createPanel(id, initValue ?? 0);
    }

    componentWillUnmount = () => {
        const { id, deletePanel } = this.props;
        deletePanel(id);
    }

    render() {
        const { children, activePanel } = this.props;
        return (
            <React.Fragment>
                { children && children[activePanel] }
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    activePanel: Object(state.panels.find(panel => panel.id === ownProps.id)).value,
});

const mapDispatchToProps = dispatch => ({
    createPanel: (id, value) => dispatch(actions.panelCreated(id, value)),
    updatePanel: (id, value) => dispatch(actions.panelUpdated(id, value)),
    deletePanel: id => dispatch(actions.panelDeleted(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Panels);