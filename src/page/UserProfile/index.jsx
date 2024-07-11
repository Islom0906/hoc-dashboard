import './index.scss'
import {Col, Input, Row, Form, Button, Upload, Space, DatePicker} from "antd";
import {PlusOutlined} from "@ant-design/icons";


const UserProfile = () => {
  return (
      <Space direction={"vertical"}  className={'UserProfile'}>
        <h1>
          Пользовательские настройки
        </h1>
        <Form layout="vertical"
        >
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item label="Ваше изображение" >
                <Upload action="/upload.do" listType="picture-card">
                  <button style={{ border: 0, background: 'none' }} type="button">
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Добавит</div>
                  </button>
                </Upload>
              </Form.Item>
            </Col>
            <Col className="" span={12}>
              <Form.Item label="Имя">
                <Input placeholder="Ваше имя (Александр)"/>
              </Form.Item>
            </Col>
            <Col className="" span={12}>
              <Form.Item label="Фамилия">
                <Input placeholder="Ваша фамилия (Александров)"/>
              </Form.Item>
            </Col>
            <Col className="" span={12}>
              <Form.Item label="Электронная почта">
                <Input placeholder="Ваша электронная почта (alexsandr@gmail.com)"/>
              </Form.Item>
            </Col>
            <Col className="" span={12}>
              <Form.Item label="Номер телефона">
                <Input placeholder="Ваш номер (+998776789012)"/>
              </Form.Item>
            </Col>
            <Col className="" span={12}>
              <Form.Item label="Должность">
                <Input placeholder="Менеджер"/>
              </Form.Item>
            </Col>
            <Col className="" span={12}>
              <Form.Item label="Выбор даты">
                <DatePicker style={{width:'100%'}}/>
              </Form.Item>
            </Col>
            <Col  span={24}>
              <Button type={"primary"}  size={'large'}>
                Сохранить изменения
              </Button>
            </Col>
          </Row>
        </Form>

      </Space>
  );
};

export default UserProfile;