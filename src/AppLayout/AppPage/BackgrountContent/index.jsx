import React from 'react';
import {theme} from "antd";

const BackgroundContent = ({children}) => {
    const {
        token: {  borderRadiusLG,contentBg },
    } = theme.useToken();
    return (
        <div
            style={{
                padding:20,
                minHeight: '40vh',
                background: contentBg,
                borderRadius: borderRadiusLG,
            }}
        >
            {children}
        </div>
    );
};

export default BackgroundContent;