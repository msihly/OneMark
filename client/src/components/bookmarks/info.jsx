import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions";
import { VertTable, VertTableRow } from "components/articles";
import { formatBytes, formatDate, getLocalDateTime } from "utils";

const Info = ({ bookmarkId }) => {
    const dispatch = useDispatch();

    const { dateCreated, dateModified, imageSize, views } = useSelector(state => state.bookmarks.find(b => b.bookmarkId === bookmarkId)) ?? { };

    const created = getLocalDateTime(dateCreated);
    const modified = getLocalDateTime(dateModified);

    return (
        <Fragment>
            <VertTable>
                <VertTableRow left="Date Created" right={formatDate(created)} rightTitle={formatDate(created, "datetime")} />
                <VertTableRow left="Date Modified" right={formatDate(modified)} rightTitle={formatDate(modified, "datetime")} />
                <VertTableRow left="Image Size" right={formatBytes(imageSize)} rightTitle={`${imageSize} bytes`} />
                <VertTableRow left="View Count" right={views} />
            </VertTable>

            <div className="row">
                <button className="close" onClick={() => dispatch(actions.modalClosed(`${bookmarkId}-info`))}>Close</button>
            </div>
        </Fragment>
    );
}

export default Info;