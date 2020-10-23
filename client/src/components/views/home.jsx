import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import { NavBar } from "../navbar";
import { Bookmarks } from "../bookmarks";
import { MultiSelectBar } from "../multiSelect";
import { Banner } from "../popovers";

class Home extends Component {
    componentDidMount() {
        const { getAccount, openBanner } = this.props;
        document.title = "Home - OneMark";
        getAccount();
        if (!localStorage.getItem("hideExtBanner")) { openBanner("extension-prompt"); }
    }

    hideBanner = () => {
        const { closeBanner } = this.props;
        this.disableExtBanner();
        closeBanner("extension-prompt");
    }

    disableExtBanner = () => localStorage.setItem("hideExtBanner", true);

    render() {
        const { isBannerOpen } = this.props;
        return (
            <div className="common home dark">
                <NavBar />
                <Bookmarks />
                <MultiSelectBar />
                { isBannerOpen ? (
                    <Banner id="extension-prompt" handleClose={this.disableExtBanner}>
                        <p>Install the <a href="https://chrome.google.com/webstore/detail/onemark/cjklnajnighcegajggjfmjecfidllinm"
                            onClick={this.hideBanner} target="_blank" rel="noopener noreferrer"> add-on extension for Chrome</a> for the optimal experience!</p>
                    </Banner>
                ) : null }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isBannerOpen: Object(state.modals.find(modal => modal.id === "extension-prompt")).isOpen ?? false,
});

const mapDispatchToProps = dispatch => ({
    closeBanner: id => dispatch(actions.modalClosed(id)),
    getAccount: () => dispatch(actions.getAccount()),
    openBanner: id => dispatch(actions.modalOpened(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);