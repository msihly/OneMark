import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions.js";

class Input extends Component {
    state = {
        hasError: false,
        errorDesc: "Valid"
    }

    componentDidMount = () => {
        const { id, initValue, createInput } = this.props;
        createInput(id, initValue ?? "");
    }

    componentWillUnmount = () => {
        const { id, deleteInput } = this.props;
        deleteInput(id);
    }

    handleInput = (event) => {
        const { id, hasErrorCheck, updateInput } = this.props;
        const ele = event.target;
        const cursorPos = ele.selectionStart;
        window.requestAnimationFrame(() => {
            ele.selectionStart = cursorPos;
            ele.selectionEnd = cursorPos;
        });

        updateInput(id, event.target.value);
        if (hasErrorCheck) { this.checkError(event.target.value); }
    }

    checkError = (value) => {
        const errorDesc = this.checkValidity(value);
        this.setState({hasError: errorDesc === "Valid" ? false : true, errorDesc});
    }

    checkValidity = (value) => {
        const { name, isRequired } = this.props;

        if (isRequired && !value) { return "Field is required"; }
        switch (name) {
            case "title":
                if (value.length > 255) { return "Title cannot be more than 255 characters"; }
                break;
            case "pageUrl":
                if (value.length > 2083) { return "Page URL cannot be more than 2083 characters"; }
                else if (!/^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/.test(value)) { return "Invalid URL"; }
                break;
            default:
        }
        return "Valid";
    }

    render() {
        const [{ isRow, isTransparent, value, type, name, classes, label, title, placeholder, hasErrorCheck, isRequired, isDisabled }, { hasError, errorDesc }] = [this.props, this.state];
        return (
            <React.Fragment>
                <ConditionalWrap condition={isRow} wrap={children => <div className="row">{children}</div>}>
                    { isRow ? (
                        <label className="lb-title horizontal" title={title ?? null}>{label}</label>
                    ) : null }
                    <div className={`form-group${!hasErrorCheck ? " no-error": ""}${isRow ? " full-width" : ""}${isTransparent ? " rev" : ""}`}>
                        { !isRow && !isTransparent ? (
                            <label title={title ?? null}>{label}</label>
                        ) : !isRow && isTransparent ? (
                            <label className={`error-label${hasError ? "" : " invisible"}`}>{errorDesc}</label>
                        ) : null }
                        <input onInput={this.handleInput} value={value ?? null} type={type} name={name ?? null} className={`${classes ?? ""}${isTransparent ? " t-input" : ""}`}
                            placeholder={placeholder ?? null} required={isRequired ?? null} disabled={isDisabled ?? null} />
                        { hasErrorCheck && !isTransparent ? (
                            <label className={`error-label${hasError ? "" : " invisible"}`}>{errorDesc}</label>
                        ) : hasErrorCheck && isTransparent ? (
                            <label className={isTransparent ? "lb-title" : ""} title={title ?? null}>{label}</label>
                        ) : null }
                    </div>
                </ConditionalWrap>
            </React.Fragment>
        );
    }
}

const ConditionalWrap = ({ condition, wrap, children }) => ( condition ? wrap(children) : children );

const mapStateToProps = (state, ownProps) => ({
    value: Object(state.inputs.find(input => input.id === ownProps.id)).value
});

const mapDispatchToProps = dispatch => ({
    createInput: (id, value) => dispatch(actions.inputCreated(id, value)),
    updateInput: (id, value) => dispatch(actions.inputUpdated(id, value)),
    deleteInput: (id) => dispatch(actions.inputDeleted(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Input);