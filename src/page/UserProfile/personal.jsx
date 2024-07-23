import {Button, Col, DatePicker, Form, Row, Space, Spin, Upload} from "antd";
import {useDeleteQuery, useEditPatchQuery, useGetByIdQuery, usePostQuery} from "../../service/query/Queries";
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import {FormInput, FormInputNumber} from "../../components";
import {onPreviewImage, SuccessCreateAndEdit} from "../../hooks";

const initialValueForm = {
  first_name: "",
  last_name: "",
  birthday: "",
  gender: "",
  image: [],
  phone: "",

};
const PersonalInfo = () => {
  const [form] = Form.useForm();
  const [fileListProps, setFileListProps] = useState([]);
  const [isDeleteImage, setIsDeleteImage] = useState([])
  const {data: {user}} = useSelector(state => state.auth)
  // query-image
  const {
    mutate: imagesUploadMutate,
    isSuccess: imagesUploadSuccess,
    isLoading: imagesUploadLoading,
    data: imagesUpload
  } = usePostQuery()

  // put-query
  const {
    mutate: putProfile,
    isLoading: putProfileLoading,
    isSuccess: putProfileSuccess,
    data:putProfileData
  } = useEditPatchQuery()

  const {
    isLoading: editProfileLoading,
    data: editProfileData,
    refetch: editProfileRefetch,
    isSuccess: editProfileSuccess
  } = useGetByIdQuery(false, "edit-profile", user?.id, '/users/users')

  // delete image
  const {mutate: imagesDeleteMutate,isSuccess:deleteImageSuccess} = useDeleteQuery()
  // ================================ useEffect =============================


  useEffect(() => {
    if (user) {
      editProfileRefetch()
    }
  }, [user]);
  useEffect(() => {
    if (deleteImageSuccess){
      setIsDeleteImage([])
    }
  }, [deleteImageSuccess]);

  // delete image then edit profile
  useEffect(() => {
    if (isDeleteImage&& putProfileSuccess){
      imagesDeleteMutate({url: "users/images", id:isDeleteImage});
    }
  }, [putProfileSuccess]);

  // edit
  useEffect(() => {
    if (editProfileSuccess) {

      const image = [{
        uid: editProfileData?.images?.id,
        name: editProfileData?.images?.id,
        status: "done",
        url: editProfileData.images?.image
      }];

      const edit = {
        first_name: editProfileData?.first_name,
        last_name: editProfileData?.last_name,
        birthday: dayjs(editProfileData?.birthday, "DD.MM.YYYY"),
        gender: editProfileData?.gender,
        image,
        phone: editProfileData?.phone,
      }

      setFileListProps(image)
      form.setFieldsValue(edit)
    }

  }, [editProfileData])

  const onFinish = (value) => {

    const data = {
      first_name: value?.first_name,
      last_name: value?.last_name,
      birthday: dayjs(value?.birthday).format('DD.MM.YYYY'),
      gender: value?.gender,
      image: fileListProps[0]?.uid,
      phone: value?.phone,

    }

    if (editProfileData) {
      putProfile({url: '/users/users', data, id: user?.id})
    }

  }


  // refresh page again get data
  useEffect(() => {


    const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
    if (storedValues) {
      // storedValues.image = []
      setFileListProps(storedValues.image)
      const data = {
        ...storedValues,
        birthday: dayjs(storedValues?.birthday)
      }
      form.setFieldsValue(data);
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
  // image

  useEffect(() => {

    if (imagesUploadSuccess) {
      const uploadImg = [{
        uid: imagesUpload?.id,
        name: imagesUpload?.id,
        status: "done",
        url: imagesUpload?.image
      }]

      form.setFieldsValue({image: uploadImg});
      setFileListProps(uploadImg);
    }

  }, [imagesUpload]);

  const onChangeImage = ({fileList: newFileList}) => {
    const formData = new FormData();

    if (fileListProps.length !== 0 || newFileList.length === 0) {
      form.setFieldsValue({image: []});
      const id = [fileListProps[0]?.uid];

      setIsDeleteImage(id)
      setFileListProps([])
    } else if (newFileList.length !== 0) {
      formData.append("image", newFileList[0].originFileObj);
      imagesUploadMutate({url: "/users/images/", data: formData});
    }
  };

  return (
      <Spin spinning={editProfileLoading || imagesUploadLoading || putProfileLoading}>

        <Space direction={"vertical"}  className={'UserProfile'}>
        <h1>
          Пользовательские настройки
        </h1>
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
              <Col span={12}>
                <FormInput
                    required={true}
                    required_text={'Требуется название имя'}
                    label={'Имя сотрудника'}
                    name={'first_name'}
                />
            </Col>
              <Col span={12}>
                <FormInput
                    required={true}
                    required_text={'Требуется название фамилия'}
                    label={'Фамилия сотрудника'}
                    name={'last_name'}
                />
            </Col>
              <Col span={12}>
                <Form.Item
                    label="День рождения сотрудника"
                    name={'birthday'}
                    rules={[{
                      required: true, message: 'Укажите день рождения.'
                    }]}
                >
                  <DatePicker/>
              </Form.Item>

            </Col>

              <Col span={12}>
                <FormInputNumber
                    required={true}
                    required_text={'Требуется номер телефона'}
                    label={'Номер телефона'}
                    name={'phone'}
                />

              </Col>
              <Col span={12}>
                <Form.Item
                    label='Изображение'
                    name={'image'}
                    rules={[{required: true, message: 'Требуется изображение'}]}>
                  {/*<ImgCrop>*/}
                  <Upload
                      maxCount={1}
                      fileList={fileListProps}
                      listType='picture-card'
                      onChange={onChangeImage}
                      onPreview={onPreviewImage}
                      beforeUpload={() => false}
                  >
                    {fileListProps.length > 0 ? "" : "Upload"}
                  </Upload>
                  {/*</ImgCrop>*/}
              </Form.Item>
            </Col>
          </Row>

            <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
              {editProfileSuccess ? 'Изменить' : 'Создать'}
            </Button>
        </Form>

      </Space>
      </Spin>

  );
};

export default PersonalInfo;