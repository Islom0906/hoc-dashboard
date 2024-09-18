import React, {useEffect, useMemo, useState} from 'react';
import {Button, Card, Col, DatePicker, Flex, Form, Row, Select, Typography} from "antd";
import {AppLoader, FormInput, FormTextArea} from "../../components";
import {useSelector} from "react-redux";
import { useQueryClient} from "react-query";
import dayjs from "dayjs";
import {MinusCircleOutlined} from "@ant-design/icons";
import successCreateAndEdit from "../../hooks/successCreateAndEdit";
import editGetById from "../../hooks/editGetById";
import setInitialValue from "../../hooks/setInitialValue";
import TaskInnerCard from "../../components/TaskInnerCard/TaskInnerCard";
import {useEditQuery, useGetByIdQuery, useGetQuery, usePostQuery} from "../../service/query/Queries";
const {Title , Text} = Typography

const initialValueForm = {
    sub_tasks: [
        {
            title: "",
            text: "",
            deadline: '',
            staff: null,
        }
    ]
}


const TaskEdit = () => {
    const queryClient = useQueryClient()
    const [form] = Form.useForm();
    const {data:{user}}=useSelector(state => state.auth)
    const [subTaskStaffs, setSubTaskStaffs] = useState([])
    const {editId} = useSelector(state => state.query)

    // get-user
    const { data: getUserByModules,
        refetch: refetchGetUserByModules} = useGetQuery(false , 'get-user' ,`/users/user-filter?module_id=${user?.modules[0].id}` , false)

    const {
       isLoading: loadingGetAddSubTask,
            data: dataGetAddSubTask,
            refetch: refetchGetAddSubTask,
            isSuccess: successGetAddSubTask
    } = useGetByIdQuery(false, "edit-add-subTask", editId, '/users/boss-tasks-retrieve')

    const {
        mutate: postAddSubTaskBossMutate,
        isLoading: postAddSubTaskBossLoading,
        isSuccess: postAddSubTaskBossSuccess,
    } = usePostQuery()
    const {
        mutate: putAddSubTaskBoss,
        isLoading: putAddSubTaskBossLoading,
        isSuccess: putAddSubTaskBossSuccess
    } = useEditQuery()

    useEffect(() => {
        return () => {
            queryClient.removeQueries()
        }
    }, [])
    successCreateAndEdit(postAddSubTaskBossSuccess, putAddSubTaskBossSuccess, '/taskEditBoss')
    editGetById(refetchGetAddSubTask)
    setInitialValue(form, initialValueForm)
    useEffect(() => {
        const comeToEdit =[]
        dataGetAddSubTask?.sub_tasks?.map(subTask => {
            comeToEdit.push({
                title:subTask?.title,
                text: subTask?.text,
                deadline: dayjs(subTask?.deadline),
                staff: subTask?.staff
            })
        })
        const editData = {
                sub_tasks: comeToEdit
        }
        if (successGetAddSubTask) {
        form.setFieldsValue(editData)
        }
    }, [dataGetAddSubTask])


    const onFinish = (value) => {
        const data = []
        if(dataGetAddSubTask?.moduls){
            value?.sub_tasks?.map(item => {
                data.push({
                    title: item.title,
                    text: item.text,
                    deadline: dayjs(item.deadline).format('YYYY-MM-DDTHH:mm:ss.SSS'),
                    staff:  item.staff,
                    task: dataGetAddSubTask?.main_task_id,
                })
            })
        }else{
            value?.sub_tasks.map(item => {
                data.push({
                    title: item.title,
                    text: item.text,
                    deadline: dayjs(item.deadline),
                    staff:  item.staff,
                    task: null,
                })
            })
        }


        if (dataGetAddSubTask) {
            putAddSubTaskBoss({url: '/users/boss-created-task-update', data: {data}, id: editId})
        } else {
        postAddSubTaskBossMutate({url: "/users/boss-task-create", data: data});
        }
        form.setFieldsValue(initialValueForm)
    }

    const optionsUserByModules = useMemo(() => {
        return getUserByModules?.results?.map((option) => {
            return {
                value: option?.id,
                label: `${option?.full_name}(${option?.position})`,
            };
        });
    }, [getUserByModules]);


    // refresh page again get data
    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            const data = {
                ...storedValues,
                deadline: dayjs(storedValues?.deadline)
            }
            form.setFieldsValue(data);
        }
        const handleBeforeUnload = (event) => {
            event.preventDefault()
            localStorage.setItem(
                'myFormValues',
                JSON.stringify(form.getFieldsValue()),
            );
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            localStorage.removeItem('editDataId')
            localStorage.removeItem('myFormValues')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);



    useEffect(() => {
        if(editId){
        refetchGetAddSubTask()
        }
    } , [editId])


    useEffect(() => {
        if (user?.modules[0].name) {
            refetchGetUserByModules()
        }
    }, [user]);


    return (<div>
        {(postAddSubTaskBossLoading || loadingGetAddSubTask || putAddSubTaskBossLoading ) ?
            <AppLoader/> :
            <Form
                form={form}
                name="basic"
                labelCol={{
                    span: 24
                }}
                wrapperCol={{
                    span: 24
                }}
                style={{
                    maxWidth: "100%"
                }}
                initialValues={initialValueForm}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={20}>
                    <Col span={ editId ? 16 : 24}>
                        <Flex justify={"space-between"} align={"start"} style={{marginBottom:'20px'}}>
                            <Flex vertical={true} gap={1}>
                                <Title level={2}>
                                    {dataGetAddSubTask?.main_task_title
                                    }
                                </Title>
                                <Text>
                                    {dataGetAddSubTask?.main_task_text}
                                </Text>
                            </Flex>
                            <Text>
                                {dataGetAddSubTask?.deadline}
                            </Text>
                        </Flex>



                        <Card bordered={true} style={{border: 1, borderStyle: "dashed", borderColor: "white"}}>
                            <Flex align={'center'} vertical={true} justify={"center"} style={{height: "100%"}}>
                                <CreatSubTask
                                    editId={editId}
                                    optionsUserByModules={successGetAddSubTask && subTaskStaffs?.length > 0 ? subTaskStaffs : optionsUserByModules}
                                />
                            </Flex>
                        </Card>
                        <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                            {successGetAddSubTask ? 'Изменить' : 'Создать'}
                        </Button>
                    </Col>
                    {
                        editId &&
                    <Col span={8}>
                        <TaskInnerCard created_by={dataGetAddSubTask?.created_by}  main_task_deadline={dataGetAddSubTask?.deadline} main_task_created_at={dataGetAddSubTask?.main_task_created_at} main_task_responsible_user={dataGetAddSubTask?.responsible_user}

                        />
                    </Col>
                    }
                </Row>

            </Form>}
    </div>);
};




const CreatSubTask = ({optionsUserByModules, editId, }) => {
    return (
        <Form.List name="sub_tasks">
            {(fields, {add, remove}) => (
                <>
                    {fields.map((field, index) => {
                        return (
                            <div key={field.fieldKey} style={{marginBottom: 10}}>
                                <Row gutter={[20, 10]}>
                                    <Col span={20}>
                                        <Title level={3}>
                                            {editId ? 'Свяжите работу, назначенную администратором, с сотрудником': 'Предоставление работы сотруднику'}
                                        </Title>
                                    </Col>
                                    {
                                        editId &&
                                    <Col span={2}>
                                        <Button type={"dashed"} danger onClick={() => remove(field.name)}>
                                            <MinusCircleOutlined
                                            />
                                        </Button>
                                    </Col>
                                    }
                                    <Col span={12}>
                                        <Form.Item
                                            label="Выберите крайний срок"
                                            name={[field.name, 'deadline']}
                                            rules={[{
                                                required: true, message: 'Укажите день  крайний срок.'
                                            }]}
                                        >
                                            <DatePicker/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={'Выберите сотрудник'}
                                            name={[field.name, 'staff']}
                                            wrapperCol={{
                                                span: 24,
                                            }}
                                        >
                                            <Select
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder='Выберите сотрудник'
                                                optionLabelProp='label'
                                                options={optionsUserByModules && optionsUserByModules[0]?.length > 0 ? optionsUserByModules[index] : optionsUserByModules}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                        >
                                            <FormInput
                                                label={'Название задания'}
                                                name={[field.name, 'title']}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <FormTextArea
                                            label={'Добавить комментарий'}
                                            name={[field.name, 'text']}
                                        />
                                    </Col>
                                </Row>
                            </div>

                        );
                    })}
                    {
                        editId &&
                        <Form.Item>
                            <Button type="primary" onClick={() => add()} block
                                    style={{backgroundColor: '#28a745'}}>
                                Создать подзадачу
                            </Button>
                        </Form.Item>
                    }


                </>
            )}
        </Form.List>
    )
}

export default TaskEdit;
