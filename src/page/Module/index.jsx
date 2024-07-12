import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "react-query";
import apiService from "../../service/apis/api";
import {Button, Col, Input, message, Row, Space, Spin,Typography} from "antd";
import {useEffect, useState} from "react";
import {editIdQuery} from "../../store/slice/querySlice";
import {PlusOutlined} from "@ant-design/icons";
import ModuleTable from "./ModuleTable";
const {Title}=Typography


const CreateWorker = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // delete
    const {
        mutate,
        isSuccess,
        isLoading: deleteLoading,
    } = useMutation(({url, id}) => apiService.deleteData(url, id),{
        onSuccess:()=>{
            message.success('Успешно')
        }
    });

    // get
    const {
        data,
        isLoading: getLoading,
        refetch,
    } = useQuery('module-get', () => apiService.getData(`/users/modules/`), {
        enabled: false,
        onError: (error) => {
            message.error(error.message);
            // Handle the error
        },
    });

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
    return (
        <div className={'site-space-compact-wrapper'}>
            <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
                <Row gutter={20}>
                    <Col span={24}>
                        <Title level={2}>
                            Отделы
                        </Title>
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