import {Button, Col, DatePicker, Form, Row, Select, Typography} from "antd";
import {MinusCircleOutlined} from "@ant-design/icons";
import {FormInput, FormTextArea} from "../../components";
const {Title} = Typography

const CreatSubTask = ({optionsUserByModules, optionsModules, onChangeModules}) => {
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
                                label={'Название подзадачи'}
                                name={[field.name, 'title']}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <FormTextArea
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