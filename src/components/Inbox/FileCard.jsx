import {Card, Image, Space, Typography} from "antd";
import React from "react";
import dayjs from "dayjs";
import {AvatarUserProfile} from "../index";
const cardStyle = {border: 1, borderStyle: "dashed", borderColor: "black"}
const { Text} = Typography
const FileCard = ({files,comment , date , user}) => {
    return (
        <Card bordered={true} style={cardStyle} size={"small"}>
            <Space size={5} direction={"vertical"}>
                <Space size={10}>
                    {
                      files.length !== 0 &&
                        files?.map(file=>(
                            <Image
                                key={file?.id}
                                width={50}
                                src={file?.file}/>
                        ))
                    }
                </Space>
                <Text>{comment}</Text>
              {
                date &&
                <Text style={{fontSize:11}} type={"secondary"}>{date}</Text>
              }
              {
                user &&
                <div style={{flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10}}>
                  <Text style={{flexShrink: 0, fontSize: '11px'}}
                        type="secondary">{dayjs(user.created_at).format("DD.MM.YYYY hh:mm")}</Text>
                  <div style={{width: 40, height: 40}}>
                    <AvatarUserProfile key={user?.created_user?.id} full_name={user?.created_user?.full_name}
                                       moduls={user?.created_user?.position}
                                       image={user?.created_user?.images.image}/>

                  </div>
                </div>
              }
            </Space>
        </Card>
    )
}

export default FileCard