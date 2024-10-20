import React, {useEffect, useMemo, useState} from 'react';
import {Button, Card, Col, Form, Modal, Row, Select, Upload} from "antd";
import {AppLoader, FormInput, FormTextArea} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {useDeleteQuery, useEditQuery, useGetByIdQuery, useGetQuery, usePostQuery} from "../../service/query/Queries";
import {PlusOutlined} from "@ant-design/icons";
import InboxCategoryPostEdit from "./category/inboxCategoryPostEdit";


const initialValueForm = {
    title: "",
    text: "",
    category: "",
    items: [
        {
            comment: "",
            files: []
        }
    ]
}

const InboxPostEdit = () => {
    const imageInitial = {
        files: [[]],
    }
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [fileListProps, setFileListProps] = useState(imageInitial);
    const [isUpload, setIsUpload] = useState("")
    const [mainIndex, setMainIndex] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    // query-company-get
    const {
        data: categortInboxData,
        refetch: categortInboxFetch
    } = useGetQuery(false, 'get-category-inbox', '/users/inbox-category', false)
    // query-inbox
    const {
        mutate: postInboxMutate,
        isLoading: postInboxLoading,
        isSuccess: postInboxSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editInboxLoading,
        data: editInboxData,
        refetch: editInboxRefetch,
        isSuccess: editInboxSuccess
    } = useGetByIdQuery(false, "edit-inbox", editId, '/users/inbox')
    // put-query
    const {
        mutate: putInbox,
        isLoading: putInboxLoading,
        isSuccess: putInboxSuccess
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

    // inbox success
    SuccessCreateAndEdit(postInboxSuccess, putInboxSuccess, '/inbox')
    // if edit inbox
    EditGetById(editInboxRefetch)
    // if no edit inbox
    SetInitialValue(form, initialValueForm)

    useEffect(() => {
        categortInboxFetch()
    }, []);
    //edit inbox
    useEffect(() => {
        if (editInboxSuccess) {
            const files = editInboxData?.items?.map(item => {
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
                title: editInboxData.title,
                text: editInboxData.text,
                category: editInboxData.category,

                items:editInboxData.items
            }

            setFileListProps({
                files
            })
            form.setFieldsValue(edit)
        }

    }, [editInboxData])

    const onFinish = (value) => {
        const data = {
            ...value,
            items: value?.items.map((item, ind) => ({
                ...item,
                files: fileListProps.files[ind].map((imageId) => imageId.uid)
            })),
        }

        if (editInboxData) {
            putInbox({url: '/users/inbox', data, id: editId})
        } else {
            postInboxMutate({url: "/users/inbox/", data});
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


    // option category
    const optionsCategory = useMemo(() => {
        return categortInboxData?.map((option) => {
            return {
                value: option?.id,
                label: option?.name,
            };
        });
    }, [categortInboxData]);


    const addCategory = () => {
        setIsModalOpen(true)
    }
    const handelClose = () => {
        setIsModalOpen(false)
    }

    return (<div>

        {(postInboxLoading || editInboxLoading || putInboxLoading) ?
            <AppLoader/> :
            <Form
                form={form}
                name="inbox"
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


                    <Col span={24}>
                        <FormInput
                            required={true}
                            required_text={'Требуется название'}
                            label={'Название папки «Избранный»'}
                            name={'title'}
                        />
                    </Col>
                    <Col span={24}>
                        <FormTextArea
                            required={true}
                            required_text={'Требуется описание'}
                            label={'Описание папки «Избранный»'}
                            name={'text'}
                        />
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={'Категория'}
                            name={'category'}
                            rules={[{
                                required: true, message: 'Выберите категория'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите одну категория'
                                optionLabelProp='label'
                                options={optionsCategory}
                            />
                        </Form.Item>
                    </Col>
                    <Col  span={24}>
                        <Button
                            htmlType={"button"}
                            type='primary'
                            icon={<PlusOutlined/>}
                            style={{width: '100%'}}
                            onClick={addCategory}>
                            Создать категорию
                        </Button>
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
                                                    label={`Необходимые изображения и файлы #${index + 1}`}
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
                                                <FormInput
                                                    required={true}
                                                    required_text="Требуется комментарий"
                                                    label={`Комментарий #${index + 1}`}
                                                    name={[field.name, "comment"]}
                                                />
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
                    {editInboxSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>
        }
        <Modal title={'Категория'} open={isModalOpen} footer={null} onCancel={handelClose}>
            <InboxCategoryPostEdit setIsModalOpen={setIsModalOpen} categoryRefetch={categortInboxFetch} link={'/inbox-add'}/>
        </Modal>
    </div>)

}


export default InboxPostEdit;