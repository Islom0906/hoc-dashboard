import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Button, Col, Input, Row, Select, Space, Spin, Typography} from "antd";
import React, {useEffect, useMemo, useState} from "react";
import {editIdQuery} from "../../store/slice/querySlice";
import {PlusOutlined} from "@ant-design/icons";
import CreateWorkerTable from "./CreateWorkerTable";
import {  useDeleteQuery, useGetQuery} from "../../service/query/Queries";
import {useQueryClient} from "react-query";
const {Title}=Typography


const CreateWorker = () => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
    const [selectCompanyID, setSelectCompanyID] = useState(null)
    const navigate = useNavigate()
    const {mutate,isSuccess,isLoading:deleteLoading}=useDeleteQuery()
    const {data,isLoading:getLoading,refetch}=useGetQuery(false,'create-worker-get',`/users/users?company__id=${selectCompanyID}`)
    const [search, setSearch] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const {
        data: getCompany,
        refetch: refetchGetCompany
    } = useGetQuery(false, 'get-company', '/users/companies/', false)

    useEffect(() => {
        if(selectCompanyID) {
        refetch()
        }
    }, [isSuccess , selectCompanyID]);


    useEffect(() => {
        refetchGetCompany()
        return () => {
            queryClient.removeQueries()
        }
    }, [])

    // delete
    const deleteHandle = (url, id) => {
        mutate({url, id});
    };
    // add
    const addArticle = () => {
        dispatch(editIdQuery(""));
        navigate('/create-worker/add');
    };
    const searchFunc = (value) => {
        if (value === '') {
            setIsSearch(false);
        } else {
            setIsSearch(true);
        }

        const filterData = data?.filter(
            (data) => data?.first_name.toLowerCase().includes(value.toLowerCase()));
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
                             сотрудника
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
                        <Input placeholder="Поиск сотрудников" onChange={(e) => searchFunc(e.target.value)} />
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
                    <CreateWorkerTable
                        data={isSearch ? search : data}
                        deleteHandle={deleteHandle}
                    />
                </Spin>
            </Space>
        </div>
    );
};

export default CreateWorker;