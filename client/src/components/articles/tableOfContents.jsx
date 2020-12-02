import React from "react";

const TableOfContents = ({ children, hashPrefix }) => (
    <React.Fragment>
        <h2 className="header">Table of Contents</h2>
        <ol className="table-of-contents">
            {children && children.map((child, index) => <li key={index}><a href={`#${hashPrefix}-${index + 1}`}>{child.props.children}</a></li>)}
        </ol>
    </React.Fragment>
);

export default TableOfContents;