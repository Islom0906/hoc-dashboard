import {Button, Col, Input, Row,Typography, Space, Spin} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import CompanyTable from "./CompanyTable";
const {Title}=Typography
const Company = () => {

    const data=[{
        "id": 1,
        "title": "Evolution Motors",
        "image": "http://95.46.96.95:82/media/images/061a2deb-f9c2-4fb4-a052-a0602e9d63ae.png"
    }]

    // delete
    const deleteHandle = (url, id) => {
        console.log(id,url)
    };
    // add
    const addArticle = () => {
        // dispatch({type: EDIT_DATA, payload: ''});
        // navigate('/house/add');
    };
    const serachFunc = (value) => {
        // if (value === '') {
        //     setIsSearch(false);
        // } else {
        //     setIsSearch(true);
        // }
        //
        // const filterData = data?.result?.filter(
        //     (data) =>
        //         data.name.toLowerCase().includes(value.toLowerCase()));
        // setSearch(filterData);
    };

    return (
        <div className={'site-space-compact-wrapper'}>
            <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>

                <Row gutter={20}>

                    <Col span={24}>
                        <Title level={2}>
                            Компания
                        </Title>
                    </Col>
                    <Col span={16}>
                        <Input onChange={(e) => serachFunc(e.target.value)}/>
                    </Col>
                    <Col span={8}>
                        <Button
                            type='primary'
                            icon={<PlusOutlined/>}
                            style={{width: '100%'}}
                            onClick={addArticle}>
                            Добавить
                        </Button>
                    </Col>

                </Row>
                <Spin
                    size='medium'
                    spinning={false}>
                    <CompanyTable
                        data={data}
                        deleteHandle={deleteHandle}
                    />
                </Spin>
            </Space>
        </div>
    );
};

export default Company;