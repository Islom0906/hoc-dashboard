import {Card, Image, Space, Typography} from "antd";
import React from "react";
const cardStyle = {border: 1, borderStyle: "dashed", borderColor: "black"}
const { Text} = Typography
const FileCard = ({files,comment}) => {
    return (
        <Card bordered={true} style={cardStyle} size={"small"}>
            <Space size={5} direction={"vertical"}>
                <Space size={10}>
                    {
                        files?.map(file=>(
                            <Image
                                key={file?.id}
                                width={50}
                                src={file?.file}/>
                        ))
                    }
                </Space>


                <Text>{comment}</Text>
            </Space>

        </Card>
    )
}

export default FileCard