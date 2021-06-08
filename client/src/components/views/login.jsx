import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as actions from "store/actions";
import { toast } from "react-toastify";
import { Loading } from "components/views/_common";
import { Panel, PanelContainer, PanelSwitch } from "components/tabs";
import { Form, Input, Checkbox } from "components/form";
import { login } from "utils/auth";

const Login = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);

    const handleLoginSubmit = async (formData) => {
        const res = await dispatch(actions.login(formData, history));
        if (res?.success) {
            toast.success("Welcome back");
            history.push("/");
        }
    };

    const handleRegisterSubmit = async (formData) => {
        const res = await dispatch(actions.register(formData, history));
        if (res?.success) {
            toast.success("Welcome to OneMark");
            history.push("/");
        }
    };

    useEffect(() => {
        document.title = "Login - OneMark";

        const authenticate = async (token) => {
            if (token) {
                const isAuthed = await login({ accessToken: token });
                if (isAuthed) return history.push("/");
            }

            setIsLoading(false);
        };

        const accessToken = localStorage.getItem("accessToken");

        authenticate(accessToken);
    }, []); //eslint-disable-line

    return isLoading ? <Loading /> : (
        <main className="common login lg-bg">
            <div className="login-wrapper pad-ctn-2">
                <PanelContainer id="login-panel">
                    <Panel className="login-panel">
                        <h1>LOGIN</h1>
                        <p className="lg-text">Not a member? <PanelSwitch parent="login-panel" panelIndex={1}>Register now</PanelSwitch></p>

                        <Form idPrefix="login" classes="login-form center" onSubmit={handleLoginSubmit} submitText="Sign In">
                            <Input id="username" type="text" name="username" placeholder="Username"
                                autoComplete="username" isRequired />
                            <Input id="password" type="password" name="password" placeholder="Password"
                                autoComplete="current-password" isRequired />
                            <Checkbox id="remember-me" text="Keep me logged in" inputName="hasRememberMe" initValue={false} />
                        </Form>
                    </Panel>

                    <Panel className="login-panel">
                        <h1>REGISTER</h1>
                        <p className="lg-text">Have an account? <PanelSwitch parent="login-panel" panelIndex={0}>Sign in now</PanelSwitch></p>

                        <Form idPrefix="register" classes="login-form center" onSubmit={handleRegisterSubmit} submitText="Register">
                            <Input id="email" type="email" name="email" placeholder="Email"
                                hasErrorCheck isRequired />
                            <Input id="username" type="text" name="username" placeholder="Username"
                                hasErrorCheck isRequired />
                            <Input id="password" type="password" name="password" placeholder="Password"
                                autocomplete="new-password" hasErrorCheck isRequired />
                            <Input id="password-confirm" type="password" name="passwordConf" placeholder="Confirm Password"
                                autocomplete="new-password" hasErrorCheck isRequired />
                            <Checkbox id="remember-me" text="Keep me logged in" inputName="hasRememberMe" initValue={false} />
                        </Form>
                    </Panel>
                </PanelContainer>
            </div>
        </main>
    );
};

export default Login;