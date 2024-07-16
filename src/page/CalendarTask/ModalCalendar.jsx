import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, message, Modal, Row, Select, Spin, TimePicker, Typography} from "antd";
import {FormInput, FormTextArea} from "../../components";
import {useMutation, useQuery} from "react-query";
import apiService from "../../service/apis/api";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import editGetById from "../../hooks/editGetById";
import setInitialValue from "../../hooks/setInitialValue";
import {editIdQuery} from "../../store/slice/querySlice";

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
    const dispatch=useDispatch()
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
        data:putMeetingDate,
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
    // get by-id
    const {
        isLoading: editModalMeetingLoading,
        data: editModalMeetingData,
        refetch: editModalMeetingRefetch,
        isSuccess: editModalMeetingSuccess,
    } = useQuery(["edit-meeting", editId], () => apiService.getDataByID("/users/meetings", editId), {
        enabled: false
    });
    // delete meeting
    const {
        mutate:deleteMeetingMutate,
        isSuccess:deleteMeetingSuccess,
        isLoading: deleteMeetingLoading,
    } = useMutation(({url, id}) => apiService.deleteData(url, id),{
        onSuccess:()=>{
            message.success('Успешно')
        }
    });


    useEffect(() => {
        refetchRequiredUser()
    }, []);
    useEffect(() => {
        if (putMeetingDate) {
            dispatch(editIdQuery(''))
        }
        if (postMeetingSuccess||putMeetingDate||deleteMeetingSuccess) {
            refetchMeeting()
            setIsModalOpen(false)
            form.setFieldsValue(initialValueForm)
        }
    }, [postMeetingSuccess,putMeetingDate,deleteMeetingSuccess]);


    setInitialValue(form,initialValueForm)
    useEffect(() => {
        if (putMeetingSuccess){
            setIsModalOpen(false)
        }
    }, [putMeetingSuccess]);
    editGetById(editModalMeetingRefetch)

    //edit meeting
    useEffect(() => {
        if (editModalMeetingSuccess) {
            let isAllUser = false
            if (editModalMeetingSuccess?.users?.length > 0) {
                setIsMultipleSelect('special')
                isAllUser = false
            } else {
                setIsMultipleSelect('allUser')
                isAllUser = true
            }
            const edit = {
                title: editModalMeetingData?.title,
                text: editModalMeetingData?.text,
                meeting_date: dayjs(editModalMeetingData?.meeting_date),
                users: isAllUser > 0 ? [null] : editModalMeetingSuccess?.users
            }
            form.setFieldsValue(edit)
        }

    }, [editModalMeetingData])

    const onFinish = (value) => {
        let allUser = false
        let formatDate=null
        const meetingDate = date
            .hour(value?.meeting_date.hour())
            .minute(value?.meeting_date.minute())
            .second(value?.meeting_date.second())
        if (editId){
            formatDate= dayjs(value?.meeting_date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        }else{
            formatDate=dayjs(meetingDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        }
        value?.users.map((user) => {
            if (user === null) {
                allUser = true
            }
        })


        const data = {
            title: value.title,
            text: value.text,
            meeting_date: formatDate,
            users: isMultipleSelect==='allUser' ? [] : value?.users
        }
        if (editModalMeetingData) {
            putMeeting({url: '/users/meetings', data: data, id: editId})
        } else {
            postMeetingMutate({url: "/users/meetings/", data: data});
        }
    }


    const handleCancel = () => {

        setIsModalOpen(false);
    };

    const deleteMeetingHandle=()=>{
        if (editId){

        deleteMeetingMutate({url:'/users/meetings', id: editId})
        }
    }

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
                spinning={postMeetingLoading || editModalMeetingLoading||putMeetingLoading||deleteMeetingLoading}
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
                            Создать встречу:
                        </Title>
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Требуется название встречи'}
                            label={'Название встречи'}
                            name={'title'}
                        />
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Выберите время встречи"
                            name={'meeting_date'}
                            rules={[{
                                required: true, message: 'Укажите время встречи.'
                            }]}
                        >
                            <TimePicker format="HH:mm:ss"/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <FormTextArea
                            required={true}
                            required_text={'Требуется o короткой встрече'}
                            label={' О короткой встрече'}
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
                <Button  type="primary" danger htmlType="button" style={{width: "100%", marginTop: "20px"}} onClick={deleteMeetingHandle}>
                    Удалить встречу
                </Button>
            </Spin>
        </Modal>

    );
};

export default ModalCalendar;