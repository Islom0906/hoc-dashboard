import {useEffect} from "react";
import {Button, Form, Spin} from "antd";
import {FormTextArea , ImageUploader} from "../../../components";
import {usePostQuery} from "../../../service/query/Queries";

const WriteComment = ({refetchTaskInner,whichWriteID, handleCancel, whichWriteIDTask, setIsPostCommentSuccess}) => {
  const [form] = Form.useForm();
  const initialValueForm = {
    message: '',
    file: []
  };

  const {
    mutate: postCommentMutate,
    isLoading: postCommentLoading,
    isSuccess: postCommentSuccess
  } = usePostQuery();
  useEffect(() => {
    if (postCommentSuccess){
      refetchTaskInner()
    }
  }, [postCommentSuccess]);
  useEffect(() => {
    setIsPostCommentSuccess(postCommentSuccess);
  }, [postCommentSuccess, setIsPostCommentSuccess]);

  const onFinish = (value) => {
    const data = {
      task: whichWriteIDTask || null,
      sub_task: whichWriteID || null,
      file: value.file[0]?.uid,
      message: value.message,
    };

    if(whichWriteIDTask) {
      const data = {
        task: whichWriteIDTask || null,
        file: value.file[0]?.uid,
        message: value.message,
      };
      postCommentMutate({url: "/users/task-messages/", data: data});
    }
    else{
      const data = {
        sub_task: whichWriteID || null,
        file: value.file[0]?.uid,
        message: value.message,
      };
    postCommentMutate({url: "/users/subtask-messages/", data: data});
    }
    form.setFieldsValue(initialValueForm);
    handleCancel();
  };

  return (
      <Spin spinning={postCommentLoading}>
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
          <ImageUploader form={form} fieldName="file" setImageUploaded={() => {}} />
          <Button htmlType="submit" type="primary">
            Отправить
          </Button>
        </Form>
      </Spin>
  );
};

export default WriteComment;
