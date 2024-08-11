import React, {useEffect, useState} from "react";
import {Button, Form, Spin, Upload} from "antd";
import {useDeleteQuery, usePostQuery} from "../../../service/query/Queries";
import {FormTextArea} from "../../../components";
import {onPreviewImage} from "../../../hooks";
import {FaFolderPlus} from "react-icons/fa";

const WriteComment = ({whichWriteID ,handleCancel ,whichWriteIDTask , setIsPostCommentSuccess}) => {
  const [fileListProps, setFileListProps] = useState([]);
  const [form] = Form.useForm();
  const initialValueForm = {
    message: '',
    file: []
  }
  const {
    mutate: postCommentMutate,
    isLoading: postCommentLoading,
      isSuccess: postCommentSuccess
  } = usePostQuery()
  const {
    mutate: imagesDeleteMutate
  } = useDeleteQuery()
  // query-image
  const {
    mutate: imagesUploadMutate,
    data: imagesUpload,
    isLoading: imagesUploadLoading,
    isSuccess: imagesUploadSuccess,
  } = usePostQuery()
  // useEffect(() => {
  //   if (imagesUploadSuccess) {
  //     const uploadImg = [{
  //       uid: imagesUpload?.id,
  //       name: imagesUpload?.id,
  //       status: "done",
  //       url: imagesUpload?.image
  //     }]
  //     form.setFieldsValue({image: uploadImg});
  //     setFileListProps(uploadImg);
  //   }
  // }, [imagesUpload]);
  useEffect(() => {
    if (imagesUploadSuccess) {
      const uploadImg = [{
        uid: imagesUpload?.id,
        name: imagesUpload?.id,
        status: "done",
        url: imagesUpload?.image
      }];
      form.setFieldsValue({image: uploadImg});
      setFileListProps(uploadImg);
    }
  }, [imagesUpload, form, imagesUploadSuccess]);
  const onChangeImage = ({fileList: newFileList}) => {
    const formData = new FormData();
    if (fileListProps.length !== 0 || newFileList.length === 0) {
      form.setFieldsValue({image: []});
      const id = [fileListProps[0]?.uid];
      imagesDeleteMutate({url: "users/files", id});
      setFileListProps([])
    } else if (newFileList.length !== 0) {
      formData.append("image", newFileList[0].originFileObj);
      imagesUploadMutate({url: "/users/files/", data: formData});
    }
  };
  // delete image

  useEffect(() => {
    setIsPostCommentSuccess(postCommentSuccess)
  } , [postCommentSuccess])

  const onFinish = (value) => {
    const data = {
      task:whichWriteIDTask || null,
      sub_task: whichWriteID || null,
      file: fileListProps[0]?.uid,
      message: value.message,
    }
    postCommentMutate({url: "/users/messages/", data: data});
    form.setFieldsValue(initialValueForm)
    handleCancel()
  }
  return (
      <Spin spinning={imagesUploadLoading || postCommentLoading}>
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
              placeholder={' Добавить комментарий'}
              required={true}
              required_message={'текст к заданию'}
              name={'message'}
          />
          <Form.Item
              label='Добавить файл'
              name={'file'}>
            <Upload
                maxCount={1}
                fileList={fileListProps}
                listType='picture-card'
                onChange={onChangeImage}
                onPreview={onPreviewImage}
                beforeUpload={() => false}
            >
              {fileListProps.length > 0 ? "" : <FaFolderPlus style={{fontSize:'32px'}} />}
            </Upload>
          </Form.Item>
          <Button htmlType="submit" type={"primary"} >
            Отправить
          </Button>
        </Form>
      </Spin>
  )
}

export default WriteComment