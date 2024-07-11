import React, {useEffect, useMemo} from 'react';
import {Button, Col, DatePicker, Form, message, Modal, Row, Select, TimePicker, Typography} from "antd";
import {FormInput, FormTextArea} from "../../components";
import {useMutation, useQuery} from "react-query";
import apiService from "../../service/apis/api";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
const {Title}=Typography
const initialValueForm={
    title: "",
    text: "",
    meeting_date: "",
    users: []
}

const ModalCalendar = ({isModalOpen, setIsModalOpen,title,value}) => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)

    // get-responsibleUser
    const {
        data: requiredUser,
        refetch: refetchRequiredUser,
    } = useQuery('get-requiredUser', () => apiService.getData(`users/user-filter-by-company`), {
        enabled: false,
        onError: (error) => {
            message.error(error.message);
        },
    });
    // post meeting
    const {
        mutate: postMeetingMutate,
        isLoading: postMeetingLoading,
        isSuccess: postMeetingSuccess,
    } = useMutation(({url, data}) => apiService.postData(url, data), {
        onSuccess: () => {
            message.success('Успешно')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });
    // put meeting
    const {
        mutate: putMeeting,
        isLoading: putMeetingLoading,
        isSuccess: putMeetingSuccess
    } = useMutation(({
                         url,
                         data,
                         id
                     }) => apiService.editData(url, data, id), {
        onSuccess: () => {
            message.success('Успешно')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });
    // get-by id
    const {
        isLoading: editTaskLoading,
        data: editTaskData,
        refetch: editTaskRefetch,
        isSuccess: editTaskSuccess,
    } = useQuery(["edit-meeting", editId], () => apiService.getDataByID("/users/tasks", editId), {
        enabled: false
    });

    useEffect(() => {
        refetchRequiredUser()
    }, []);


    const onFinish = (formValue) => {


        const data = {
            title: formValue.title,
            text: formValue.text,
            meeting_date: dayjs(formValue?.deadline).utc().tz().format(),
            users:formValue?.users
        }
        console.log(value)
        console.log(data)
        // if (editTaskData) {
        //     putMeeting({url: '/users/tasks', data: data, id: editId})
        // } else {
        //     postMeetingMutate({url: "/users/tasks/", data: data});
        // }
    }


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // option Company
    const optionsResponsibleUser = useMemo(() => {
        const requiredUserData=[{
            value: null,
            label: `Все сотрудники`,
        }]
         requiredUser?.results?.map((option) => {
             requiredUserData.push({
                 value: option?.id,
                 label: `${option?.full_name}(${option?.position})`,
             })
        });
        return requiredUserData
    }, [requiredUser]);
    return (
        <Modal
            title={title}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
        >

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
                    <Col span={24}>
                        <Title level={2}>
                            создайте :
                        </Title>
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется название компания'}
                            label={'Название компания'}
                            name={'title'}
                        />
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Выберите крайний срок"
                            name={'meeting_date'}
                            rules={[{
                                required: true, message: 'Укажите день  крайний срок.'
                            }]}
                        >
                            <TimePicker
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <FormTextArea
                            required={true}
                            required_text={'текст к заданию'}
                            label={'текст к заданию'}
                            name={'text'}
                        />
                    </Col>



                    <Col span={24}>
                        <Form.Item
                            label={'Ответственный человек'}
                            name={'users'}
                            rules={[{
                                required: true, message: 'Выберите человек'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                mode={'multiple'}
                                placeholder='Выберите человек'
                                optionLabelProp='label'
                                options={optionsResponsibleUser}
                                // onChange={onChangeCompany}
                            />
                        </Form.Item>
                    </Col>


                </Row>
                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editTaskSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>
        </Modal>
    );
};

export default ModalCalendar;