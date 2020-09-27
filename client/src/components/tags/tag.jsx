import React, { Component } from "react";

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

export default Tag;