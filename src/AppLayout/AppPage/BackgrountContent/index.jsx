import React from 'react';
import {theme} from "antd";

const BackgroundContent = ({children}) => {
    const {
        token: { colorBgContainer, borderRadiusLG,contentBg },
    } = theme.useToken();
    return (
        <div
            style={{
                padding:40,
                minHeight: 360,
                background: contentBg,
                borderRadius: borderRadiusLG,
            }}
        >
            {children}
        </div>
    );
};

export default BackgroundContent;