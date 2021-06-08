import React, { Fragment } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions";
import { Form, Input, ImageInput } from "components/form";
import { TagInput } from "components/tags";
import { toast } from "react-toastify";
import * as Media from "media";

const Editor = ({ bookmarkId }) => {
    const history = useHistory();

    const dispatch = useDispatch();

    const bookmark = useSelector(state => state.bookmarks.find(b => b.bookmarkId === bookmarkId));

    const imageUrl = useSelector(state => state.inputs.find(i => i.id === "image"))?.value;
    const pageUrl = useSelector(state => state.inputs.find(i => i.id === "pageUrl"))?.value;
    const title = useSelector(state => state.inputs.find(i => i.id === "title"))?.value;
    const tags = useSelector(state => state.inputs.find(i => i.id === "tags"))?.value;

    const handleSubmit = async (formData) => {
        if ([...formData].length === 0) return toast.error("FormData is empty");

        formData.append("tags", JSON.stringify(tags));
        if (bookmarkId !== undefined) formData.append("bookmarkId", bookmarkId);

        const res = await dispatch(bookmark ? actions.editBookmark(formData, history) : actions.createBookmark(formData, history));
        if (res?.success) dispatch(actions.modalClosed(bookmarkId !== undefined ? `${bookmarkId}-edit` : "bookmark-create"));
    };

    return (
        <Fragment>
            <figure className="preview-output" onClick={() => pageUrl && window.open(pageUrl)}>
                <img className={`image${imageUrl ? "" : " no-image"}`} src={imageUrl ?? Media.NoImage} alt="" />
                <figcaption className="title">{title || "No Title"}</figcaption>
            </figure>

            <Form onSubmit={handleSubmit} submitText="Submit" submitClasses="submit" labelClasses="small glow">
                <ImageInput id="image" inputName="imageUrl" initValue={bookmark?.imageUrl} style={{ justifyContent: "center" }} />

                <div className="row mg-2 mobile">
                    <div className="column full-width">
                        <Input id="title" name="title" label="Title" placeholder initValue={bookmark?.title} hasErrorCheck isRequired />

                        <Input id="pageUrl" name="pageUrl" label="Page URL" placeholder initValue={bookmark?.pageUrl} hasErrorCheck isRequired />
                    </div>

                    <div className="column">
                        <label className="small glow">Tags</label>
                        <TagInput id="tags" name="tags" initValue={bookmark?.tags} />
                    </div>
                </div>
            </Form>
        </Fragment>
    );
};

export default Editor;