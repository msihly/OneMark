import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions.js";

class Checkbox extends Component {
    constructor(props) {
        super(props);
        const { id, initValue, createCheckbox } = this.props;
        createCheckbox(id, initValue);
    }

    componentWillUnmount() {
        const { id, deleteCheckbox } = this.props;
        deleteCheckbox(id);
    }

    toggleCheckbox = (event) => {
        const { id, isChecked, option, handleClick, updateCheckbox } = this.props;
        event.preventDefault();
        updateCheckbox(id, !isChecked);
        if (handleClick && option) { handleClick(option); }
    }

    render() {
        const { inputName, isChecked, text } = this.props;
        return (
            <label onClick={this.toggleCheckbox} className="checkbox-ctn">
                <input type="checkbox" name={inputName ?? null} checked={isChecked} />
                <span className="checkbox"></span>
                <label className="lb-title checkbox-title">{text}</label>
            </label>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    isChecked: Object(state.inputs.find(input => input.id === ownProps.id)).value,
});

const mapDispatchToProps = dispatch => ({
    createCheckbox: (id, value) => dispatch(actions.inputCreated(id, value)),
    updateCheckbox: (id, value) => dispatch(actions.inputUpdated(id, value)),
    deleteCheckbox: (id) => dispatch(actions.inputDeleted(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkbox);