import React, {useEffect, useMemo, useState} from 'react';
import {Button, Card, Col, Form, Modal, Row, Select, Upload} from "antd";

import {useSelector} from "react-redux";
import {AppLoader, FormInput, FormTextArea} from "../../components";
import {useDeleteQuery, useEditQuery, useGetByIdQuery, useGetQuery, usePostQuery} from "../../service/query/Queries";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {PlusOutlined} from "@ant-design/icons";



const initialValueForm = {
    title: "",
    text: "",
    items: [
        {
            files: []
        }
    ]
}





const NewsAddPostEdit = ({link}) => {
    const imageInitial = {
        files: [[]],
    }
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
    } = useGetByIdQuery(false, "edit-news", editId, '/users/')
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

    // news success
    SuccessCreateAndEdit(postNewsSuccess, putNewsSuccess, link)
    // if edit news
    EditGetById(editNewsRefetch)
    // if no edit news
    SetInitialValue(form, initialValueForm)


    //edit news
    useEffect(() => {
        if (editNewsSuccess) {
            const files = editNewsData?.items?.map(item => {
                let fileEdit = []
                item.files?.map((fileId) => {
                    fileEdit.push({
                        uid: fileId?.id,
                        name: fileId?.id,
                        status: "done",
                        url: fileId.file
                    })
                })
                return fileEdit
            })


            const edit = {
                title: editNewsData.title,
                text: editNewsData.text,

                items:editNewsData.items
            }

            setFileListProps({
                files
            })
            form.setFieldsValue(edit)
        }

    }, [editNewsData])

    const onFinish = (value) => {
        const data = {
            ...value,
            items: value?.items.map((item, ind) => ({
                files: fileListProps.files[ind].map((imageId) => imageId.uid)
            })),
        }

        if (editNewsData) {
            putNews({url: '/users/', data, id: editId})
        } else {
            postNewsMutate({url: "/users/", data});
        }
    }


    // refresh page again get data
    useEffect(() => {


        const handleBeforeUnload = (event) => {
            event.preventDefault()

        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            setFileListProps(imageInitial)
            localStorage.removeItem('editDataId')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);
    // image

    const changeFieldValue = (name, value, index) => {
        if (name === 'files') {

            const getValueFiles = form.getFieldValue('items')
            if (!getValueFiles[index].files.length) {
                getValueFiles[index].files = []
            }
            getValueFiles[index].files.push(value)
            form.setFieldsValue({
                items: [
                    ...getValueFiles,
                ]
            });
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
            if (initialImage[isUpload][mainIndex]===undefined){
                initialImage[isUpload][mainIndex]=[]
            }
            initialImage[isUpload][mainIndex]?.push(uploadImg)
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
            changeFieldValue(name, {}, index)
            id = fileListProps[name][index][multipleDeleteIndex]?.uid
            deleteImageFileProps[name][index].splice(multipleDeleteIndex, 1)
            imagesDeleteMutate({url: "/users/files", id});
            setFileListProps(deleteImageFileProps)
        } else if (newFileList.length !== 0 && newFileList[newFileList.length - 1].originFileObj) {
            formData.append("image",  newFileList[newFileList.length - 1].originFileObj );
            imagesUploadMutate({url: "/users/files/", data: formData});
            setIsUpload(name)
            setMainIndex(index)
        }

    };

    const handleRemove = (name, remove, index, fileName) => {
        const deleteImage = {...fileListProps}
        const deleteImageUID = deleteImage[fileName][index]
        if (deleteImageUID) {

            deleteImage[fileName].splice(index, 1)
            const id = {
                ids: [deleteImageUID[0]?.uid]
            };
            imagesDeleteMutate({url: "/users/files", id});
            setFileListProps(deleteImage)
        }

        remove(name);
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


                    <Col span={24} style={{marginTop:20}}>

                        <Card bordered={true} >
                            <Form.List name="items">
                                {(fields, {add, remove}) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Row key={field.key} gutter={20} >


                                                <Col span={24}>

                                                    <Form.Item
                                                        label={`Необходимые изображения #${index + 1}`}
                                                        name={[field.name, 'files']}
                                                        rules={[{required: true, message: 'Требуется изображение'}]}
                                                    >
                                                        <Upload
                                                            maxCount={5}
                                                            fileList={fileListProps?.files ? fileListProps?.files[index] : []}
                                                            listType='picture-card'
                                                            onChange={(file) => onChangeImage(file, "files", index, true)}
                                                            onPreview={onPreviewImage}
                                                            beforeUpload={() => false}
                                                        >
                                                            {fileListProps?.files[index]?.length > 4 ? "" : "Upload"}
                                                        </Upload>
                                                    </Form.Item>
                                                </Col>


                                                <Col span={24}>
                                                    {index > 0 && (
                                                        <Button type="danger"
                                                                onClick={() => handleRemove(field.name, remove, index, 'files')}>
                                                            Удалить
                                                        </Button>
                                                    )}
                                                </Col>
                                            </Row>
                                        ))}

                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                                Добавить характеристику
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Card>
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