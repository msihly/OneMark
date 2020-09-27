import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import { formatBytes, formatDate } from "../../utils";

class Info extends Component {
    close = () => {
        const { bookmark: { bookmarkId }, closeModal } = this.props;
        closeModal(`${bookmarkId}-info`);
    }

    render() {
        const { bookmark: { dateCreated, dateModified, imageSize, views } } = this.props;
        return (
            <React.Fragment>
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
                    <button onClick={this.close} className="close">Close</button>
                </div>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => ({
	closeModal: id => dispatch(actions.modalClosed(id)),
});

export default connect(null, mapDispatchToProps)(Info);