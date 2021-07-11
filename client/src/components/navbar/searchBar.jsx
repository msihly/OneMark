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

    const createRegExes = (prefixes = [], positives, negatives) => {
        const exactDelim = hasExact ? "\\b" : "";
        const prefix = `${hasAnd ? "(?=.*" : ".*"}${exactDelim}`;
        const suffix = `${exactDelim}${hasAnd ? ")" : ""}.*`;
        const andOrDelim = `${exactDelim}${hasAnd ? ")(?=.*" : "|"}`;

        const typeMaps = [{ prefixMap: positives, reMap: new Map() }, { prefixMap: negatives, reMap: new Map() }];

        typeMaps.forEach(({ prefixMap, reMap }) => {
            const anyTerms = prefixMap.get("anything");
            reMap.set("anything", anyTerms.length > 0 ? new RegExp(`(${anyTerms.join("|")})`, "i") : false);

            prefixes.forEach(key => {
                const preTerms = prefixMap.get(key);
                const reString = preTerms.length > 0 ? `${prefix}${preTerms.map(e => regexEscape(e)).join(andOrDelim)}${suffix}` : "";
                reMap.set(key, reString.length > 0 ? new RegExp(reString, "i") : false);
            });
        });

        return { rePos: typeMaps[0].reMap, reNeg: typeMaps[1].reMap };
    };

    const findPrefixes = (searchString, prefixes = []) => {
        if (!prefixes?.length) return false;

        const positives = new Map([["anything", searchString.match(new RegExp(`(?<=^|\\s)(?!-|(${prefixes.join("|")}):)\\S*\\S`, "gi")) || []]]);
        const negatives = new Map([["anything", searchString.match(new RegExp(`(?<=(^|\\s)-(?!(${prefixes.join("|")}):))\\S*`, "gi")) || []]]);

        prefixes.forEach(prefix => {
            const rePos = new RegExp(`(?<!-${prefix}:)(?<=${prefix}:)\\S*`, "gi");
            positives.set(prefix, searchString.match(rePos) || []);

            const reNeg = new RegExp(`(?<=-${prefix}:)\\S*`, "gi");
            negatives.set(prefix, searchString.match(reNeg) || []);
        });

        return { positives, negatives };
    };

    useEffect(() => {
        const filterBookmarks = (searchString, prefixes = []) => {
            const { positives, negatives } = findPrefixes(searchString, prefixes);

            const { rePos, reNeg } = createRegExes(prefixes, positives, negatives);

            const [hasPositives, hasNegatives] = [positives, negatives].map(prefixMap => [...prefixMap.values()].flat().some(e => e.length > 0));

            return bookmarks.filter(b => {
                const [title, pageUrl, tags] = [b.title, b.pageUrl, b.tags.length > 0 ? b.tags : [null]];
                const any = [title, pageUrl, tags].flat();

                const isPosAnyValid = rePos.get("anything") ? any.some(a => rePos.get("anything").test(a)) : true;
                const isPosTitleValid = rePos.get("title") ? rePos.get("title").test(title) : true;
                const isPosUrlValid = rePos.get("url") ? rePos.get("url").test(pageUrl) : true;
                const isPosTagsValid = rePos.get("tag") ? tags.some(t => rePos.get("tag").test(t)) : true;

                const isNegAnyValid = reNeg.get("anything") ? !any.some(a => reNeg.get("anything").test(a)) : true;
                const isNegTitleValid = reNeg.get("title") ? !reNeg.get("title").test(title) : true;
                const isNegUrlValid = reNeg.get("url") ? !reNeg.get("url").test(pageUrl) : true;
                const isNegTagsValid = reNeg.get("tag") ? !tags.some(t => reNeg.get("tag").test(t)) : true;

                const isPosValid = compareLogic(hasAnd ? "and" : "or", isPosTitleValid, isPosUrlValid, isPosTagsValid, isPosAnyValid);
                const isNegValid = compareLogic(hasAnd ? "and" : "or", isNegTitleValid, isNegUrlValid, isNegTagsValid, isNegAnyValid);

                if (b.bookmarkId === 5552 || b.bookmarkId === 5452)
                    console.log({
                        b,
                        isPosAnyValid,
                        isPosTitleValid,
                        isPosUrlValid,
                        isPosTagsValid,
                        isNegAnyValid,
                        isNegTitleValid,
                        isNegUrlValid,
                        isNegTagsValid,
                        reNegTag: reNeg.get("tag"),
                        isPosValid,
                        isNegValid
                    });

                return (isNegValid && isPosValid) || (!hasPositives && hasNegatives);
            });
        };

        try {
            const filteredBookmarks = searchValue?.length > 0 ? filterBookmarks(searchValue, ["title", "url", "tag"]) : null;
            dispatch(actions.bookmarksFiltered(filteredBookmarks));
        } catch (e) {
            console.log(e);
            toast.error("Search Error: Check console for details");
        }
    }, [dispatch, hasAnd, hasExact, searchValue]); // eslint-disable-line

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