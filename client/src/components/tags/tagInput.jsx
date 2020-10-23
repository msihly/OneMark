import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import { Tag } from "./";
import { regexEscape } from "../../utils";

class TagInput extends Component {
    state = {
        displayedTags: this.props.initValue ?? [],
        buttonClass: "",
        value: ""
    }

    componentDidMount = () => {
        const { id, initValue, createInput } = this.props;
        createInput(id, initValue ?? []);
    }

    componentWillUnmount = () => {
        const { id, deleteInput } = this.props;
        deleteInput(id);
    }

    addTag = (tag) => {
        const { id, tags, addTag } = this.props;
        addTag(id, tag);
        this.setState({ displayedTags: [...tags, tag], buttonClass: "" });
    }

    removeTag = (tag) => {
        const { id, tags, removeTag } = this.props;
        removeTag(id, tag);
        this.setState({ displayedTags: tags.filter(t => t !== tag), buttonClass: "" });
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
            case "add":
                this.addTag(value);
                this.setState({ value: "" });
                break;
            case "del":
                this.removeTag(value);
                this.setState({ value: "" });
                break;
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