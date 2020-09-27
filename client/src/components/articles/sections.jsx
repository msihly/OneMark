import React, { cloneElement } from "react";

const Sections = ({ children, hashPrefix }) => (
    <ol>
        { children && children.map((child, idx) => cloneElement(child, { id: `${hashPrefix}-${idx + 1}` })) }
    </ol>
);

const Section = ({ children, id, header, subheading, summary }) => (
    <li id={id}>
        <h3 className="header">{ header }</h3>
        { subheading ? (<h4>{ subheading }</h4>) : null }
        { summary ? (<p className="summary"><b>{ "In Short: " }</b>{ summary }</p>) : null }
        { children }
    </li>
);

export { Sections, Section };