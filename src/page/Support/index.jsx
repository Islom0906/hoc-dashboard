import {Button, Col, Form, Menu, Row, Space, theme} from "antd";
import {FaUser} from "react-icons/fa";
import {useState} from "react";
import {FaUserGear} from "react-icons/fa6";
import {FormTextArea, ImageUploader} from "../../components";

const Support = () => {
  const [checkInfo, setCheckInfo] = useState('admin')
  const [form] = Form.useForm();
  const initialValueForm = {
    message: '',
    file: []
  };
  const handleMenu = (key) => {
    setCheckInfo(key)
  }
  const {
    token: {contentBg},
  } = theme.useToken();


  const onFinish = () => {
    form.setFieldsValue(initialValueForm);

  }
  return (
      <Row gutter={30}>
        <Col span={8}>
          <div className={'card-personal'} style={{backgroundColor: contentBg}}>
            <Menu
                mode="inline"
                selectedKeys={[checkInfo]}
                style={{height: '100%', borderRight: 0}}
                onClick={({key}) => handleMenu(key)}
            >
              <Menu.Item key="admin" icon={<FaUser/>}>Программа для администратора</Menu.Item>
              <Menu.Item key="programmer" icon={<FaUserGear/>}>Разработчик программы</Menu.Item>
            </Menu>

          </div>
        </Col>
        <Col span={16}>
          <div className={'card-personal'} style={{backgroundColor: contentBg}}>
            <Space direction={'vertical'} size={'large'}>
              <h2>
                Любые пожелания и предложения вы можете отправлять
                {
                  checkInfo === 'admin' ? '  администратору' : '  разработчику'
                }
                и вы получите ответ на почту.
              </h2>
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
                <FormTextArea
                    placeholder={'Добавить комментарий'}
                    required={true}
                    required_message={'текст к заданию'}
                    name={'message'}
                />
                <ImageUploader form={form} fieldName="file" setImageUploaded={() => {
                }}/>
                <Button htmlType="submit" type="primary">
                  Отправить
                </Button>
              </Form>
            </Space>
          </div>
        </Col>
      </Row>
  );
};

export default Support;
