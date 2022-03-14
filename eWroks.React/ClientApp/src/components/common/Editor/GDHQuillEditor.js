import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import '../../../custom.css'

import Parser from 'html-react-parser';

const GDHQuillEditor = (props) => {
    useEffect(() => {
        // 브라우저 API를 이용하여 문서 타이틀을 업데이트합니다.
        setText(props.value || '');
    }, [props.value]);

    const [text, setText] = useState(props.value || '');

    const modules = {
        toolbar: [
          //[{ 'font': [] }],
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          [{ 'align': [] }, { 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          ['clean']
        ],
      }
    
    const formats = [
        //'font',
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
        'align', 'color', 'background',        
      ]

    return (<>
        <ReactQuill 
            value={text}
            className="height_100"
            onChange={value => {
                setText(value);
                props.onChange(props.name, value);
            }}
            // modules={module}
            modules={modules} 
            formats={formats} 
        />
    </>)
}

export default GDHQuillEditor;