import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, message, Modal, Row, Select, Spin, TimePicker, Typography} from "antd";
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

const ModalCalendar = ({isModalOpen, setIsModalOpen, title, date,refetchMeeting}) => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [isMultipleSelect, setIsMultipleSelect] = useState('show')
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
        isLoading: editModalMeetingLoading,
        data: editModalMeetingData,
        refetch: editModalMeetingRefetch,
        isSuccess: editModalMeetingSuccess,
    } = useQuery(["edit-meeting", editId], () => apiService.getDataByID("/users/meetings", editId), {
        enabled: false
    });

    useEffect(() => {
        refetchRequiredUser()
    }, []);


    const onFinish = (value) => {
        let allUser = false
        const meetingDate = date
            .hour(value?.meeting_date.hour())
            .minute(value?.meeting_date.minute())
            .second(value?.meeting_date.second())
        value?.users.map((user) => {
            if (user === null) {
                allUser = true
            }
        })


        const data = {
            title: value.title,
            text: value.text,
            meeting_date: dayjs(meetingDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            users: isMultipleSelect==='allUser' ? [] : value?.users
        }
        if (editModalMeetingData) {
            putMeeting({url: '/users/meetings', data: data, id: editId})
        } else {
            postMeetingMutate({url: "/users/meetings/", data: data});
        }
    }

    useEffect(() => {
        if (postMeetingSuccess) {
            refetchMeeting()
            setIsModalOpen(false)
            form.setFieldsValue(initialValueForm)
        }
    }, [postMeetingSuccess]);


    const handleCancel = () => {

        setIsModalOpen(false);
    };

    // option Company
    const optionsResponsibleUser = useMemo(() => {

        const requiredUserData = []


        if (isMultipleSelect === 'show') {
            requiredUserData.push({
                value: null,
                label: `Все сотрудники`,
            })
            requiredUser?.results?.map((option) => {
                requiredUserData.push({
                    value: option?.id,
                    label: `${option?.full_name}(${option?.position})`,
                })
            });
            return requiredUserData
        } else if (isMultipleSelect === 'special') {
            requiredUser?.results?.map((option) => {
                requiredUserData.push({
                    value: option?.id,
                    label: `${option?.full_name}(${option?.position})`,
                })
            });
            return requiredUserData
        } else if (isMultipleSelect === 'allUser') {
            requiredUserData.push({
                value: null,
                label: `Все сотрудники`,
            })
            return requiredUserData
        }

    }, [requiredUser, isMultipleSelect]);

    const onChangeSelect = (value) => {
        console.log(value)
        if (!value.length>0){
            setIsMultipleSelect('show')
        }
            value?.map((user) => {
                if (user === null) {
                    setIsMultipleSelect('allUser')
                }else {
                    setIsMultipleSelect('special')
                }
            })
    }

    return (<Modal
            title={title}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
        >
            <Spin
                spinning={postMeetingLoading}
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
                            создайте:
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
                            <TimePicker format="HH:mm:ss"/>
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
                                onChange={onChangeSelect}
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
                    {editModalMeetingSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>
            </Spin>
        </Modal>

    );
};

export default ModalCalendar;