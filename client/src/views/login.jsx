import React, { Component } from "react";
import Panels from "../components/tabs/panels";
import PanelButton from "../components/tabs/panelButton";
import Form from "../components/form/form";
import Input from "../components/form/input";
import Checkbox from "../components/form/checkbox";
import Auth from "../utils/auth";
import { toast } from "react-toastify";

class Login extends Component {
    componentDidMount = async () => {
        document.title = "Login - OneMark";
        let res = await Auth.login();
        res.success ? this.props.history.push("/") : console.log(res.message);
    }

    handleLoginSubmit = async (formData) => {
        let res = await Auth.login(formData);
        if (res.success) {
            toast.success("Login successful");
            setTimeout(() => this.props.history.push("/"));
        } else { toast.error(res.message); }
    }

    handleRegisterSubmit = async (formData) => {
        let res = await Auth.register(formData);
        if (res.success) {
            toast.success("Registration successful");
            setTimeout(() => this.props.history.push("/"));
        } else { toast.error(res.message); }
    }

    render() {
        return (
            <main className="common login light">
                <div className="lg-background"></div>
                <div className="lg-wrapper">
                    <div className="lg">
                        <div className="lg-panel-image"></div>
                        <Panels id="login-panel">
                            <div className="lg-panel-form pad-ctn-3">
                                <h3>Log In</h3>
                                <p className="lg-text">Not a member?
                                    <PanelButton parent="login-panel" target={1}>
                                        <span className="text-btn"> Register now</span>
                                    </PanelButton>
                                </p>
                                <Form handleSubmit={this.handleLoginSubmit} submitText="LOG IN">
                                    <Input id="login-username" type="text" name="username" label="Username" placeholder="Username" isTransparent hasErrorCheck isRequired />
                                    <Input id="login-password" type="password" name="password" label="Password" placeholder="Password" isTransparent hasErrorCheck isRequired />
                                    <Checkbox id="login-remember-me" text="Keep me logged in" inputName="hasRememberMe" initValue={false} />
                                </Form>
                            </div>
                            <div className="lg-panel-form pad-ctn-3">
                                <h3>Register</h3>
                                <p className="lg-text">Already have an account?
                                    <PanelButton parent="login-panel" target={0}>
                                        <span className="text-btn"> Login now</span>
                                    </PanelButton>
                                </p>
                                <Form handleSubmit={this.handleRegisterSubmit} submitText="REGISTER">
                                    <Input id="register-email" type="email" name="email" label="Email" placeholder="Email" isTransparent hasErrorCheck isRequired />
                                    <Input id="register-username" type="text" name="username" label="Username" placeholder="Username" isTransparent hasErrorCheck isRequired />
                                    <Input id="register-password" type="password" name="password" label="Password" placeholder="Password" isTransparent hasErrorCheck isRequired />
                                    <Input id="register-password-confirm" type="password" name="passwordConf" label="Confirm Password" placeholder="Confirm Password" isTransparent hasErrorCheck isRequired />
                                    <Checkbox id="register-remember-me" text="Keep me logged in" inputName="hasRememberMe" initValue={false} />
                                </Form>
                            </div>
                        </Panels>
                    </div>
                </div>
            </main>
        );
    }
}

export default Login;