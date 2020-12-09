import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";
import { Form, Input, ImageInput } from "../form";
import { TagInput } from "../tags";
import { toast } from "react-toastify";
import * as Media from "../../media";

const Editor = ({ bookmark, id }) => {
    const dispatch = useDispatch();

    const handleSubmit = async (formData) => {
        if ([...formData].length === 0) return toast.error("FormData is empty");

        formData.append("tags", JSON.stringify(tags));

        if (Object.keys(bookmark).length > 0) {
            formData.append("bookmarkId", bookmark.bookmarkId)
            const success = await dispatch(actions.editBookmark(formData));
            if (!success) return toast.error("Error editing bookmark");
        } else {
            const success = await dispatch(actions.createBookmark(formData));
            if (!success) return toast.error("Error creating bookmark");
        }

        dispatch(actions.bookmarksSorted());
    };

    const imageUrl = useSelector(state => state.inputs.find(input => input.id === `${id}-image`)?.value);
    const pageUrl = useSelector(state => state.inputs.find(input => input.id === `${id}-pageUrl`)?.value);
    const title = useSelector(state => state.inputs.find(input => input.id === `${id}-title`)?.value);
    const tags = useSelector(state => state.inputs.find(input => input.id === `${id}-tags`)?.value);

    return (
        <Fragment>
            <figure className="preview-output" onClick={() => pageUrl && window.open(pageUrl)}>
                <img className="image" src={imageUrl ? (imageUrl !== "none" && imageUrl) : Media.NoImage} alt="" />
                <figcaption className="title">{title || "No Title"}</figcaption>
            </figure>
            <Form onSubmit={handleSubmit} submitText="Submit" submitClasses="submit">
                <ImageInput id={`${id}-image`} inputName="imageUrl" initValue={bookmark?.imagePath ? (bookmark.imagePath !== "none" && bookmark.imagePath) : Media.NoImage} />
                <div className="row mg-2 mobile">
                    <div className="column full-width">
                        <Input id={`${id}-pageUrl`} name="pageUrl" label="Link" placeholder="Enter URL" initValue={bookmark?.pageUrl ?? ""}
                            type="text"  isRow hasErrorCheck isRequired />
                        <Input id={`${id}-title`} name="title" label="Title" placeholder="Enter Title" initValue={bookmark?.title ?? ""}
                            type="text" isRow hasErrorCheck isRequired />
                    </div>
                    <TagInput id={`${id}-tags`} name="tags" initValue={bookmark?.tags} />
                </div>
            </Form>
        </Fragment>
    );
};

export default Editor;