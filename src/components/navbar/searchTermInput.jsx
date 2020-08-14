import React, { Component } from 'react';

class SearchTermInput extends Component {
    state = {
        searchValue: "",
    }

    handleAdd = () => {
        const [{ handleSubmit }, { searchValue }] = [this.props, this.state];
        handleSubmit(searchValue);
    }

    handleInput = (event) => {
        this.setState({searchValue: event.target.value});
    }

    render() {
        const { searchValue } = this.state;
        return (
            <div className="row row-mgn-1 flex-child grow mgn-btm">
                <input onChange={this.handleInput} value={searchValue} className="adv-search-input" type="text" />
                <span onClick={this.handleAdd} className="add-btn"></span>
            </div>
        );
    }
}

export default SearchTermInput;