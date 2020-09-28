import React, { Component } from "react";

class Tabs extends Component {
    state = { activeTab: 0 }

    switchTab = (index) => this.setState({activeTab: index});

    render() {
        const [{ children }, { activeTab }] = [this.props, this.state];
        return (
            <React.Fragment>
                <div className="tab-buttons">
                    {children && children.map((child, idx) => <Tab switchTab={this.switchTab} index={idx} activeTab={activeTab} label={child.props.label} /> )}
                </div>
                <div className="tab-content">
                    { children && children[activeTab].props.children }
                </div>
            </React.Fragment>
        );
    }
}

class Tab extends Component {
    handleClick = () => {
        const { index, switchTab } = this.props;
        switchTab(index);
    }

    render() {
        const { label, activeTab, index } = this.props;
        return (
            <div onClick={this.handleClick} className={`tab-button${activeTab === index ? " active" : ""}`}>{label}</div>
        );
    }
}

export default Tabs;