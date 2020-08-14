import React, { Component } from 'react';

class Form extends Component {
    handleSubmit = (event) => {
        event.preventDefault();
        const [{ handleSubmit }, formData] = [this.props, new FormData(event.target)];
        handleSubmit(formData);
    }

    render() {
        const { children, submitText, submitClasses } = this.props;
        return (
            <form onSubmit={this.handleSubmit} enctype="multipart/form-data">
                {children}
                <button className={`${submitClasses ?? "btn-hollow"}`} type="submit">{submitText}</button>
            </form>
        );
    }
}

export default Form;