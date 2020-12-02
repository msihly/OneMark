import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";
import { toast } from "react-toastify";
import { Form, Input } from "../form";
import { Tab, Tabs } from "../tabs";
import { formatDate } from "../../utils";
import Auth from "../../utils/auth";

const Account = () => {
    const dispatch = useDispatch();

    const username = useSelector(state => state.account.username);
    const email = useSelector(state => state.account.email);
    const dateCreated = useSelector(state => state.account.dateCreated);
    const accountType = useSelector(state => state.account.accountType);

    const handleAccountSubmit = async (formData) => {
        const success = await dispatch(actions.accountUpdated(formData));
        success ? toast.success("Account updated") : toast.error("Error updating account");
    };

    const handlePasswordSubmit = async (formData) => {
        const res = await (await fetch("/api/user/password", { method: "PUT", body: formData })).json();

        if (res.success) toast.success("Password updated");
        else {
            toast.error(res.message);
            Auth.setStatus(false);
        }
    };

    return (
        <Tabs tabClasses="pad-ctn-1 full-width">
            <Tab label="Account Info">
                <Form submitText="Save" classes="center" onSubmit={handleAccountSubmit}>
                    <Input id="account-username" name="username" label="Username" initValue={username}
                        type="text" hasErrorCheck isRequired />
                    <Input id="account-email" name="email" label="Email" initValue={email}
                        type="email" hasErrorCheck isRequired />
                    <Input id="account-date-created" label="Date Created" title={formatDate(dateCreated, "datetime")} initValue={formatDate(dateCreated)}
                        type="text" isDisabled />
                    <Input id="account-type" type="text" label="Account Type" initValue={accountType}
                        isDisabled />
                </Form>
            </Tab>
            <Tab label="Password">
                <Form submitText="Save" classes="center" onSubmit={handlePasswordSubmit}>
                    <Input id="account-password-current" name="currentPassword" label="Current Password"
                        type="password" autoComplete="current-password" hasErrorCheck isRequired />
                    <Input id="account-password-new" name="newPassword" label="New Password"
                        type="password" autoComplete="new-password" hasErrorCheck isRequired />
                    <Input id="account-password-confirm" name="passwordConf" label="Confirm Password"
                        type="password" autoComplete="new-password" hasErrorCheck isRequired />
                </Form>
            </Tab>
        </Tabs>
    );
};

export default Account;