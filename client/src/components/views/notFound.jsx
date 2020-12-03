import React, { useEffect } from "react";
import * as Media from "../../media";

const NotFound = () => {
    useEffect(() => {document.title = "Page Not Found - OneMark"}, []);

    return (
        <div className="notFound">
            <div className="heading">404</div>
            <div className="subheading">Page Not Found</div>
            <img src={Media.PageNotFound} alt=""/>
        </div>
    );
};

export default NotFound;