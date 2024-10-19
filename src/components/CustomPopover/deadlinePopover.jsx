import React from 'react';
import {ConfigProvider} from "antd";

const DeadlinePopover = ({children,bg}) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    // Seed Token
                    colorBgElevated:bg
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
};

export default DeadlinePopover;