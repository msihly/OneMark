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
        event.preventDefault();
        event.stopPropagation();
        const { id, isChecked, option, handleClick, updateCheckbox } = this.props;
        updateCheckbox(id, !isChecked);
        if (handleClick && option) { handleClick(option); }
        else if (handleClick) { handleClick(!isChecked); }
    }

    render() {
        const { classes, inputName, isChecked, text } = this.props;
        return (
            <label onClick={this.toggleCheckbox} className={`checkbox-ctn${isChecked ? " checked" : ""} ${classes ?? ""}`}>
                <input type="checkbox" name={inputName ?? null} checked={isChecked} />
                <span className="checkbox"></span>
                {text ? (
                    <label className="lb-title checkbox-title">{text}</label>
                ) : null}
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