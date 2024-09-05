import {Button, Col, DatePicker, Form, Row, Select, Typography, Upload} from "antd";
import {MinusCircleOutlined} from "@ant-design/icons";
import {FormInput, FormTextArea} from "../../components";
import {onPreviewImage} from "../../hooks";
import {FaFolderPlus} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import {useDeleteQuery, usePostQuery} from "../../service/query/Queries";
const {Title} = Typography

const CreatSubTask = ({optionsUserByModules, optionsModules, onChangeModules  ,form ,fileListProps,setFileListProps}) => {
  const [fileListNumber, setFileListNumber] = useState([]);
  const {
    mutate: imagesDeleteMutate
  } = useDeleteQuery()
  // query-image
  const {
    mutate: imagesUploadMutate,
    data: imagesUpload,
    isSuccess: imagesUploadSuccess,
  } = usePostQuery()
  useEffect(() => {
    if (imagesUploadSuccess) {
      const initialImage=[...fileListProps]
      const uploadImg = [{
        uid: imagesUpload?.id,
        name: imagesUpload?.id,
        status: "done",
        url: imagesUpload?.image
      }];
      initialImage[fileListNumber]=uploadImg
      setFileListProps(initialImage);
      const getValueSubTask = form.getFieldValue('sub_tasks')
      getValueSubTask[fileListNumber].file = imagesUpload?.id
      form.setFieldsValue({
        sub_tasks: [
          ...getValueSubTask,
        ]
      });
      console.log('getValueSubTask' ,getValueSubTask[fileListNumber].file)
      console.log('1' )

    }
  }, [imagesUpload, form, imagesUploadSuccess]);
  const onChangeImage = ({fileList: newFileList} , index) => {
    const formData = new FormData();
    if(fileListProps[index]?.length  || newFileList.length === 0) {
      const deleteFileProps=[...fileListProps]
      const id = [fileListProps[index][0]?.uid];
      imagesDeleteMutate({url: "users/files", id});
      deleteFileProps[index] = []
      console.log(deleteFileProps)
      setFileListProps(deleteFileProps)
    } else if (newFileList.length !== 0) {
      formData.append("image", newFileList[0].originFileObj);
      imagesUploadMutate({url: "/users/files/", data: formData});
      setFileListNumber(index)
    }
  };

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
                            Добавить подзадачу:
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
                              name={[field.name, 'deadline']}
                              rules={[{
                                required: true, message: 'Укажите день  крайний срок.'
                              }]}
                          >
                            <DatePicker
                                showTime
                            />
                          </Form.Item>
                        </Col>


                        <Col span={12}>
                          <Form.Item
                              label={'Выберите отдел'}
                              name={[field.name, 'module']}
                              rules={[{
                                required: true, message: 'Выберите отдел'
                              }]}
                              wrapperCol={{
                                span: 24,
                              }}
                          >
                            <Select
                                style={{
                                  width: '100%',
                                }}
                                placeholder='Выберите отдел'
                                optionLabelProp='label'
                                options={optionsModules}
                                onChange={(id) => onChangeModules(id, index)}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                              label={'Выберите сотрудника'}
                              name={[field.name, 'staff']}
                              rules={[{
                                required: true, message: 'Выберите сотрудника'
                              }]}
                              wrapperCol={{
                                span: 24,
                              }}
                          >
                            <Select
                                style={{
                                  width: '100%',
                                }}
                                rules={[{
                                  required: true, message: 'Выберите сотрудника'
                                }]}
                                placeholder='Выберите сотрудника'
                                optionLabelProp='label'
                                options={optionsUserByModules && optionsUserByModules[0]?.length > 0 ? optionsUserByModules[index] : optionsUserByModules}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                          >
                            <FormInput
                                required={true}
                                required_text={'Выберите Название подзадачи'}
                                label={'Название подзадачи'}
                                name={[field.name, 'title']}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                              label='Добавить файл'
                              name={[field.name, 'file']}
                              >
                            <Upload
                                maxCount={1}
                                fileList={fileListProps[index]}
                                listType='picture-card'
                                onChange={ (file) => onChangeImage(file,index)}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                              {fileListProps[index]?.length > 0 ? "" : <FaFolderPlus style={{fontSize:'32px'}} />}
                            </Upload>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <FormTextArea
                              required={true}
                              required_text={'Выберите подзадаче'}
                              label={'Подробно о подзадаче'}
                              name={[field.name, 'text']}
                          />
                        </Col>
                      </Row>
                    </div>

                );
              })}
              <Form.Item>
                <Button type="primary" onClick={() => add()} block
                        style={{backgroundColor: '#28a745'}}>
                  Создать подзадачу
                </Button>
              </Form.Item>

            </>
        )}
      </Form.List>
  )
}


export default CreatSubTask