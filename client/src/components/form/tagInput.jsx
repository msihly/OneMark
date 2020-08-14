import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions.js";
import { regexEscape } from "../../utils";

class Tag extends Component {
    removeTag = () => {
        const { value, handleRemoval } = this.props;
        handleRemoval(value);
    }

    render() {
        const { value } = this.props;
        return (
            <div className="tag">
                <div className="tag-text">{value}</div>
                <span onClick={this.removeTag} className="tag-x">{"\u00D7"}</span>
            </div>
        );
    }
}

class TagInput extends Component {
    state = {
        displayedTags: this.props.initValue,
        buttonClass: "",
        value: ""
    }

    componentDidMount = () => {
        const { id, initValue, createInput } = this.props;
        createInput(id, initValue);
    }

    componentWillUnmount = () => {
        const { id, deleteInput } = this.props;
        deleteInput(id);
    }

    addTag = (tag) => {
        const [{ id, addTag }, { displayedTags, buttonClass, value }] = [this.props, this.state];
        addTag(id, tag);
        this.setState({
            displayedTags: [...displayedTags, tag],
            buttonClass: value === tag ? "del" : buttonClass
        });
    }

    removeTag = (tag) => {
        const [{ id, removeTag }, { displayedTags, buttonClass, value }] = [this.props, this.state];
        removeTag(id, tag);
        this.setState({
            displayedTags: displayedTags.filter(t => t !== tag),
            buttonClass: value === tag ? "add" : buttonClass
        });
    }

    displayTags = (value) => {
        const { tags } = this.props;
        if (value) {
            const re = new RegExp(regexEscape(value), "i");
            this.setState({
                displayedTags: tags.filter(tag => re.test(tag)),
                buttonClass: tags.includes(value) ? "del" : "add"
            });
        } else {
            this.setState({displayedTags: tags, buttonClass: ""});
        }
    }

    handleSearch = (event) => {
        const { value } = event.target;
        this.setState({ value });
        this.displayTags(value);
    }

    handleButtonClick = () => {
        const { buttonClass, value } = this.state;
        switch (buttonClass) {
            case "add": this.addTag(value); break;
            case "del": this.removeTag(value); break;
            default:
        }
    }

    render() {
        const { displayedTags, buttonClass, value } = this.state;
        return (
            <div className="column">
                <div className="row">
                    <input onInput={this.handleSearch} value={value} type="text" placeholder="Tags" className="placeholder tag-search" />
                    <span onClick={this.handleButtonClick} className={`tag-search-btn ${buttonClass}`}></span>
                </div>
                <div className="tags">{displayedTags && displayedTags.map((tag, idx) => <Tag key={idx} value={tag} handleRemoval={this.removeTag} />)}</div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    tags: Object(state.inputs.find(input => input.id === ownProps.id)).value,
});

const mapDispatchToProps = dispatch => ({
    createInput: (id, value) => dispatch(actions.inputCreated(id, value)),
    addTag: (id, value) => dispatch(actions.tagAdded(id, value)),
    removeTag: (id, value) => dispatch(actions.tagRemoved(id, value)),
    deleteInput: (id) => dispatch(actions.inputDeleted(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(TagInput);