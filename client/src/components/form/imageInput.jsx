import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import * as Media from "../../media";

class ImageInput extends Component {
    constructor(props) {
        super(props);
        const { initValue } = this.props;
        this.state = {
            imageName: initValue ? initValue.substring(initValue.lastIndexOf("/") + 1) : "",
            hasImage: initValue !== Media.NoImage,
        };
        this.input = React.createRef();
    }

    componentDidMount = () => {
        const { id, initValue, createInput } = this.props;
        createInput(id, initValue);
    }

    componentWillUnmount = () => {
        const { id, deleteInput } = this.props;
        deleteInput(id);
    }

    handleFileChange = (event) => {
        const { id, updateInput } = this.props;
        const fileInput = event.target;
        const isFileAdded = fileInput.files.length > 0;

        this.setState({ imageName: fileInput.value.split("\\").pop(), hasImage: isFileAdded });
        if (isFileAdded) {
            const reader = new FileReader();
            reader.onload = e => updateInput(id, e.target.result, false);
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            updateInput(id, null, false);
        }
    }

    handleImageRemoval = (event) => {
        if (this.state.hasImage) {
            event.preventDefault();
            const { id, updateInput } = this.props;
            updateInput(id, null, true);
            this.input.current.value = "";
            this.setState({ imageName: "", hasImage: false });
        }
    }

    render() {
        const { imageName, hasImage } = this.state;
        const { inputName, isImageRemoved } = this.props;
        return (
            <div className="row mgn-btm">
                <label onClick={this.handleImageRemoval} className={`file-input-group${hasImage ? " del" : ""}`}>
                    <span className={`file-input-name${hasImage ? "" : " hidden"}`} title={imageName}>{imageName}</span>
                    <span className="file-input-btn"></span>
                    <input ref={this.input} onChange={this.handleFileChange} type="file" name={inputName} className="file-input" accept="image/png, image/jpeg" />
                </label>
                <input type="hidden" value={isImageRemoved} name="isImageRemoved" />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    value: Object(state.inputs.find(input => input.id === ownProps.id)).value,
    isImageRemoved: Object(state.inputs.find(input => input.id === ownProps.id)).isImageRemoved ?? false,
});

const mapDispatchToProps = dispatch => ({
    createInput: (id, value) => dispatch(actions.imageInputCreated(id, value)),
    updateInput: (id, value, isImageRemoved) => dispatch(actions.imageInputUpdated(id, value, isImageRemoved)),
    deleteInput: (id) => dispatch(actions.inputDeleted(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageInput);