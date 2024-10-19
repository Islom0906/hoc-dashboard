import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, Modal, Row, Select, Spin, TimePicker, Typography} from "antd";
import {FormInput, FormTextArea} from "../../components";
import {useQueryClient} from "react-query";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import editGetById from "../../hooks/editGetById";
import setInitialValue from "../../hooks/setInitialValue";
import {editIdCalendarQuery} from "../../store/slice/querySlice";
import {useDeleteQuery, useEditQuery, useGetByIdQuery, useGetQuery, usePostQuery} from "../../service/query/Queries";

const {Title} = Typography
const initialValueForm = {
    title: "",
    text: "",
    meeting_date: "",
    companies: null,
    tag: '',
    users: []
}
const ModalCalendar = ({isModalOpen, setIsModalOpen, title, date, refetchMeeting}) => {
    const queryClient = useQueryClient()
    const [form] = Form.useForm();

    const [isMultipleSelect, setIsMultipleSelect] = useState('show')

    const dispatch = useDispatch()
    const {data: {user} = {}} = useSelector((state) => state.auth);
    const {editIdCalendar} = useSelector(state => state.query)
    const {companyID} = useSelector(state => state.companySlice)

    // get-companyData
    const {
        data: companyData,
        refetch: refetchCompanyData,
        isLoading: loadingCompanyData
    } = useGetQuery(false, 'get-companyData', `users/companies`, false)

    // get-responsibleUser
    const {
        data: requiredUser,
        refetch: refetchRequiredUser,
        isLoading: loadingRequiredUser
    } = useGetQuery(false, 'get-requiredUser', `users/user-filter-by-company?company_id=${companyID}`, false)

    const {
        mutate: postMeetingMutate,
        isLoading: postMeetingLoading,
        isSuccess: postMeetingSuccess
    } = usePostQuery()

    // put meeting
    const {
        mutate: putMeeting,
        data: putMeetingDate,
        isLoading: putMeetingLoading,
        isSuccess: putMeetingSuccess
    } = useEditQuery()


    // get by-id
    const {
        isLoading: editModalMeetingLoading,
        data: editModalMeetingData,
        refetch: editModalMeetingRefetch,
        isSuccess: editModalMeetingSuccess
    } = useGetByIdQuery(false, "edit-meeting", editIdCalendar, '/users/meetings')


    // delete meeting
    const {
        mutate: deleteMeetingMutate,
        isSuccess: deleteMeetingSuccess,
        isLoading: deleteMeetingLoading
    } = useDeleteQuery()

    useEffect(() => {
        if (putMeetingDate) {
            dispatch(editIdCalendarQuery(''))
        }
        if (putMeetingSuccess) {
            queryClient.removeQueries(["edit-meeting", editIdCalendar])
            refetchMeeting()
            setIsModalOpen(false)
            form.setFieldsValue(initialValueForm)
        }
    }, [putMeetingSuccess]);

    useEffect(() => {
        if (postMeetingSuccess) {
            refetchMeeting()
            setIsModalOpen(false)
            form.setFieldsValue(initialValueForm)
            setIsMultipleSelect('show')
        }
    }, [postMeetingSuccess]);
    useEffect(() => {
        if (deleteMeetingSuccess) {
            refetchMeeting()
            setIsModalOpen(false)
            form.setFieldsValue(initialValueForm)
        }
    }, [deleteMeetingSuccess]);

    setInitialValue(form, initialValueForm)
    useEffect(() => {
        if (putMeetingSuccess) {
            setIsModalOpen(false)
        }
    }, [putMeetingSuccess]);
    editGetById(editModalMeetingRefetch)

    useEffect(() => {
        if (!isModalOpen && editIdCalendar !== "") {
            dispatch(editIdCalendarQuery(''))
            form.setFieldsValue(initialValueForm)
        }
        if (companyID) {
            refetchRequiredUser()
        }
        if (isModalOpen) {
            refetchCompanyData()

        }
    }, [isModalOpen, user]);


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
            const companyIdSelect=editModalMeetingData?.companies?.map(company=>{
                return company.id
            })
            const usersIdSelect=editModalMeetingData?.users?.map(user=>{
                return user.id
            })
            const edit = {
                title: editModalMeetingData?.title,
                text: editModalMeetingData?.text,
                companies: companyIdSelect,
                meeting_date: dayjs(editModalMeetingData?.meeting_date),
                users: isAllUser > 0 ? [""] : usersIdSelect
            }
            form.setFieldsValue(edit)
        }

    }, [editModalMeetingData])
    const onFinish = (value) => {
        let allUser = false
        let formatDate = null

        const meetingDate = date
            .hour(value?.meeting_date.hour())
            .minute(value?.meeting_date.minute())
        if (editIdCalendar) {
            formatDate = dayjs(value?.meeting_date).format('YYYY-MM-DDTHH:mm:ss')
        } else {
            formatDate = dayjs(meetingDate).format('YYYY-MM-DDTHH:mm:ss')
        }

        value?.users?.map((user) => {
            if (user === "") {
                allUser = true
            }
        })
        const data = {
            title: value.title,
            text: value.text,
            meeting_date: formatDate,
            companies: value.companies,
            users: isMultipleSelect === 'allUser'  ? [] : value?.users
        }
        if (editModalMeetingData) {
            putMeeting({url: '/users/meetings', data: data, id: editIdCalendar})
        } else {
            postMeetingMutate({url: "/users/meetings/", data: data});
        }
    }
    // cancel modal
    const handleCancel = () => {
        setIsMultipleSelect('show')
        form.setFieldsValue(initialValueForm)
        setIsModalOpen(false);
    };
    const deleteMeetingHandle = () => {
        if (editIdCalendar) {
            deleteMeetingMutate({url: '/users/meetings', id: editIdCalendar})
        }
    }
    // option Company
    const optionsResponsibleUser = useMemo(() => {
        if (companyID) {
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
    }, [requiredUser, isMultipleSelect, companyID]);


    const optionsCompany = useMemo(() => {
        return companyData?.map(company => (
            {
                value: company?.id,
                label: company?.title
            }
        ))
    }, [companyData]);

    const onChangeSelect = (value) => {
        if (!value.length > 0) {
            setIsMultipleSelect('show')
        }
        value?.map((user) => {
            if (user === "") {
                setIsMultipleSelect('allUser')
            } else {
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
                spinning={postMeetingLoading || editModalMeetingLoading || putMeetingLoading || deleteMeetingLoading}
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
                                rules={[
                                    {
                                        required: true,
                                        message: 'Укажите время встречи.',
                                    },
                                    {
                                        validator: (_, value) => {
                                            if (!value) {
                                                return Promise.resolve();
                                            }

                                            const selectedDateTime = date
                                                .hour(value.hour())
                                                .minute(value.minute());

                                            const now = dayjs().add(1, 'hour');

                                            if (selectedDateTime.isAfter(now)) {
                                                return Promise.resolve();
                                            } else {
                                                return Promise.reject(new Error('Время встречи должно быть минимум через 1 час от текущего времени.'));
                                            }
                                        }
                                    }
                                ]}
                            >
                                <TimePicker format="HH:mm" />
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
                                    label={'Компания'}
                                    name={'companies'}
                                    rules={[{
                                        required: true, message: 'Выберите компания'
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
                                        loading={loadingCompanyData}
                                        placeholder='Выберите компания'
                                        optionLabelProp='label'
                                        options={optionsCompany}
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
                    <Button type="primary" danger htmlType="button" style={{width: "100%", marginTop: "20px"}}
                            onClick={deleteMeetingHandle}>
                        Удалить встречу
                    </Button>
                }
            </Spin>
        </Modal>

    );
};

export default ModalCalendar;