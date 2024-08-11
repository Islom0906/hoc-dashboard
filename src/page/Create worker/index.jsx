import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Button, Col, Input, Row,  Space, Spin, Typography} from "antd";
import React, {useEffect,  useState} from "react";
import {editIdQuery} from "../../store/slice/querySlice";
import {PlusOutlined} from "@ant-design/icons";
import CreateWorkerTable from "./CreateWorkerTable";
import {  useDeleteQuery, useGetQuery} from "../../service/query/Queries";
import {FilterCompanyForAdmin} from "../../components";
const {Title}=Typography


const CreateWorker = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {mutate,isSuccess,isLoading:deleteLoading}=useDeleteQuery()
    const {companyID} = useSelector(state => state.companySlice)
    const {data,isLoading:getLoading,refetch}=useGetQuery(false,'create-worker-get',`/users/users?company__id=${companyID}`)
    const [search, setSearch] = useState([]);
    const [isSearch, setIsSearch] = useState(false);

    useEffect(() => {
        if(companyID) {
        refetch()
        }
    }, [isSuccess , companyID]);

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



    return (
        <div className={'site-space-compact-wrapper'}>
            <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
                <Row gutter={20}>
                    <Col span={18}>
                        <Title level={2}>
                             Cотрудника
                        </Title>
                    </Col>
                    <FilterCompanyForAdmin/>
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