import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions";
import { Loading } from "components/views/_common";
import { Alert, AlertButton, Banner, CircleButton, FloatingMenu } from "components/popovers";
import { Link } from "components/articles";
import { NavBar } from "components/navbar";
import { Bookmarks } from "components/bookmarks";
import { Tagger } from "components/tags";
import * as Media from "media";

export const SortContext = createContext();

const Home = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const bookmarks = useSelector(state => state.bookmarks.filter(b => b.isSelected === true)) ?? [];
    const modals = useSelector(state => state.modals);
    const [isConfirmationOpen, isTaggerOpen, isBannerOpen] = ["confirm-delete", "tagger", "extension-prompt"]
        .map(id => modals.find(m => m.id === id)?.isOpen ?? false);

    const [isLoading, setIsLoading] = useState(false);
    const [sortKey, setSortKey] = useState(localStorage.getItem("sortKey"));
    const [sortDir, setSortDir] = useState(localStorage.getItem("sortDir"));

    const deleteBookmarks = () => {
        const formData = new FormData();
        formData.append("bookmarkIds", JSON.stringify(bookmarks.map(b => b.bookmarkId)));
        dispatch(actions.bookmarksDeleted(formData));
    };

    const disableExtBanner = () => localStorage.setItem("hideExtBanner", true);

    const hideBanner = () => {
        disableExtBanner();
        dispatch(actions.modalClosed("extension-prompt"));
    };

    useEffect(() => {
        document.title = "Home - OneMark";

        const fetchAllData = async () => {
            const res = await dispatch(actions.getBookmarks(history));
            if (!res?.success) return history.push("/login");

            dispatch(actions.getAccount(history));

            setIsLoading(false);
        };

        fetchAllData();

        if (!localStorage.getItem("hideExtBanner")) dispatch(actions.modalOpened("extension-prompt"));

        if (!localStorage.getItem("sortKey")) {
            localStorage.setItem("sortKey", "dateModified");
            setSortKey("dateModified");
        }

        if (!localStorage.getItem("sortDir")) {
            localStorage.setItem("sortDir", "desc");
            setSortDir("desc");
        }

        return () => dispatch(actions.stateReset());
    }, [dispatch, history]);

    return isLoading ? <Loading /> : (
        <div className="common home dark">
            <SortContext.Provider value={{ sortKey, setSortKey, sortDir, setSortDir }} >
                <NavBar />
                <Bookmarks />
            </SortContext.Provider>

            {bookmarks?.length > 0 && (
                <FloatingMenu position="bottom left right" isHorizontal hasBackground>
                    <CircleButton title="Edit Tags" onClick={() => dispatch(actions.modalOpened("tagger"))}>
                        <Media.TagSVG />
                        {isTaggerOpen && <Tagger {...{ bookmarks }} />}
                    </CircleButton>

                    <CircleButton title="Delete Bookmarks" classes="red" onClick={() => dispatch(actions.modalOpened("confirm-delete"))}>
                        <Media.TrashcanSVG />
                        {isConfirmationOpen && (
                            <Alert id="confirm-delete" modalClasses="pad-ctn-2 border-red" iconClasses="red-1-svg" icon={Media.TrashcanSVG}
                                heading={["Delete ", <span className="red-2">{bookmarks.length}</span>, ` bookmark${bookmarks.length > 1 ? "s" : ""}`]}
                                subheading="This process cannot be undone.">
                                <AlertButton text="Delete" classes="red" onClick={deleteBookmarks} />
                            </Alert>
                        )}
                    </CircleButton>

                    <CircleButton title="Unselect Bookmarks" classes="grey" onClick={() => dispatch(actions.unselectAllBookmarks())}>
                        <Media.PlusSVG className="rotate-45" />
                    </CircleButton>
                </FloatingMenu>
            )}

            {isBannerOpen && (
                <Banner id="extension-prompt" handleClose={disableExtBanner}>
                    <p>Install the <Link href="https://chrome.google.com/webstore/detail/onemark/cjklnajnighcegajggjfmjecfidllinm" onClick={hideBanner} isNewTab>
                        add-on extension for Chrome</Link> for the optimal experience!</p>
                </Banner>
            )}
        </div>
    );
};

export default Home;