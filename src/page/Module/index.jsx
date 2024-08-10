import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Button, Col, Input,  Row, Select, Space, Spin, Typography} from "antd";
import React, {useEffect, useMemo, useState} from "react";
import {editIdQuery} from "../../store/slice/querySlice";
import {PlusOutlined} from "@ant-design/icons";
import ModuleTable from "./ModuleTable";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";
const {Title}=Typography


const CreateWorker = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [selectCompanyID, setSelectCompanyID] = useState(null)
    // delete
    const {mutate,isSuccess,isLoading:deleteLoading}=useDeleteQuery()
    // get
    const {data,isLoading:getLoading,refetch}=useGetQuery(false,'module-get','/users/modules/',false)

    const {
        data: getCompany,
        refetch: refetchGetCompany
    } = useGetQuery(false, 'get-company', '/users/companies/', false)


    const [search, setSearch] = useState([]);
    const [isSearch, setIsSearch] = useState(false);

    useEffect(() => {
        if(selectCompanyID) {
         refetch()
        }
    }, [isSuccess , selectCompanyID]);

    useEffect(() => {
        refetchGetCompany()
    } , [])

    // delete
    const deleteHandle = (url, id) => {
        mutate({url, id});
    };
    // add
    const addArticle = () => {
        dispatch(editIdQuery(""));
        navigate('/module/add');
    };
    const searchFunc = (value) => {
        if (value === '') {
            setIsSearch(false);
        } else {
            setIsSearch(true);
        }

        const filterData = data?.filter(
            (data) => data?.name.toLowerCase().includes(value.toLowerCase()));
        setSearch(filterData);
    };
    const optionsCompany = useMemo(() => {
        return getCompany?.map((option) => {
            return {
                value: option?.id,
                label: option?.title,
            };
        });
    }, [getCompany]);

    const onChangeCompany = (id) => {
        setSelectCompanyID(id)
    }
    return (
        <div className={'site-space-compact-wrapper'}>
            <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
                <Row gutter={20}>
                    <Col span={18}>
                        <Title level={2}>
                            Отделы
                        </Title>
                    </Col>
                    <Col span={6}>
                        <Select
                            style={{
                                width: '100%',
                            }}
                            placeholder='Выберите компанию'
                            optionLabelProp='label'
                            options={optionsCompany}
                            onChange={onChangeCompany}
                        />
                    </Col>
                    <Col span={16}>
                        <Input placeholder="Поиск отделов" onChange={(e) => searchFunc(e.target.value)}/>
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
                    spinning={getLoading || deleteLoading}>
                    <ModuleTable
                        data={isSearch ? search : data}
                        deleteHandle={deleteHandle}
                    />
                </Spin>
            </Space>
        </div>
    );
};

export default CreateWorker;