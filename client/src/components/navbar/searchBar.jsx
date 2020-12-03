import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";
import { DropMenu, DropSelect } from "../popovers";
import { Checkbox } from "../form";
import { SearchTermInput } from "../navbar";
import { toast } from "react-toastify";
import { compareLogic, regexEscape } from "../../utils";

const SearchBar = ({ hasAdvanced }) => {
    const dispatch = useDispatch();

    const bookmarks = useSelector(state => state.bookmarks);

    const [hasAnd, setHasAnd] = useState(true);
    const [hasExact, setHasExact] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [typeValue, setTypeValue] = useState("Anything");
    const [containsValue, setContainsValue] = useState("contains");

    const addTerm = (value) => {
        const typeSwitch = (type) => ({ "Anything": "", "URL": "url:", "Title": "title:", "Tag": "tag:" })[type];
        const term = `${containsValue === "does not contain" ? "-" : ""}${typeSwitch(typeValue)}${value}`;
        setSearchValue(`${searchValue} ${term}`);
    };

    useEffect(() => {
        try {
            let filteredBookmarks = null;

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

            dispatch(actions.bookmarksFiltered(filteredBookmarks));
        } catch (e) {
            console.log(e);
            toast.error("Error searching. Please try again");
        }
    }, [dispatch, hasAnd, hasExact, searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div onClick={event => event.stopPropagation()} className="search-group">
            <input className="searchbar placeholder" placeholder="Search..."
                onChange={event => setSearchValue(event.target.value)} value={searchValue} type="text" />
            {hasAdvanced && (
                <Fragment>
                    <DropMenu id="adv-search" toggleClasses="adv-search-btn nav-btn down-arrow" contentClasses="adv-search-content" retainOnClick>
                        <h4>Advanced Search</h4>
                        <div className="row mg-1 mobile">
                            <div className="row mg-1 mgn-btm">
                                <DropSelect id="adv-search-type" handleSelect={setTypeValue} initValue={typeValue} parent="adv-search">
                                    <div>Anything</div>
                                    <div>URL</div>
                                    <div>Title</div>
                                    <div>Tag</div>
                                </DropSelect>
                                <DropSelect id="adv-search-contains" handleSelect={setContainsValue} initValue={containsValue} parent="adv-search">
                                    <div>contains</div>
                                    <div>does not contain</div>
                                </DropSelect>
                            </div>
                            <SearchTermInput handleSubmit={addTerm} />
                        </div>
                        <div className="row mobile multi-checkboxes">
                            <Checkbox id="adv-search-and" text="Match all terms" handleClick={isChecked => setHasAnd(isChecked)} initValue={true} />
                            <Checkbox id="adv-search-exact" text="Match exact term" handleClick={isChecked => setHasExact(isChecked)} initValue={false} />
                        </div>
                    </DropMenu>
                </Fragment>
            )}
        </div>
    );
}

export default SearchBar;