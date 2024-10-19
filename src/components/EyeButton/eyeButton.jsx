import React from 'react';
import {ConfigProvider} from "antd";

const EyeButton = ({children}) => {
    return <ConfigProvider
        theme={{
            token: {
                // Seed Token
                colorPrimary: '#fff',
                borderRadius: 2,
                colorPrimaryHover:'rgb(13,202,240,50)',
                // Alias Token
                colorBgContainer: 'rgb(13,202,240)',
            },
        }}
    >
        {children}
    </ConfigProvider>
};

export default EyeButton;