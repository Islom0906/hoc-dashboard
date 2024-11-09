import {Card, Flex, Image, Space, Typography} from "antd";
import React from "react";
import {AvatarUserProfile} from "../index";

const {Text} = Typography
const FileCard = ({files, comment, date, user}) => {
    return (
        <Card  size={"small"}>
            <Space size={5} direction={"vertical"} style={{width: '100%'}}>
                <Space size={8}>
                    {
                        files?.length !== 0 &&
                        files?.map(file => (
                            // const isImage = file?.file?.match(/\.(jpeg|jpg|png|gif)$/i); // Check for image extensions
                            // return !isImage ?
                            //     (
                                    <a key={file?.id} href={file?.file} download={'download'} rel="noopener noreferrer">
                                        {file?.file}
                                    </a>
                                // )
                            //     (
                            //     <Image key={file?.id} width={50} src={file?.file}/>
                            // )
                        ))
                    }
                </Space>
                <Text>{comment}</Text>


                <Flex justify={"space-between"} align={"end"} style={{flexShrink: 0,}}>

                    <Text style={{flexShrink: 0, fontSize: '11px'}}
                          type="secondary">{date}</Text>
                    {
                        user &&
                        <div style={{width: 30, height: 30}}>
                            <AvatarUserProfile keyId={user?.created_user?.id} full_name={user?.created_user?.full_name}
                                               moduls={user?.created_user?.roles[0]?.position}
                                               image={user?.created_user?.images.image}/>
                        </div>
                    }
                </Flex>


            </Space>
        </Card>
    )
}

export default FileCard