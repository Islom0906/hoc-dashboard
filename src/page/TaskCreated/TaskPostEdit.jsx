import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, message, Row, DatePicker, Select, Typography, Flex, Card} from "antd";
import {AppLoader, FormInput, FormTextArea} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "react-query";
import apiService from "../../service/apis/api";
import {editIdQuery} from "../../store/slice/querySlice";
import moment from "moment";
import {MinusCircleOutlined} from "@ant-design/icons";
const { RangePicker } = DatePicker;
const {Title} = Typography

const initialValueForm = {
title: '',
text: '',
deadline: '',
company: null,
moduls: [],
sub_tasks: [
    {
    title: "string",
    text: "string",
    deadline: '',
    staff: null
    }
  ]
}



const TaskPostEdit = () => {
  const [form] = Form.useForm();
  const [selectCompanyID, setSelectCompanyID] = useState(null)
  const [selectModulesID, setSelectModulesID] = useState(null)
  const [selectAddSubTask , setSelectAddSubTask] = useState(false)
  const {editId} = useSelector(state => state.query)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // get -company
  const {
    data:getCompany,
    isLoading: loadingGetCompany,
    refetch: refetchGetCompany,
  } = useQuery('get-company', () => apiService.getData(`/users/companies/`), {
    enabled: false,
    onError: (error) => {
      message.error(error.message);
    },
  });

  const {
    data:getModules,
    isLoading: loadingGetModules,
    refetch: refetchGetModules,
  } = useQuery('get-modules', () => apiService.getData(`/users/module-filter?company_id=${selectCompanyID}`), {
    enabled: false,
    onError: (error) => {
      message.error(error.message);
    },
  });
  // get-user
  const {
    data:getUserByModules,
    isLoading: loadingGetUserByModules,
    refetch: refetchGetUserByModules,
  } = useQuery('get-user', () => apiService.getData(`/users/user-filter?module_id=${selectModulesID}`), {
    enabled: false,
    onError: (error) => {
      message.error(error.message);
    },
  });
  // post task
  const {
    mutate: postTaskMutate,
    data: postTask,
    isLoading: postTaskLoading,
    isSuccess: postTaskSuccess,
  } = useMutation(({url, data}) => apiService.postData(url, data), {
    onSuccess: () => {
      message.success('Success')
    },
    onError: (error) => {
      for (let obj in error.response.data) {
        message.error(`${obj}: ${error.response.data[obj][0]}`)
      }
    }
  });
  const {
    isLoading: editTaskLoading,
    data: editTaskData,
    refetch: editTaskRefetch,
    isSuccess: editTaskSuccess,
  } = useQuery(["edit-task", editId], () => apiService.getDataByID("/users/tasks", editId), {
    enabled: false
  });
  const {
    mutate: putTask,
    isLoading: putTaskLoading,
    data: putData,
    isSuccess: putTaskSuccess
  } = useMutation(({
                     url,
                     data,
                     id
                   }) => apiService.editData(url, data, id), {
    onSuccess: () => {
      message.success('Success')
    },
    onError: (error) => {
      for (let obj in error.response.data) {
        message.error(`${obj}: ${error.response.data[obj][0]}`)
      }
    }
  });

  useEffect(() => {
    refetchGetCompany()
  } , [])
  // tasks success
  useEffect(() => {
    if (putTaskSuccess) {
      dispatch(editIdQuery(''))
    }
    if (putTaskSuccess || putTaskSuccess) {
      navigate('/tasks')
    }
  }, [postTask, putData])

  useEffect(() => {
    if (editId !== "") {
      editTaskRefetch();
    }
  }, [editId]);


  // if no edit tasks
  useEffect(() => {
    if (editId === "") {
      form.setFieldsValue(initialValueForm)
    }
  }, []);
  //edit company
  useEffect(() => {
    const subTask = []

    editTaskData?.sub_tasks?.map(item => {
      subTask.push({
        title : item?.title,
        text : item?.text,
        deadline : moment(item?.deadline) || null,
        staff :item?.staff
      })
      })

    console.log(editTaskData?.sub_tasks)


    if (editTaskSuccess) {
      const edit = {
        title: editTaskData?.title,
        text: editTaskData?.title,
        deadline: moment(editTaskData?.deadline),
        company: editTaskData?.company?.id,
        moduls: editTaskData?.moduls,
        sub_tasks: subTask
      }
      console.log(edit)
      form.setFieldsValue(edit)
    }
  }, [editTaskData])


  const onFinish = (value) => {
    console.log(value)
    const selectStaff = []
    const selectModuls = []
    value?.allModuls?.map(item => {
      console.log(item)
      console.log(1)
      selectStaff.push(item.staff)
      selectModuls.push(item.moduls)
    })

    console.log(selectStaff)

    const data = {
      title: value.title,
      text: value.text,
      deadline: moment(value?.deadline).format('YYYY-MM-DDTHH:mm:ss'),
      company:value?.company,
      moduls:value?.sub_tasks.length<1 ?selectModuls : [],
      sub_tasks: value?.sub_tasks
    }

    console.log(data)
    if (editTaskData) {
      putTask({url: '/users/tasks', data: data, id: editId})
    } else {
      postTaskMutate({url: "/users/tasks/", data: data});
    }
  }

  // refresh page again get data
  useEffect(() => {
    const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
    if (storedValues) {
      // storedValues.image = []
      form.setFieldsValue(storedValues);
    }
    const handleBeforeUnload = () => {
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
  // option Company
  const optionsCompany = useMemo(() => {
    return getCompany?.map((option) => {
      return {
        value:option?.id,
        label:option?.title,
      };
    });
  }, [getCompany]);
  // option module
  const optionsModules = useMemo(() => {
    return getModules?.results?.map((option) => {
      return {
        value: option?.id,
        label:   option?.name,
      };
    });
  }, [getModules]);
  // option module
  const optionsUserByModules = useMemo(() => {
    return getUserByModules?.results?.map((option) => {
      return {
        value: option?.id,
        label:` ${option?.full_name}(${option?.position})`,
      };
    });
  }, [getUserByModules , selectModulesID]);

  const onChangeCompany =  (id) => {
    setSelectCompanyID(id)
  }
  const onChangeModules =  (id) => {
    setSelectModulesID(id)
  }
  const onFinishFailed = value => {
    console.log(value)
  }


  useEffect(() => {
    if (selectCompanyID){
      refetchGetModules()
    }
  }, [selectCompanyID]);
  useEffect(() => {
    if (selectModulesID){
      refetchGetUserByModules()
    }
  }, [selectModulesID]);

  return (<div>
    { (postTaskLoading || editTaskLoading || putTaskLoading) ?
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
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
          <Row gutter={20}>
            <Col span={24}>
              <Title level={2}>
                создайте задачу:
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
                  name={'deadline'}
                  rules={[{
                    required: true, message: 'Укажите день  крайний срок.'
                  }]}
              >
                <DatePicker/>
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
                label={'Выберите компания'}
                name={'company'}
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
                  placeholder='Выберите компания'
                  optionLabelProp='label'
                  options={optionsCompany}
                  onChange={onChangeCompany}
              />
            </Form.Item>
              </Col>
            <Col>
              <Button type={"primary"} style={{marginBottom:30}} onClick={() => setSelectAddSubTask(prev => !prev)}>
                добавить подзадачу
              </Button>
            </Col>
            {
              selectAddSubTask ?
                  <Col span={24}>
                    <Card bordered={true} style={{border:1, borderStyle:"dashed" , borderColor:"white"}} >
                      <Flex align={'center'} vertical={true} justify={"center"} style={{height:"100%"}}>
                        <CreatSubTask  onChangeModules={onChangeModules} optionsModules={optionsModules} optionsUserByModules={optionsUserByModules} />
                      </Flex>
                    </Card>

                  </Col>
                  :
                  <Col span={24}>
                    <Card bordered={true} style={{border:1, borderStyle:"dashed" , borderColor:"white"}}>
                      <Flex align={'center'} vertical={true} justify={"center"} style={{height:"100%"}}>
                       <AddStaff optionsModules={optionsModules}  optionsUserByModules={optionsUserByModules} onChangeModules={onChangeModules} />
                      </Flex>
                    </Card>
                  </Col>
            }


          </Row>
          <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
            {editTaskSuccess ? 'Изменить' : 'Создать'}
          </Button>
        </Form>}
  </div>);
};

export default TaskPostEdit;
const AddStaff =({optionsUserByModules ,optionsModules ,onChangeModules  }) => {

  return(
      <Form.List name="allModuls">
        {(fields, {add, remove}) => (
            <>
              {fields.map((field, index) => {
                return (
                    <div key={field.fieldKey} style={{marginBottom: 20}}>
                      <Row gutter={20}  >
                        <Col span={11}>

                          <Form.Item
                              label={'Выберите департамент'}
                              name={[field.name ,'moduls']}
                              rules={[{

                                message: 'Выберите департамент'
                              }]}
                              wrapperCol={{
                                span: 24,
                              }}
                          >
                            <Select
                                style={{
                                  width: '100%',
                                }}
                                placeholder='Выберите департамент'
                                optionLabelProp='label'
                                options={optionsModules}
                                onChange={onChangeModules}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={11}>
                          <Form.Item
                              label={'Выберите сотрудник'}
                              name={[field.name ,'user']}
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
                                options={optionsUserByModules}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Button type={"dashed"} danger onClick={() => remove(field.name)} style={{marginTop:10}}>
                              <MinusCircleOutlined
                                  />
                            </Button>

                        </Col>
                      </Row>
                    </div>
                );
              })}
              <Form.Item>
                  <Button type="primary" onClick={() => add()} block
                          style={{backgroundColor: '#28a745'}}>
                    добавить сотрудника
                  </Button>
              </Form.Item>

            </>
        )}
      </Form.List>
  )
}


const CreatSubTask =({optionsUserByModules ,optionsModules ,onChangeModules  }) => {
  return(
      <Form.List name="sub_tasks">
        {(fields, {add, remove}) => (
            <>
              {fields.map((field, index) => {
                return (
                    <div key={field.fieldKey} style={{marginBottom: 10}}>
                      <Row gutter={[20 ,10]} >
                        <Col span={20}>
                          <Title level={3}>
                            Lorem ipsum dolor sit amet.
                          </Title>
                        </Col>
                        <Col span={2}>
                          <Button type={"dashed"} danger onClick={() => remove(field.name)}>
                            <MinusCircleOutlined
                            />
                          </Button>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                              label="Выберите крайний срок"
                              name={[field.name ,'deadline']}
                              rules={[{
                                required: true, message: 'Укажите день  крайний срок.'
                              }]}
                          >
                            <DatePicker/>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                              label={'Выберите департамент'}
                              name={[field.name ,'moduls']}
                              rules={[{
                                required: true, message: 'Выберите департамент'
                              }]}
                              wrapperCol={{
                                span: 24,
                              }}
                          >
                            <Select
                                style={{
                                  width: '100%',
                                }}
                                placeholder='Выберите департамент'
                                optionLabelProp='label'
                                options={optionsModules}
                                onChange={onChangeModules}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                              label={'Выберите сотрудник'}
                              name={[field.name ,'staff']}
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
                                options={optionsUserByModules}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                          >
                            <FormInput
                                required={true}
                                required_text={'Требуется название компания'}
                                label={'Название компания'}
                                name={[field.name ,'title']}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <FormTextArea
                              required={true}
                              required_text={'текст к заданию'}
                              label={'текст к заданию'}
                              name={[field.name ,'text']}
                          />
                        </Col>
                      </Row>
                    </div>

                );
              })}
              <Form.Item>
                  <Button type="primary" onClick={() => add()} block
                          style={{backgroundColor: '#28a745'}}>
                    создать подзадачу
                  </Button>
              </Form.Item>

            </>
        )}
      </Form.List>
  )
}