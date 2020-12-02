import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { Panel, PanelContainer, PanelSwitch } from "../tabs";
import { Form, Input, Checkbox } from "../form";
import Auth from "../../utils/auth";

const Login = ({ history }) => {
    const handleLoginSubmit = async (formData) => {
        const res = await Auth.login(formData);
        if (res.success) {
            toast.success("Login successful");
            setTimeout(() => history.push("/"));
        } else { toast.error(res.message); }
    };

    const handleRegisterSubmit = async (formData) => {
        const res = await Auth.register(formData);
        if (res.success) {
            toast.success("Registration successful");
            setTimeout(() => history.push("/"));
        } else { toast.error(res.message); }
    };

    useEffect(() => {
        document.title = "Login - OneMark";

        const fetchData = async () => {
            const res = await Auth.login();
            res.success ? history.push("/") : console.log(res.message);
        };
        fetchData();
    }, [history]);

    return (
        <main className="common login lg-bg">
            <div className="login-wrapper">
                <PanelContainer id="login-panel">
                    <Panel className="login-panel pad-ctn-2">
                        <h1>LOGIN</h1>
                        <p className="lg-text">Not a member? <PanelSwitch parent="login-panel" panelIndex={1}>Register now</PanelSwitch></p>
                        <Form classes="login-form" onSubmit={handleLoginSubmit} submitText="Sign In">
                            <Input id="login-username" type="text" name="username" placeholder="Username" autoComplete="username" hasErrorCheck isRequired />
                            <Input id="login-password" type="password" name="password" placeholder="Password" autoComplete="current-password" hasErrorCheck isRequired />
                            <Checkbox id="login-remember-me" text="Keep me logged in" inputName="hasRememberMe" initValue={false} />
                        </Form>
                    </Panel>
                    <Panel className="login-panel pad-ctn-2">
                        <h1>REGISTER</h1>
                        <p className="lg-text">Have an account? <PanelSwitch parent="login-panel" panelIndex={0}>Sign in now</PanelSwitch></p>
                        <Form classes="login-form" onSubmit={handleRegisterSubmit} submitText="Register">
                            <Input id="register-email" type="email" name="email" placeholder="Email" hasErrorCheck isRequired />
                            <Input id="register-username" type="text" name="username" placeholder="Username" hasErrorCheck isRequired />
                            <Input id="register-password" type="password" name="password" placeholder="Password" autocomplete="new-password" hasErrorCheck isRequired />
                            <Input id="register-password-confirm" type="password" name="passwordConf" autocomplete="new-password" placeholder="Confirm Password" hasErrorCheck isRequired />
                            <Checkbox id="register-remember-me" text="Keep me logged in" inputName="hasRememberMe" initValue={false} />
                        </Form>
                    </Panel>
                </PanelContainer>
            </div>
        </main>
    );
};

export default Login;