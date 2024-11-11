import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Row, Upload} from "antd";

import {useDispatch, useSelector} from "react-redux";
import {AppLoader, FormInput, FormTextArea} from "../../components";
import {useDeleteQuery, useEditQuery, useGetByIdQuery, usePostQuery} from "../../service/query/Queries";
import {EditGetById, onPreviewImage, SetInitialValue} from "../../hooks";
import {editIdQuery} from "../../store/slice/querySlice";


const initialValueForm = {
    title: "",
    text: "",
    image: [],
    file: []
}


const NewsAddPostEdit = ({setIsModalOpen, refetchGetNews, isAddModalOpen}) => {
    const imageInitial = {
        file: [],
        image: []
    }
    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [fileListProps, setFileListProps] = useState(imageInitial);
    const [isUpload, setIsUpload] = useState("")
    const [mainIndex, setMainIndex] = useState(null)
    const {
        mutate: postNewsMutate,
        isLoading: postNewsLoading,
        isSuccess: postNewsSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editNewsLoading,
        data: editNewsData,
        refetch: editNewsRefetch,
        isSuccess: editNewsSuccess
    } = useGetByIdQuery(false, "edit-news", editId, '/users/news')
    // put-query
    const {
        mutate: putNews,
        isLoading: putNewsLoading,
        isSuccess: putNewsSuccess
    } = useEditQuery()
    // post image
    const {
        mutate: imagesUploadMutate,
        isSuccess: imagesUploadSuccess,
        isLoading: imagesUploadLoading,
        data: imagesUpload
    } = usePostQuery()

    //delete image
    const {mutate: imagesDeleteMutate} = useDeleteQuery()
    // ================================ useEffect =============================

    // if edit news
    EditGetById(editNewsRefetch)
    // if no edit news
    SetInitialValue(form, initialValueForm)
    // news success
    useEffect(() => {
        if (putNewsSuccess) {
            dispatch(editIdQuery(''))
        }

        if (postNewsSuccess || putNewsSuccess) {
            form.setFieldsValue(initialValueForm)
            setFileListProps(imageInitial)
            localStorage.removeItem('editDataId')
            setIsModalOpen(false)
            refetchGetNews()
        }
    }, [postNewsSuccess, putNewsSuccess])


    //edit news
    useEffect(() => {
        if (editNewsSuccess) {


            const file = [{
                uid: editNewsData?.file?.id,
                name: editNewsData?.file?.id,
                status: "done",
                url: editNewsData?.file?.image
            }];
            const image = [{
                uid: editNewsData?.image?.id,
                name: editNewsData?.image?.id,
                status: "done",
                url: editNewsData?.image?.image
            }];
            let checkFile = editNewsData?.file ? file : []
            const edit = {
                title: editNewsData.title,
                text: editNewsData.text,
                file: checkFile,
                image

            }

            setFileListProps({
                file: checkFile, image
            })
            form.setFieldsValue(edit)
        }

    }, [editNewsData])

    const onFinish = (value) => {
        const getFileUid = (file) => (Array.isArray(file) ? file[0]?.uid : file?.uid);
        const data = {
            ...value,
            file: value.file.length > 0 ? getFileUid(fileListProps.file) : null,
            image: getFileUid(fileListProps.image),
        }

        if (editNewsData) {
            putNews({url: '/users/news', data, id: editId})
        } else {
            postNewsMutate({url: "/users/news/", data});
        }
    }


    // refresh page again get data
    // useEffect(() => {
    //
    //
    //     const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
    //     if (storedValues) {
    //         form.setFieldsValue(storedValues);
    //     }
    //
    //     const handleBeforeUnload = () => {
    //         localStorage.setItem(
    //             'myFormValues',
    //             JSON.stringify(form.getFieldsValue()),
    //         );
    //     };
    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //     return () => {
    //         localStorage.removeItem('editDataId')
    //         localStorage.removeItem('myFormValues')
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     }
    // }, []);
    // image

    const changeFieldValue = (name, value) => {
        if (name === 'file') {
            form.setFieldsValue({file: value});
        } else if (name === 'image') {
            form.setFieldsValue({image: value});
        }
    }




    useEffect(() => {
        // images
        if (imagesUploadSuccess && isUpload) {
            const initialImage = {...fileListProps}
            const uploadImg = {
                uid: imagesUpload?.id,
                name: imagesUpload?.id,
                status: "done",
                url: imagesUpload?.image

            }
            if (mainIndex !== null) {
                initialImage[isUpload][mainIndex] = [uploadImg]
            } else {
                initialImage[isUpload].push(uploadImg)
            }
            changeFieldValue(isUpload, [uploadImg], mainIndex)
            setFileListProps(initialImage);
            setIsUpload("")
            setMainIndex(null)
        }
    }, [imagesUpload]);
    const onChangeImage = (info, name, index = null, multiple = false) => {
        const {fileList: newFileList, file} = info
        const formData = new FormData();
        let id = null
        let multipleDeleteIndex = null
        if (multiple && file?.status === 'removed') {
            fileListProps[name][index].map((item, ind) => {
                if (item?.uid === file?.uid) {
                    multipleDeleteIndex = ind
                }
            })
        }
        if (file?.status === 'removed') {
            const deleteImageFileProps = {...fileListProps}
            if (index === null) {
                changeFieldValue(name, {}, index)

                id = multiple ? [fileListProps[name][multipleDeleteIndex]?.uid] : [fileListProps[name][0]?.uid]

                if (multiple) {
                    deleteImageFileProps[name].splice(multipleDeleteIndex, 1)
                } else {
                    deleteImageFileProps[name] = []
                }

            }
            if (name === 'image') {
                imagesDeleteMutate({url: "/users/images", id});
            } else {
                imagesDeleteMutate({url: "/users/files", id});
            }
            setFileListProps(deleteImageFileProps)
        } else if (newFileList.length !== 0 && newFileList[newFileList.length - 1].originFileObj) {
            formData.append("image",  newFileList[newFileList.length - 1].originFileObj );
            if (name === 'image') {
                imagesUploadMutate({url: "/users/images/", data: formData});
            } else {
                imagesUploadMutate({url: "/users/files/", data: formData});
            }
            setIsUpload(name)
            setMainIndex(index)
        }

    };








    return (<div>

        {(postNewsLoading || editNewsLoading || putNewsLoading) ?
            <AppLoader/> :
            <Form
                form={form}
                name="news"
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


                <Row gutter={10}>


                    <Col span={24}>
                        <FormInput
                            required={true}
                            required_text={'Требуется название'}
                            label={'Название новости'}
                            name={'title'}
                        />
                    </Col>
                    <Col span={24}>
                        <FormTextArea
                            required={true}
                            required_text={'Требуется описание'}
                            label={'Описание новости'}
                            name={'text'}
                        />
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={`Необходимые изображения `}
                            name={'image'}
                            rules={[{required: true, message: 'Требуется изображение'}]}
                        >
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.image ? fileListProps?.image : []}
                                listType='picture-card'
                                onChange={(file) => onChangeImage(file, "image", null, false)}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.image?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>

                        <Form.Item
                            label={`Необходимые файл `}
                            name={'file'}

                        >
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.file ? fileListProps?.file : []}
                                listType='picture-card'
                                onChange={(file) => onChangeImage(file, "file", null, false)}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.file?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>


                </Row>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editNewsSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>
        }

    </div>)

}


export default NewsAddPostEdit;