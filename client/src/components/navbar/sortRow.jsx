import React, { useContext } from "react";
import { SortContext } from "components/views";
import * as Media from "media";

const SortRow = ({ attribute, title }) => {
    return (
        <div className="sort-row">
            <span className="sort-title">{title}</span>
            <SortButton {...{ attribute }} dir="desc" />
            <SortButton {...{ attribute }} dir="asc" />
        </div>
    );
};

const SortButton = ({ attribute, dir }) => {
    const { sortKey, setSortKey, sortDir, setSortDir } = useContext(SortContext);

    const updateSort = (dir) => {
        if (sortKey !== attribute) {
            localStorage.setItem("sortKey", attribute);
            setSortKey(attribute);
        }

        if (sortDir !== dir) {
            localStorage.setItem("sortDir", dir);
            setSortDir(dir);
        }
    };

    const getButtonClasses = (dir) => {
        let className = "sort-button";
        if (dir === "asc") className += " rotate-180";
        if (`${attribute}-${dir}` === `${sortKey}-${sortDir}`) className += " active";
        return className;
    };

    return <Media.ChevronSVG onClick={() => updateSort(dir)} className={getButtonClasses(dir)} />;
};

export default SortRow;