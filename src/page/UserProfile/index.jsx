import './index.scss'
import {Col, Input, Row, Form, Button, Upload, Space, DatePicker} from "antd";
import {PlusOutlined} from "@ant-design/icons";


const UserProfile = () => {
  return (
      <Space direction={"vertical"}  className={'UserProfile'}>
        <h1>
          User setting
        </h1>
        <Form layout="vertical"
        >
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item label="Your image" >
                <Upload action="/upload.do" listType="picture-card">
                  <button style={{ border: 0, background: 'none' }} type="button">
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                </Upload>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item label="First name">
                <Input placeholder="admin"/>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item label="Last name">
                <Input placeholder="last name"/>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item label="Email">
                <Input placeholder="Email"/>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item label="Phone number">
                <Input placeholder="+123 (45) 678-90-12"/>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item label="Position">
                <Input placeholder="Manager"/>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item label="DatePicker">
                <DatePicker style={{width:'100%'}} />
              </Form.Item>
            </Col>


            <Col  span={24}>
              <Button type={"primary"}  size={'large'}>
                Save changes
              </Button>
            </Col>
          </Row>
        </Form>

      </Space>
  );
};

export default UserProfile;