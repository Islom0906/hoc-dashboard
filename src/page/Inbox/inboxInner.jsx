import React from 'react';
import {Card, Col, Row, theme} from "antd";

const InboxInner = () => {
    const {
        token: {borderRadiusLG, contentBg},
    } = theme.useToken();
    return (
        <>
            <Row gutter={20}>

                <Col span={18}

                >
                    <Card size={"small"}>

                    </Card>
                </Col>
                <Col span={6}

                >
                    <Card size={"small"}>

                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default InboxInner;