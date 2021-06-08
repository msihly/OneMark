import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions";
import { toast } from "react-toastify";
import { Form, Input } from "components/form";
import { Tab, Tabs } from "components/tabs";
import { formatDate } from "utils";

const Account = () => {
    const dispatch = useDispatch();

    const { username, email, dateCreated, accessLevel } = useSelector(state => state.account) ?? {};

    const handleAccountSubmit = async (formData) => {
        const success = await dispatch(actions.profileUpdated(formData));
        success ? toast.success("Account updated") : toast.error("Error updating account");
    };

    const handlePasswordSubmit = async (formData) => {
        const res = await (await fetch("/api/user/password", { method: "PUT", body: formData })).json();
        res.success ? toast.success("Password updated") : toast.error(res.message);
    };

    return (
        <Tabs tabClasses="pad-ctn-1 full-width">
            <Tab label="ACCOUNT">
                <Form idPrefix="account" onSubmit={handleAccountSubmit} submitText="Save" classes="center" labelClasses="small glow">
                    <Input id="username" name="username" label="Username" initValue={username} type="text" hasErrorCheck isRequired />
                    <Input id="email" name="email" label="Email" initValue={email} type="email" hasErrorCheck isRequired />
                    <Input id="date-created" label="Date Created" initValue={formatDate(dateCreated)} type="text" isDisabled />
                    <Input id="type" label="Account Type" initValue={accessLevel === 1 ? "Administrator" : "Customer"} isDisabled />
                </Form>
            </Tab>

            <Tab label="PASSWORD">
                <Form idPrefix="account-password" onSubmit={handlePasswordSubmit} submitText="Save" classes="center" labelClasses="small glow">
                    <Input id="current" name="currentPassword" label="Current Password"
                        type="password" autoComplete="current-password" hasErrorCheck isRequired />
                    <Input id="new" name="newPassword" label="New Password"
                        type="password" autoComplete="new-password" hasErrorCheck isRequired />
                    <Input id="confirm" name="passwordConf" label="Confirm Password"
                        type="password" autoComplete="new-password" hasErrorCheck isRequired />
                </Form>
            </Tab>
        </Tabs>
    );
};

export default Account;