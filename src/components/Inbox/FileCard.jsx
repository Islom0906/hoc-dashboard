import {Card, Image, Space, Typography} from "antd";
import React from "react";
const cardStyle = {border: 1, borderStyle: "dashed", borderColor: "black"}
const { Text} = Typography
const FileCard = ({files,comment}) => {
    return (
        <Card bordered={true} style={cardStyle} size={"small"}>
            <Space size={5} direction={"vertical"}>
                <Image.PreviewGroup
                    preview={{
                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                    }}
                >
                    {
                        files?.map(file=>(
                            <Image
                                key={file?.id}
                                width={30}
                                src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"/>
                        ))
                    }


                </Image.PreviewGroup>
                <Text>{comment}</Text>
            </Space>

        </Card>
    )
}

export default FileCard