import React from "react";
import { countItems } from "utils";

const TagList = ({ tags }) => {
    const tagsFreq = countItems(tags);

    return (
        <div className="current-tags">
            {tagsFreq && tagsFreq.map((pair, index) => (
                <div key={index} className="tag">
                    <div className="tag-text">{pair[0]}</div>
                    <span className="tag-count">{pair[1]}</span>
                </div>
            ))}
        </div>
    );
};

export default TagList;