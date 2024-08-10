import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, Modal, Row, Select, Spin, TimePicker, Typography} from "antd";
import {FormInput, FormTextArea} from "../../components";
import {useQueryClient} from "react-query";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import editGetById from "../../hooks/editGetById";
import setInitialValue from "../../hooks/setInitialValue";
import {editIdQuery} from "../../store/slice/querySlice";
import {useDeleteQuery, useEditQuery, useGetByIdQuery, useGetQuery, usePostQuery} from "../../service/query/Queries";
import company from "../Company";

const {Title}=Typography
const initialValueForm={
    title: "",
    text: "",
    meeting_date: "",
    company: '',
    users: []
}
const ModalCalendar = ({isModalOpen, setIsModalOpen, title, date,refetchMeeting}) => {
    const queryClient = useQueryClient()
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [selectCompany , setSelectCompany] = useState('')
    const [isMultipleSelect, setIsMultipleSelect] = useState('show')
    const dispatch=useDispatch()


    // get-responsibleUser
    const {
        data: requiredUser,
        refetch: refetchRequiredUser,
        isLoading : loadingRequiredUser
    } = useGetQuery(false, 'get-requiredUser', `users/user-filter-by-company?company_id=${selectCompany}`, false)

    // get-company
    const {
        data: getCompany,
        refetch: refetchGetCompany
    } = useGetQuery(false, 'get-company', '/users/companies', false)

    // post meeting
    const {
        mutate: postMeetingMutate,
        isLoading: postMeetingLoading,
        isSuccess: postMeetingSuccess
    } = usePostQuery()

    // put meeting
    const {
        mutate: putMeeting,
        data:putMeetingDate,
        isLoading: putMeetingLoading,
        isSuccess: putMeetingSuccess
    } = useEditQuery()

    // get by-id
    const {
        isLoading: editModalMeetingLoading,
        data: editModalMeetingData,
        refetch: editModalMeetingRefetch,
        isSuccess: editModalMeetingSuccess
    } = useGetByIdQuery(false, "edit-meeting", editId, '/users/meetings')


    // delete meeting
    const {
        mutate: deleteMeetingMutate,
        isSuccess:deleteMeetingSuccess,
        isLoading: deleteMeetingLoading
    } = useDeleteQuery()


    useEffect(() => {
        if(selectCompany){
        refetchRequiredUser()
        }
    }, [selectCompany]);

    useEffect(() => {
        if (putMeetingDate) {
            dispatch(editIdQuery(''))
        }
        if (  putMeetingSuccess ) {
            queryClient.removeQueries(["edit-meeting", editId])
            refetchMeeting()
            setIsModalOpen(false)
            form.setFieldsValue(initialValueForm)
        }
    }, [ putMeetingSuccess]);

    useEffect(() => {
        if (postMeetingSuccess){
            refetchMeeting()
            setIsModalOpen(false)
            form.setFieldsValue(initialValueForm)
        }
    }, [postMeetingSuccess]);
    useEffect(() => {
        if (deleteMeetingSuccess){
            refetchMeeting()
            setIsModalOpen(false)
            form.setFieldsValue(initialValueForm)
        }
    }, [deleteMeetingSuccess]);



    setInitialValue(form,initialValueForm)
    useEffect(() => {
        if (putMeetingSuccess){
            setIsModalOpen(false)
        }
    }, [putMeetingSuccess]);
    editGetById(editModalMeetingRefetch)

    useEffect(() => {
        if (!isModalOpen && editId !== "") {
            dispatch(editIdQuery(''))
            form.setFieldsValue(initialValueForm)
        }
    }, [isModalOpen]);

    useEffect(() => {
        if(isModalOpen) {
            refetchGetCompany()
        }
    } , [isModalOpen ])

    //edit meeting
    useEffect(() => {
        if (editModalMeetingSuccess) {
            let isAllUser = false
            if (editModalMeetingData?.users?.length > 0) {
                setIsMultipleSelect('special')
                isAllUser = false
            } else {
                setIsMultipleSelect('allUser')
                isAllUser = true
            }
            const edit = {
                title: editModalMeetingData?.title,
                text: editModalMeetingData?.text,
                company: editModalMeetingData?.company,
                meeting_date: dayjs(editModalMeetingData?.meeting_date),
                users: isAllUser > 0 ? [""] : editModalMeetingData?.users
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
            formatDate= dayjs(value?.meeting_date).format('YYYY-MM-DDTHH:mm:ss.SSS')
        }else{
            formatDate=dayjs(meetingDate).format('YYYY-MM-DDTHH:mm:ss.SSS')
        }
        value?.users.map((user) => {
            if (user === "") {
                allUser = true
            }
        })
        const data = {
            title: value.title,
            text: value.text,
            meeting_date: formatDate,
            company:value.company,
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
        if(selectCompany) {
            const requiredUserData = []
            if (isMultipleSelect === 'show') {
                requiredUserData.push({
                    value: "",
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
                    value: "",
                    label: `Все сотрудники`,
                })
                return requiredUserData
            }
        }
    }, [requiredUser, isMultipleSelect ,selectCompany ]);
    const optionsCompany = useMemo(() => {
        return getCompany?.map((option) => {
            return {
                value: option?.id,
                label: option?.title,
            };
        });
    }, [getCompany]);
    const onChangeSelect = (value) => {
        if (!value.length>0){
            setIsMultipleSelect('show')
        }
            value?.map((user) => {
                if (user === "") {
                    setIsMultipleSelect('allUser')
                }else {
                    setIsMultipleSelect('special')
                }
            })
    }

    const onChangeCompany = (id) => {
        setSelectCompany(id)
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
                            required_text={'Требуется Повестка'}
                            label={'Повестка'}
                            name={'text'}
                        />
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label={'Выберите компанию'}
                            name={'company'}
                            rules={[{
                                required: true, message: 'Выберите компанию'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                // onChange={onChangeSelect}
                                placeholder='Выберите компанию'
                                optionLabelProp='label'
                                options={optionsCompany}
                                onChange={onChangeCompany}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={'Участники'}
                            name={'users'}
                            rules={[{
                                required: true, message: 'Выберите участников'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                loading={loadingRequiredUser}
                                onChange={onChangeSelect}
                                mode={'multiple'}
                                placeholder='Выберите участников'
                                optionLabelProp='label'
                                options={optionsResponsibleUser}
                            />
                        </Form.Item>
                    </Col>


                </Row>
                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editModalMeetingSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>
                {
                    editModalMeetingSuccess &&
                <Button  type="primary" danger htmlType="button" style={{width: "100%", marginTop: "20px"}} onClick={deleteMeetingHandle}>
                    Удалить встречу
                </Button>
                }
            </Spin>
        </Modal>

    );
};

export default ModalCalendar;