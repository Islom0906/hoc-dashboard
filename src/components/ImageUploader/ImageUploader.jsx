import {useState, useEffect} from "react";
import {Upload, Form} from "antd";
import {FaFolderPlus} from "react-icons/fa";
import {useDeleteQuery , usePostQuery} from "../../service/query/Queries";
import {onPreviewImage} from "../../hooks";

const ImageUploader = ({form, fieldName, setImageUploaded}) => {
  const [fileListProps, setFileListProps] = useState([]);

  const {
    mutate: imagesDeleteMutate
  } = useDeleteQuery();

  const {
    mutate: imagesUploadMutate,
    data: imagesUpload,
    isLoading: imagesUploadLoading,
    isSuccess: imagesUploadSuccess,
  } = usePostQuery();

  useEffect(() => {
    if (imagesUploadSuccess) {
      const uploadImg = [{
        uid: imagesUpload?.id,
        name: imagesUpload?.id,
        status: "done",
        url: imagesUpload?.image
      }];
      form.setFieldsValue({ [fieldName]: uploadImg });
      setFileListProps(uploadImg);
      setImageUploaded(true); // Callback to indicate image upload success
    }
  }, [imagesUpload, form, imagesUploadSuccess, fieldName, setImageUploaded]);

  const onChangeImage = ({fileList: newFileList}) => {
    const formData = new FormData();
    if (fileListProps.length !== 0 || newFileList.length === 0) {
      form.setFieldsValue({ [fieldName]: [] });
      const id = [fileListProps[0]?.uid];
      imagesDeleteMutate({url: "users/files", id});
      setFileListProps([]);
    } else if (newFileList.length !== 0) {
      formData.append("image", newFileList[0].originFileObj);
      imagesUploadMutate({url: "/users/files/", data: formData});
    }
  };

  return (
      <Form.Item label='Добавить файл' name={fieldName}>
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
  );
};

export default ImageUploader;
