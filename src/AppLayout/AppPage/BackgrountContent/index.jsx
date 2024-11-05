import React from 'react';
import {theme} from "antd";
import './background-content.scss'
const BackgroundContent = ({children}) => {
    const {
        token: {  borderRadiusLG,contentBg },
    } = theme.useToken();
    return (
        <div
            className={'bg-content'}
            style={{

                background: contentBg,
                borderRadius: borderRadiusLG,
            }}
        >
            {children}
        </div>
    );
};

export default BackgroundContent;