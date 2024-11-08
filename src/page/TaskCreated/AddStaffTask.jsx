import {Col, Form, Row, Select, Typography} from "antd";
import React from "react";

const {Title} = Typography

const AddStaffTask = ({optionsUserByModules, optionsModules, onChangeModules, isBoss}) => {

  return (
      <Form.List name="allModuls" >
        {(fields, {add, remove}) => (
            <>
              {fields.map((field, index) => {
                return (
                    <div key={field.fieldKey} style={{marginBottom: 20 , width:'100%'}}>
                      <Row gutter={20}>
                          {
                              !isBoss &&
                       <>
                        <Col span={20}>
                          <Title level={3} style={{marginBottom: '30px'}}>
                            Добавить сотрудника:
                          </Title>
                        </Col>
                        <Col span={12}>
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
                       </>
                          }

                          <Col span={isBoss ? 24:12 }>
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
                          {
                              !isBoss &&
                              <>
                        {/*<Col span={2}>*/}
                        {/*  <CustomButton type={"dashed"} danger onClick={() => remove(field.name)}*/}
                        {/*          style={{marginTop: 10}}>*/}
                        {/*    <MinusCircleOutlined*/}
                        {/*    />*/}
                        {/*  </CustomButton>*/}
                        {/*</Col>*/}
                              </>
                          }
                      </Row>
                    </div>
                );
              })}
                {
                    !isBoss &&
                    <>
              {/*<Form.Item>*/}
              {/*  <CustomButton type="primary" onClick={() => add()} block*/}
              {/*          style={{backgroundColor: '#28a745'}}>*/}
              {/*    Добавить сотрудника*/}
              {/*  </CustomButton>*/}
              {/*</Form.Item>*/}
                    </>
                }

            </>
        )}
      </Form.List>
  )
}

export default AddStaffTask