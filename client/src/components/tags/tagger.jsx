import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Form from "../form/form";
import TagList from "./tagList";
import TagInput from "./tagInput";
import { toast } from "react-toastify";
import { arrayIntersect } from "../../utils";

class Tagger extends Component {
    handleSubmit = async () => {
        const { bookmarks, addedTags, removedTags, editTags, sortBookmarks } = this.props;
        if (addedTags.length === 0 && removedTags.length === 0) { return toast.error("You must enter at least one tag"); }
        let intersection = arrayIntersect(addedTags, removedTags);
        if (intersection.length > 0) { return toast.warning(`Tags [${intersection}] found in add and remove tables`); }

        const formData = new FormData();
        formData.append("addedTags", JSON.stringify(addedTags));
        formData.append("removedTags", JSON.stringify(removedTags));
        formData.append("bookmarkIds", JSON.stringify(bookmarks.flatMap(bookmark => bookmark.bookmarkId)));

        let success = await editTags(formData);
        if (!success) { return toast.error("Error updating tags"); }
        sortBookmarks();
    }

    render() {
        const { bookmarks } = this.props;
        return (
            <div className="tagger">
                <Form handleSubmit={this.handleSubmit} submitText="Edit Tags" submitClasses="btn-hollow submit">
                    <div className="column a-center">
                        <h3>Current Tags</h3>
                        <TagList tags={bookmarks.flatMap(bookmark => bookmark.tags)} />
                    </div>
                    <div className="row mg-2">
                        <div className="column">
                            <h3>Add Tags</h3>
                            <TagInput id="tagger-add" name="addedTags" />
                        </div>
                        <div className="column">
                            <h3>Remove Tags</h3>
                            <TagInput id="tagger-del" name="removedTags" />
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    addedTags: Object(state.inputs.find(input => input.id === "tagger-add")).value,
    removedTags: Object(state.inputs.find(input => input.id === "tagger-del")).value,
});

const mapDispatchToProps = dispatch => ({
    editTags: (formData) => dispatch(actions.editTags(formData)),
    sortBookmarks: sortCase => dispatch(actions.bookmarksSorted(sortCase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tagger);