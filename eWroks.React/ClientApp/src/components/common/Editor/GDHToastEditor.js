import React, { Component } from 'react';
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import 'tui-color-picker/dist/tui-color-picker.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { Editor } from "@toast-ui/react-editor";

class GDHToastEditor extends Component {
    static getDerivedStateFromProps(props, state) {
        if (state.content !== props.value) {
            return { content: props.value }
        }
        return null;
    }
    editorRef = React.createRef();
    constructor() {
        super();
        this.state = {
            content: '',
        };
    }
    handleClick = () => {
        this.setState({
            content: this.editorRef.current.getInstance().getHtml(),
        });
        console.log(this.state.content)
    };
    render() {
        return (
            <>
                <Editor
                    previewStyle="vertical"
                    height="300px"
                    initialEditType="wysiwyg"
                    ref={this.editorRef}
                    plugins={[colorSyntax]}
     
                />
                <button onClick={this.handleClick}>저장</button>
            </>
        );
    }
};

export default GDHToastEditor;