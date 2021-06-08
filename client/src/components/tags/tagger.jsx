import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions";
import { toast } from "react-toastify";
import { Modal } from "components/popovers";
import { Form } from "components/form";
import { TagInput, TagList } from "./";
import { arrayIntersect } from "utils";

const Tagger = ({ bookmarks }) => {
    const dispatch = useDispatch();

    const addedTags = useSelector(state => state.inputs.find(i => i.id === "tagger-add"))?.value ?? [];
    const removedTags = useSelector(state => state.inputs.find(i => i.id === "tagger-del"))?.value ?? [];

    const handleSubmit = async () => {
        if (addedTags.length === 0 && removedTags.length === 0) return toast.error("You must enter at least one tag");

        const intersection = arrayIntersect(addedTags, removedTags);
        if (intersection.length > 0) return toast.warning(`Tags [${intersection}] found in add and remove tables`);

        const formData = new FormData();
        formData.append("addedTags", JSON.stringify(addedTags));
        formData.append("removedTags", JSON.stringify(removedTags));
        formData.append("bookmarkIds", JSON.stringify(bookmarks.flatMap(bookmark => bookmark.bookmarkId)));

        const res = await dispatch(actions.editTags(formData));
        if (!res?.success) return toast.error("Error updating tags");
    };

    return (
        <Modal id="tagger" classes="tagger pad-ctn-1" hasHeader hasBackdrop>
            <Form submitText="Edit Tags" submitClasses="submit" onSubmit={handleSubmit}>
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
        </Modal>
    );
};

export default Tagger;