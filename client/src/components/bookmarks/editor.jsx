import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import { Form, Input, ImageInput } from "../form";
import { TagInput } from "../tags";
import { toast } from "react-toastify";
import * as Media from "../../media";

class Editor extends Component {
    handlePreviewClick = () => {
        const { pageUrl } = this.props;
        if (pageUrl) { window.open(pageUrl); }
    }

    handleSubmit = async (formData) => {
        const { bookmark, tags, createBookmark, editBookmark, sortBookmarks } = this.props;
        if ([...formData].length === 0) { return toast.error("FormData is empty"); }
        formData.append("tags", JSON.stringify(tags));

        if (Object.keys(bookmark).length > 0) {
            formData.append("bookmarkId", bookmark.bookmarkId)
            let success = await editBookmark(formData);
            if (!success) { return toast.error("Error editing bookmark"); }
        } else {
            let success = await createBookmark(formData);
            if (!success) { return toast.error("Error creating bookmark"); }
        }
        sortBookmarks();
    }

    render() {
        const { id, bookmark, imageUrl, title } = this.props;
        return (
            <React.Fragment>
                <figure onClick={this.handlePreviewClick} className="preview-output">
                    <img className="image" src={imageUrl ? (imageUrl !== "none" && imageUrl) : Media.NoImage} alt="" />
                    <figcaption className="title">{title || "No Title"}</figcaption>
                </figure>
                <Form handleSubmit={this.handleSubmit} submitText="SUBMIT" submitClasses="btn-hollow submit">
                    <ImageInput id={`${id}-image`} inputName="imageUrl" initValue={bookmark.imagePath ? (bookmark.imagePath !== "none" && bookmark.imagePath) : Media.NoImage} />
                    <div className="row mg-2 mobile">
                        <div className="column full-width">
                            <Input id={`${id}-pageUrl`} initValue={bookmark.pageUrl ?? ""} type="text" placeholder="Enter URL"
                                name="pageUrl" label="Link" isRow hasErrorCheck isRequired />
                            <Input id={`${id}-title`} initValue={bookmark.title ?? ""} type="text" placeholder="Enter Title"
                                name="title" label="Title" isRow hasErrorCheck isRequired />
                        </div>
                        <TagInput id={`${id}-tags`} initValue={bookmark.tags ?? []} name="tags" />
                    </div>
                </Form>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    isImageRemoved: Object(state.inputs.find(input => input.id === `${ownProps.id}-image`)).isImageRemoved,
    imageUrl: Object(state.inputs.find(input => input.id === `${ownProps.id}-image`)).value,
    pageUrl: Object(state.inputs.find(input => input.id === `${ownProps.id}-pageUrl`)).value,
    title: Object(state.inputs.find(input => input.id === `${ownProps.id}-title`)).value,
    tags: Object(state.inputs.find(input => input.id === `${ownProps.id}-tags`)).value,
});

const mapDispatchToProps = dispatch => ({
    createBookmark: bookmark => dispatch(actions.createBookmark(bookmark)),
    editBookmark: bookmark => dispatch(actions.editBookmark(bookmark)),
    sortBookmarks: sortCase => dispatch(actions.bookmarksSorted(sortCase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);