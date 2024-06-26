import React from 'react';
import {Form, Input} from "antd";

const FormInput = ({label,name,required,required_text,warning}) => {
    return (
        <Form.Item
            label={warning ? <div>
                <p>{label}</p>
                <br/>
                <p>{warning}</p>
            </div>:<div>{label}</div>}
            name={name}

            rules={[{
                required: required, message: required_text
            }]}
        >
            <Input />
        </Form.Item>
    );
};

export default FormInput;
