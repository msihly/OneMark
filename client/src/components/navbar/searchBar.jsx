import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions";
import { toast } from "react-toastify";
import { DropMenu, DropSelect, makeSelectOption } from "components/dropdowns";
import { Checkbox } from "components/form";
import { compareLogic, regexEscape } from "utils";
import * as Media from "media";

const SEARCH_TYPE_OPTIONS = ["Anything", "URL", "Title", "Tag"].map(e => makeSelectOption(e));

const SEARCH_CONTAINS_OPTIONS = ["contains", "does not contain"].map(e => makeSelectOption(e));

const typeSwitch = (type) => ({ "Anything": "", "URL": "url:", "Title": "title:", "Tag": "tag:" })[type];

const SearchBar = ({ hasAdvanced }) => {
    const dispatch = useDispatch();

    const bookmarks = useSelector(state => state.bookmarks);

    const [hasAnd, setHasAnd] = useState(true);
    const [hasExact, setHasExact] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [advSearchValue, setAdvSearchValue] = useState("");
    const [typeValue, setTypeValue] = useState(SEARCH_TYPE_OPTIONS[0].form);
    const [containsValue, setContainsValue] = useState(SEARCH_CONTAINS_OPTIONS[0].form);

    const addTerm = () => {
        const term = `${containsValue === "does not contain" ? "-" : ""}${typeSwitch(typeValue)}${advSearchValue}`;
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
                    RegExp(`^${arr.filter(e => e !== "").length > 0 ? arr : (hasAnd ? "\\S*" : "$")}`, "i"));
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
            toast.error("Search Error: Check console for details");
        }
    }, [dispatch, hasAnd, hasExact, searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div onClick={event => event.stopPropagation()} className="search-group">
            <input className="searchbar placeholder" placeholder="Search..."
                onChange={event => setSearchValue(event.target.value)} value={searchValue} type="text" />

            {hasAdvanced && (<>
                <DropMenu id="adv-search" toggleBody={<Media.ChevronSVG />} toggleClasses="adv-search-btn" contentClasses="adv-search-content" retainOnClick>
                    <h4>Advanced Search</h4>

                    <div className="adv-search-group">
                        <DropSelect id="adv-search-type" handleSelect={({ value }) => setTypeValue(value)} src={SEARCH_TYPE_OPTIONS} parent="adv-search" hasFormGroup={false} hasNone={false} />

                        <DropSelect id="adv-search-contains" handleSelect={({ value }) => setContainsValue(value)} src={SEARCH_CONTAINS_OPTIONS} parent="adv-search" hasFormGroup={false} hasNone={false} />

                        <input className="adv-search-input" onChange={event => setAdvSearchValue(event.target.value)} value={advSearchValue} type="text" />
                        <span className="add-btn" onClick={addTerm}>
                            <Media.PlusSVG />
                        </span>
                    </div>

                    <div className="row mobile multi-checkboxes">
                        <Checkbox id="adv-search-and" text="Match all terms" handleClick={isChecked => setHasAnd(isChecked)} initValue={true} />
                        <Checkbox id="adv-search-exact" text="Match exact term" handleClick={isChecked => setHasExact(isChecked)} initValue={false} />
                    </div>
                </DropMenu>
            </>)}
        </div>
    );
};

export default SearchBar;