import React, { cloneElement } from "react";

const Sections = ({ children, hashPrefix }) => (
    <ol>
        {children && children.map((child, index) => cloneElement(child, { key: index, id: `${hashPrefix}-${index + 1}` }))}
    </ol>
);

const Section = ({ children, id, header, subheading, summary }) => (
    <li id={id}>
        <h3 className="header">{header}</h3>
        {subheading && <h4>{subheading}</h4>}
        {summary && <p className="summary"><b>{"In Short: "}</b>{summary}</p>}
        {children}
    </li>
);

export { Sections, Section };