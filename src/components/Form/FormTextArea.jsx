import React from 'react';
import {Form } from "antd";
import TextArea from "antd/es/input/TextArea";

const FormTextArea = ({label,name,required,required_text}) => {
    return (
        <Form.Item
            label={label}
            name={name}

            rules={[{
                required: required, message: required_text
            }]}
        >
            <TextArea rows={4}/>
        </Form.Item>
    );
};

export default FormTextArea;

