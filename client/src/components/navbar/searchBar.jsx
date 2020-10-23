import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import { DropMenu, DropSelect } from "../popovers";
import { Checkbox } from "../form";
import { SearchTermInput } from "../navbar";
import { toast } from "react-toastify";
import { compareLogic, regexEscape } from "../../utils";

class SearchBar extends Component {
    state = {
        hasAnd: true,
        hasExact: false,
        searchValue: "",
        typeValue: "Anything",
        containsValue: "contains",
    }

    handleClick = (event) => event.stopPropagation();

    handleCheckbox = (option) => this.setState({[option]: !this.state[option]}, this.searchBookmarks);

    handleSelect = (option, value) => this.setState({[option]: value});

    handleSearch = (event) => this.setState({searchValue: event.target.value}, this.searchBookmarks);

    addTerm = (value) => {
        const { typeValue, containsValue} = this.state;
        const typeSwitch = (type) => ({ "Anything": "", "URL": "url:", "Title": "title:", "Tag": "tag:" })[type];
        const term = `${containsValue === "does not contain" ? "-" : ""}${typeSwitch(typeValue)}${value}`;
        this.setState({searchValue: `${this.state.searchValue} ${term}`}, this.searchBookmarks);
    }

    searchBookmarks = () => {
        const [{ bookmarks, displayBookmarks }, { searchValue, hasAnd, hasExact }] = [this.props, this.state];
        let filteredBookmarks = null;

        try {
            if (searchValue.length > 0) {
                const terms = searchValue.trim();
                const regexes = [
                    /(?<!-title:)(?<=title:)\S*/gi,
                    /(?<!-url:)(?<=url:)\S*/gi,
                    /(?<!-tag:)(?<=tag:)\S*/gi,
                    /(?<=^|\s)(?!-|(title|tag|url):)\S*\S/gi,
                    /(?<=-title:)\S*/gi,
                    /(?<=-url:)\S*/gi,
                    /(?<=-tag:)\S*/gi,
                    /(?<=(^|\s)-(?!(title|url|tag):))\S*/gi
                ];
                const exactDelim = hasExact ? "\\b" : "";
                const prefix = `${hasAnd ? "(?=.*" : ".*"}${exactDelim}`;
                const suffix = `${exactDelim}${hasAnd ? ")" : ""}.*`;
                const [titles, urls, tags, any, negTitles, negUrls, negTags, negAny] = regexes.map(re => [terms.match(re) || []].map(
                        arr => arr.length > 0 ? `${prefix}${arr.map(e => regexEscape(e)).join(`${exactDelim}${hasAnd ? ")(?=.*" : "|"}`)}${suffix}` : ""));

                const hasPositives = [titles, urls, tags, any].flat().some(e => e.length > 0);
                const hasNegatives = [negTitles, negUrls, negTags, negAny].flat().some(e => e.length > 0);

                const [reTitle, reURL, reTag, reAny] = [titles, urls, tags, any].map(arr =>
                    RegExp(`^${arr.filter(e => e !== "").length > 0 ? arr : (hasAnd ? "\\S*" : "")}${hasAnd ? "" : "$"}`, "i"));
                const [reNegTitle, reNegURL, reNegTag, reNegAny] =[negTitles, negUrls, negTags, negAny].map(arr =>
                    RegExp(`^${arr.filter(e => e !== "").length > 0 ? arr : ""}$`, "i"));

                filteredBookmarks = bookmarks.filter(bk => {
                    const [title, pageUrl, tags] = [bk.title, bk.pageUrl, bk.tags.length > 0 ? bk.tags : [null]];
                    const any = [title, pageUrl, tags].flat();
                    return !( reNegTitle.test(title) || reNegURL.test(pageUrl) || tags.some(tag => reNegTag.test(tag)) || any.some(term => reNegAny.test(term)) )
                            && ( compareLogic(hasAnd ? "and" : "or", reTitle.test(title), reURL.test(pageUrl), tags.some(tag => reTag.test(tag)), any.some(term => reAny.test(term)))
                            || ( !hasPositives && hasNegatives ));
                });
            }

            displayBookmarks(filteredBookmarks);
        } catch (e) {
            console.log(e);
            toast.error("Error searching. Please try again");
        }
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
                            <div className="row mg-1 mobile">
                                <div className="row mg-1 mgn-btm">
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
                                <Checkbox id="adv-search-exact" handleClick={this.handleCheckbox} option="hasExact" text="Match exact term" initValue={false} />
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