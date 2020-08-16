import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions.js";
import DropMenu from "../popovers/dropMenu.jsx";
import DropSelect from "../popovers/dropSelect.jsx";
import Checkbox from "../form/checkbox.jsx";
import SearchTermInput from "../navbar/searchTermInput.jsx";

class SearchBar extends Component {
    state = {
        hasAnd: true,
        hasWhole: false,
        searchValue: "",
        typeValue: "Anything",
        containsValue: "contains",
    }

    handleClick = (event) => {
        event.stopPropagation();
    }

    handleCheckbox = (option) => {
        this.setState({[option]: !this.state[option]}, this.searchBookmarks);
    }

    handleSelect = (option, value) => {
        this.setState({[option]: value});
    }

    handleSearch = (event) => {
        this.setState({searchValue: event.target.value}, this.searchBookmarks);
    }

    addTerm = (value) => {
        const { typeValue, containsValue} = this.state;
        const typeSwitch = (type) => ({ "Anything": "", "URL": "url:", "Title": "title:", "Tag": "tag:" })[type];
        const term = `${containsValue === "does not contain" ? "-" : ""}${typeSwitch(typeValue)}${value}`;
        this.setState({searchValue: `${this.state.searchValue} ${term}`}, this.searchBookmarks);
    }

    searchBookmarks = () => {
        const [{ bookmarks, displayBookmarks }, { searchValue, hasAnd, hasWhole }] = [this.props, this.state];
        let filteredBookmarks = null;

        if (searchValue.length > 0) {
            const terms = searchValue.trim(),
                regexes = [/(?<!-title:)(?<=title:)\S*/gi, /(?<!-url:)(?<=url:)\S*/gi, /(?<!-tag:)(?<=tag:)\S*/gi, /(?<=^|\s)(?!-|(title|tag|url):)\S*\S/gi,
                    /(?<=-title:)\S*/gi, /(?<=-url:)\S*/gi, /(?<=-tag:)\S*/gi, /(?<=-(?!(title|url|tag):))\S*/gi],
                wholeDelim = hasWhole ? "\\b" : "",
                prefix = `${hasAnd ? "(?=.*" : ".*"}${wholeDelim}`,
                suffix = `${wholeDelim}${hasAnd ? ")" : ""}.*`,
                [titles, urls, tags, any, negTitles, negUrls, negTags, negAny] = regexes.map(re => [terms.match(re) || []].map(
                    arr => arr.length > 0 ? `${prefix}${arr.join(`${wholeDelim}${hasAnd ? ")(?=.*" : "|"}`)}${suffix}` : "")),
                hasPositives = [titles, urls, tags, any].some(e => e.length > 0),
                hasNegatives = [negTitles, negUrls, negTags, negAny].some(e => e.length > 0),
                [reTitle, reURL, reTag, reAny, reNegTitle, reNegURL, reNegTag, reNegAny] = [titles, urls, tags, any, negTitles, negUrls, negTags, negAny].map(arr => RegExp(`^${arr}$`, "i"));

            filteredBookmarks = bookmarks.filter(bk => {
                let [title, pageUrl, tags] = [bk.title, bk.pageUrl, bk.tags.length > 0 ? bk.tags : [null]];
                return ( !reNegTitle.test(title) && !reNegURL.test(pageUrl) && !tags.some(tag => reNegTag.test(tag)) && ![title, pageUrl, tags].flat().some(term => reNegAny.test(term)) )
                        && ( reTitle.test(title) || reURL.test(pageUrl) || tags.some(tag => reTag.test(tag)) || [title, pageUrl, tags].flat().some(term => reAny.test(term)) || (!hasPositives && hasNegatives));
            });
        }

        displayBookmarks(filteredBookmarks);
    }

    render() {
        const [{ hasAdvanced }, { searchValue, typeValue, containsValue }] = [this.props, this.state];
        return (
            <div onClick={this.handleClick} className="search-group">
                <input onChange={this.handleSearch} value={searchValue} className="searchbar placeholder" type="text" placeholder="Search..." />
                { hasAdvanced ? (
                    <React.Fragment>
                        <DropMenu id="adv-search" toggleClasses="adv-search-btn nav-btn down-arrow" contentClasses="adv-search-content" retainOnClick>
                            <h4>Advanced Search</h4>
                            <div className="row row-mgn-1 mobile">
                                <div className="row row-mgn-1 mgn-btm">
                                    <DropSelect id="adv-search-type" handleSelect={this.handleSelect} option="typeValue" initValue={typeValue} parent="adv-search">
                                        <div>Anything</div>
                                        <div>URL</div>
                                        <div>Title</div>
                                        <div>Tag</div>
                                    </DropSelect>
                                    <DropSelect id="adv-search-contains" handleSelect={this.handleSelect} option="containsValue" initValue={containsValue} parent="adv-search">
                                        <div>contains</div>
                                        <div>does not contain</div>
                                    </DropSelect>
                                </div>
                                <SearchTermInput handleSubmit={this.addTerm} />
                            </div>
                            <div className="row mobile multi-checkboxes">
                                <Checkbox id="adv-search-and" handleClick={this.handleCheckbox} option="hasAnd" text="Match all terms" initValue={true} />
                                <Checkbox id="adv-search-whole" handleClick={this.handleCheckbox} option="hasWhole" text="Match whole term" initValue={false} />
                            </div>
                        </DropMenu>
                    </React.Fragment>
                ) : null }
            </div>
        );
    }
}

const mapStateToProps = state => ({
	bookmarks: state.bookmarks
});

const mapDispatchToProps = dispatch => ({
    displayBookmarks: (bookmarks) => dispatch(actions.bookmarksFiltered(bookmarks)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);