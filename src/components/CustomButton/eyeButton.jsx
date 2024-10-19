import React from 'react';
import {ConfigProvider} from "antd";

const EyeButton = ({children}) => {
    return <ConfigProvider
        theme={{
            token: {
                colorPrimary: "#0dcaf0",  // Primary color
                colorPrimaryHover: "#0bb7dd",  // Hover color
            },
        }}
    >
        {children}
    </ConfigProvider>
};

export default EyeButton;