import {Button, Col, Input, Row, Typography, Space, Spin} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import CompanyTable from "./CompanyTable";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";
import {FilterCompanyForAdmin} from "../../components";

const {Title} = Typography


const Company = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {companyID} = useSelector(state => state.companySlice)
    const {mutate,isSuccess,isLoading:deleteLoading}=useDeleteQuery()
    const {data,isLoading:getCompanyLoading,refetch}=useGetQuery(false,'tag-company-get',`/users/tags/${companyID}`,false)
    const [search, setSearch] = useState([]);

    const [isSearch, setIsSearch] = useState(false);
    useEffect(() => {
        refetch()
    }, [isSuccess]);

    // delete
    const deleteHandle = (url, id) => {
        mutate({url, id});
    };

    // add
    const addArticle = () => {
        dispatch(editIdQuery(""));
        navigate('/company/add');
    };
    const searchFunc = (value) => {
        if (value === '') {
            setIsSearch(false);
        } else {
            setIsSearch(true);
        }

        const filterData = data?.filter(
            (data) => data.title.toLowerCase().includes(value.toLowerCase()));
            setSearch(filterData);
    };

    return (
        <div className={'site-space-compact-wrapper'}>

            <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
                <Row gutter={20}>
                    <Col span={18}>
                        <Title level={2}>
                            Компания
                        </Title>
                    </Col>
                    <FilterCompanyForAdmin/>

                    <Col span={16}>
                        <Input placeholder="Поиск компании" onChange={(e) => searchFunc(e.target.value)}/>
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
                    spinning={getCompanyLoading || deleteLoading}>
                    <CompanyTable
                        data={isSearch ? search : data}
                        deleteHandle={deleteHandle}
                    />
                </Spin>
            </Space>
        </div>
    );
};

export default Company;

