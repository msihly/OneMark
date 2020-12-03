import React, { useState } from "react";

const SearchTermInput = ({ handleSubmit }) => {
    const [searchValue, setSearchValue] = useState("");

    return (
        <div className="row mg-1 flex-child grow mgn-btm">
            <input className="adv-search-input" onChange={event => setSearchValue(event.target.value)} value={searchValue} type="text" />
            <span className="add-btn" onClick={() => handleSubmit(searchValue)} />
        </div>
    );
};

export default SearchTermInput;