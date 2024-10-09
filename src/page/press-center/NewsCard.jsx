import {Button, Card, Col, Flex, Row, Space, Typography} from "antd";
import {FaRegEye} from "react-icons/fa";
import dayjs from "dayjs";
import React from "react";
import {calculateEstimatedReadingTime} from "../../helper/read.helper";
import {MdOutlineMarkChatRead} from "react-icons/md";

const {Title, Text} = Typography

const text = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus atque eos eveniet ipsa ipsam itaque nisi obcaecati provident quas, tempora? Consequuntur cumque cupiditate dolorum error eum impedit, magnam optio porro quibusdam quo repellendus similique tenetur, ut, vitae voluptas! A ab asperiores blanditiis commodi culpa delectus dignissimos doloremque, dolores dolorum eligendi eum excepturi illo libero omnis porro repellat repellendus temporibus totam unde voluptatem. Error, molestiae obcaecati? Aliquam deleniti, deserunt dolorem esse eum fugiat inventore perspiciatis rerum ullam. A asperiores beatae dolor doloremque dolorum in laudantium molestias mollitia, nihil, nostrum nulla numquam officiis optio pariatur perferendis quibusdam quisquam similique sunt velit voluptate. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate ea quasi tempora voluptatem? Ad delectus earum excepturi facilis, nulla omnis quisquam quo quod totam vel. Aliquam aut corporis dignissimos hic maiores non numquam officia quis recusandae reiciendis saepe sint sit tempore tenetur ut vitae, voluptate voluptatem. Est explicabo fugiat tenetur. Accusantium delectus dignissimos ducimus facere laborum nobis, porro sapiente sit voluptatem voluptates. Distinctio fuga harum ipsa magni mollitia, repellendus velit. Blanditiis dolor eligendi enim facilis fuga fugiat nisi odio porro, quis suscipit? Beatae ex labore modi placeat possimus recusandae sit. A consectetur eius eligendi, impedit odit optio repudiandae! Blanditiis dolorem porro rem sint! Aliquid assumenda atque autem cumque cupiditate dolorum illum ipsa iste maiores, minus modi natus necessitatibus numquam odit pariatur quod sint! Adipisci animi assumenda atque consectetur consequuntur culpa cupiditate deserunt, doloremque doloribus ducimus ex, expedita ipsa laboriosam laudantium nam necessitatibus nobis non officiis porro quam quo rerum sed, tempore temporibus velit veniam vitae! A accusantium, adipisci commodi consequatur delectus dolores expedita inventore ipsam itaque iusto laudantium libero minima non nulla odio omnis quaerat quas, quasi repellat, reprehenderit sapiente similique unde veritatis. Accusamus aut exercitationem, fugit inventore itaque, labore laudantium libero nulla odio quae recusandae repellat soluta suscipit, vitae.'


const NewsCard = () => {


    return (
        <Card size={"small"} className={'news-card'}>

            <img src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" alt="ssss"/>
            <Space size={10} direction={"vertical"}>
                <Text style={{fontSize: '12px'}}>
                    {dayjs(new Date()).format('DD.MM.YYYY')}
                </Text>
                <Title level={5} style={{marginBottom: 0}}>
                    lorem ipsum
                </Title>
                <Text className={'description'}>
                    {text}
                </Text>
                <Row gutter={10}>
                    <Col span={12}>
                        <Flex style={{height:'100%'}} justify={'space-between'} align={"end"}>
                            <Flex align={"center"} gap={5}>

                                <MdOutlineMarkChatRead/>
                                <Text style={{fontSize: '12px'}}>
                                    {calculateEstimatedReadingTime(text)}
                                    мин. чтение
                                </Text>
                            </Flex>

                        </Flex>
                    </Col>
                    <Col span={12}>
                        <Button type={'primary'} style={{width: '100%'}} icon={<FaRegEye/>}/>
                    </Col>
                </Row>


            </Space>
        </Card>
    );
};

export default NewsCard;
