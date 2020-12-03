import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../store/actions";
import { formatBytes, formatDate } from "../../utils";

const Info = ({ bookmark: { bookmarkId, dateCreated, dateModified, imageSize, views } }) => {
    const dispatch = useDispatch();

    return (
        <Fragment>
            <table className="table-vert right">
                <tbody>
                    <tr>
                        <th>Date Created</th>
                        <td>-</td>
                        <td title={formatDate(dateCreated, "datetime")}>{formatDate(dateCreated)}</td>
                    </tr>
                    <tr>
                        <th>Date Modified</th>
                        <td>-</td>
                        <td title={formatDate(dateModified, "datetime")}>{formatDate(dateModified)}</td>
                    </tr>
                    <tr>
                        <th>Image Size</th>
                        <td>-</td>
                        <td title={`${imageSize} bytes`}>{formatBytes(imageSize)}</td>
                    </tr>
                    <tr>
                        <th>View Count</th>
                        <td>-</td>
                        <td>{views}</td>
                    </tr>
                </tbody>
            </table>
            <div className="row">
                <button className="close" onClick={() => dispatch(actions.modalClosed(`${bookmarkId}-info`))}>Close</button>
            </div>
        </Fragment>
    );
}

export default Info;