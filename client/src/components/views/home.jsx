import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";
import { Banner } from "../popovers";
import { Link } from "../articles";
import { NavBar } from "../navbar";
import { Bookmarks } from "../bookmarks";
import { MultiSelectBar } from "../multiSelect";

const Home = () => {
    const dispatch = useDispatch();

    const isBannerOpen = useSelector(state => state.modals.find(modal => modal.id === "extension-prompt")?.isOpen ?? false);

    const disableExtBanner = () => localStorage.setItem("hideExtBanner", true);

    const hideBanner = () => {
        disableExtBanner();
        dispatch(actions.modalClosed("extension-prompt"));
    };

    useEffect(() => {
        document.title = "Home - OneMark";
        dispatch(actions.getAccount());
        if (!localStorage.getItem("hideExtBanner")) dispatch(actions.modalOpened("extension-prompt"));
    }, [dispatch]);

    return (
        <div className="common home dark">
            <NavBar />
            <Bookmarks />
            <MultiSelectBar />
            {isBannerOpen && (
                <Banner id="extension-prompt" handleClose={disableExtBanner}>
                    <p>Install the <Link href="https://chrome.google.com/webstore/detail/onemark/cjklnajnighcegajggjfmjecfidllinm" onClick={hideBanner} isNewTab>add-on extension for Chrome</Link> for the optimal experience!</p>
                </Banner>
            )}
        </div>
    );
};

export default Home;