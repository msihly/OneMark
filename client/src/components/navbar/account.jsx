import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions.js";
import Form from "../form/form.jsx";
import Tabs from "../tabs/tabs.jsx";
import Input from "../form/input.jsx";
import Auth from "../../utils/auth.js";
import { formatDate } from "../../utils";
import { toast } from "react-toastify";

class Account extends Component {
    handleAccountSubmit = async (formData) => {
        let success = await this.props.updateAccount(formData);
        success ? toast.success("Account updated") : toast.error("Error updating account");
    }

    handlePasswordSubmit = async (formData) => {
        try {
            let res = await (await fetch("/api/user/password", { method: "PUT", body: formData })).json();
            if (!res.success) { Auth.setStatus(false); throw new Error(res.message); };
            toast.success("Password updated");
        } catch (e) { toast.error(e.message); }
    }

    render() {
        const { username, email, dateCreated, accountType } = this.props;
        return (
            <Tabs>
                <label label="Account Info">
                    <Form handleSubmit={this.handleAccountSubmit} submitText="Save Changes">
                        <div class="row mobile">
                            <Input id="account-username" type="text" name="username" label="Username" initValue={username} hasErrorCheck isRequired />
                            <Input id="account-email" type="email" name="email" label="Email" initValue={email} hasErrorCheck isRequired />
                        </div>
                        <div class="row mobile">
                            <Input id="account-date-created" type="text" label="Date Created" title={formatDate(dateCreated, "datetime")}
                                initValue={formatDate(dateCreated)} isDisabled />
                            <Input id="account-type" type="text" label="Account Type" initValue={accountType} isDisabled />
                        </div>
                    </Form>
                </label>
                <label label="Password">
                    <Form handleSubmit={this.handlePasswordSubmit} submitText="Change Password">
                        <Input id="account-password-current" type="password" name="currentPassword" classes="med-width" label="Current Password" hasErrorCheck isRequired />
                        <Input id="account-password-new" type="password" name="newPassword" classes="med-width" label="New Password" hasErrorCheck isRequired />
                        <Input id="account-password-confirm" type="password" name="passwordConf" classes="med-width" label="Confirm Password" hasErrorCheck isRequired />
                    </Form>
                </label>
            </Tabs>
        );
    }
}

const mapStateToProps = (state) => ({
    username: state.account.username,
    email: state.account.email,
    dateCreated: state.account.dateCreated,
    accountType: state.account.accountType,
});

const mapDispatchToProps = dispatch => ({
    updateAccount: (username, email) => dispatch(actions.updateAccount(username, email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);