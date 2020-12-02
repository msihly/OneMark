import React, { Children, cloneElement, useEffect, useState } from "react";

export const Tab = ({ index, isActive, label, switchTab }) => (
    <div onClick={() => switchTab(index)} className={`tab-button${isActive ? " active" : ""}`}>
        {label}
    </div>
);

export const Tabs = ({ children, containerClasses, initTab, isColumnar, tabClasses }) => {
    children = Children.toArray(children);

    const [activeTab, setActiveTab] = useState(0);

    const activeChild = children ? children[activeTab]?.props : null;

    const getTabClasses = () => {
        let className = "tab-content";
        if (activeChild.className) className += ` ${activeChild.className}`;
        if (tabClasses) className += ` ${tabClasses}`;
        return className;
    };

    useEffect(() => {
        if (initTab !== undefined && initTab !== null) setActiveTab(initTab);
    }, [initTab]);

    return (
        <div className={`${containerClasses ?? ""}${isColumnar ? " row" : " column"}`}>
            <div className={`tab-buttons${isColumnar ? " column" : " row"}`}>
                {children && Children.map(children, (child, index) =>
                    cloneElement(child, {
                        key: index,
                        index: child.props?.index ?? index,
                        isActive: activeTab === index,
                        label: child.props.label,
                        switchTab: setActiveTab,
                    })
                )}
            </div>
            <div className={getTabClasses()}>
                {activeChild && activeChild.children}
            </div>
        </div>
    );
};