import React from 'react';
import {Form, Input} from "antd";

const FormInput = ({label,name,required,required_text,warning,disabled=false}) => {
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
            <Input disabled={disabled}/>
        </Form.Item>
    );
};

export default FormInput;
