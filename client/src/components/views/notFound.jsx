import React from "react";
import { PageNotFound } from "../../media";

const NotFound = () => (
    <div className="notFound">
        <div className="heading">404</div>
        <div className="subheading">Page Not Found</div>
        <img src={PageNotFound} alt=""/>
    </div>
);

export default NotFound;