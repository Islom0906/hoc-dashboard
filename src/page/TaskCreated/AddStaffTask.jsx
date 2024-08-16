import {Button, Col, Form, Row, Select , Typography} from "antd";
import {MinusCircleOutlined} from "@ant-design/icons";
import React from "react";
const {Title} = Typography

const AddStaffTask = ({optionsUserByModules, optionsModules, onChangeModules}) => {

  return (
      <Form.List name="allModuls">
        {(fields, {add, remove}) => (
            <>
              {fields.map((field, index) => {
                return (
                    <div key={field.fieldKey} style={{marginBottom: 20}}>
                      <Row gutter={20}>
                        <Col span={20}>
                          <Title level={3} style={{marginBottom: '30px'}}>
                            Добавить сотрудника:
                          </Title>
                        </Col>
                        <Col span={11}>
                          <Form.Item
                              label={'Выберите департамент'}
                              name={[field.name, 'moduls']}
                              rules={[{
                                required: true,
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
                                onChange={(id) => onChangeModules(id, index)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={11}>
                          <Form.Item
                              label={'Выберите сотрудник'}
                              name={[field.name, 'user']}
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
                        <Col span={2}>
                          <Button type={"dashed"} danger onClick={() => remove(field.name)}
                                  style={{marginTop: 10}}>
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
                  Добавить сотрудника
                </Button>
              </Form.Item>

            </>
        )}
      </Form.List>
  )
}

export default AddStaffTask