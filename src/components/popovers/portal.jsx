import { Component } from 'react';
import ReactDOM from "react-dom";

const portalRoot = document.getElementById("portal-root");

class Portal extends Component {
    render() {
        const { children } = this.props;
        return ReactDOM.createPortal(children, portalRoot);
    }
}

export default Portal;