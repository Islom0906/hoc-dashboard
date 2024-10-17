import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Row, Upload} from "antd";
import L from 'leaflet';
import {AppLoader, FormInput} from "../../../components";
import {useSelector} from "react-redux";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../../hooks";
import {useDeleteQuery, useEditQuery, useGetByIdQuery, usePostQuery} from "../../../service/query/Queries";
import {MapContainer, Marker, TileLayer, useMap, useMapEvents} from "react-leaflet";
import 'leaflet/dist/leaflet.css';


const initialValueForm = {
  title: "",
  latlng: "",
  image: ""
};

function SetViewOnClick({ coords }) {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
}

const AddLocationMap = () => {
  const imageInitial = {
    image: []
  }
  const [form] = Form.useForm();
  const {editId} = useSelector(state => state.query)
  const [position, setPosition] = useState([40.7821 ,72.3500])
  const [fileListProps, setFileListProps] = useState(imageInitial);
  const [isUpload, setIsUpload] = useState("")
  const [mainIndex, setMainIndex] = useState(null)

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const latlng=[e.latlng.lat,e.latlng.lng]
        form.setFieldsValue({latlng})
        setPosition(latlng)
      },
    });

    return null;
  };


  const customIcon = new L.Icon({
    iconUrl: '/location.png',
    iconSize: [20, 20]
  });
  // query-map
  const {
    mutate: postOfficeMutate,
    isLoading: postOfficeLoading,
    isSuccess: postOfficeSuccess
  } = usePostQuery()
  // query-edit
  const {
    isLoading: editOfficeLoading,
    data: editOfficeData,
    refetch: editOfficeRefetch,
    isSuccess: editOfficeSuccess
  } = useGetByIdQuery(false, "edit-map", editId, '/users/offices')
  // put-query
  const {
    mutate: putOfficeHome,
    isLoading: putOfficeHomeLoading,
    isSuccess: putOfficeHomeSuccess
  } = useEditQuery()
  // post image
  const {
    mutate: imagesUploadMutate,
    isSuccess: imagesUploadSuccess,
    data: imagesUpload
  } = usePostQuery()

  //delete image
  const {mutate: imagesDeleteMutate} = useDeleteQuery()

  // ================================ useEffect =============================

  // map success
  SuccessCreateAndEdit(postOfficeSuccess, putOfficeHomeSuccess, '/press-center')
  // if edit map
  EditGetById(editOfficeRefetch)
  // if no edit map
  SetInitialValue(form, initialValueForm)


  //edit map
  useEffect(() => {
    if (editOfficeSuccess) {
      const image = [{
        uid: editOfficeData?.image?.id,
        name: editOfficeData?.image?.id,
        status: "done",
        url: editOfficeData?.image?.image
      }];
      const edit = {
        title:editOfficeData.title,
        latlng:[editOfficeData.latitude,editOfficeData.longitude],
        image
      }
      setPosition([Number(editOfficeData.latitude),Number(editOfficeData.longitude)])
      form.setFieldsValue(edit)
      setFileListProps({
         image
      })
    }
  }, [editOfficeData])

  const onFinish = (value) => {
    const getFileUid = (file) => (Array.isArray(file) ? file[0]?.uid : file?.uid);

    const data = {
      title:value.title,
      latitude:`${value.latlng[0]}`,
      longitude:`${value.latlng[1]}`,
      image: getFileUid(fileListProps.image),

    }

    if (editOfficeData) {
      putOfficeHome({url: '/users/offices', data, id: editId})
    } else {
      postOfficeMutate({url: "/users/offices/", data});
    }
  }


  // refresh page again get data
  useEffect(() => {
    const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
    if (storedValues) {
      form.setFieldsValue(storedValues);
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
      imagesDeleteMutate({url: "/users/images", id});

      setFileListProps(deleteImageFileProps)
    } else if (newFileList.length !== 0 && newFileList[newFileList.length - 1].originFileObj) {
      formData.append("image", newFileList[newFileList.length - 1].originFileObj);
      imagesUploadMutate({url: "/users/images/", data: formData});

      setIsUpload(name)
      setMainIndex(index)
    }

  };

  return (<div>
    {(postOfficeLoading || editOfficeLoading || putOfficeHomeLoading) ?
        <AppLoader/> :
        <Form
            form={form}
            name="map"
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
                  required_text={'Ввод названия филиала обязателен!'}
                  label={'Название филиала'}
                  name={'title'}
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


            <Col span={24} >
              <MapContainer style={{height:'300px',cursor:'pointer'}} center={position.length>0 ? position:[40.7821, 72.3500]} zoom={5} scrollWheelZoom={true} >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker/>
                <SetViewOnClick coords={position.length>0 ? position:[40.7821, 72.3500]}/>
                {
                    <Marker position={position} icon={customIcon}></Marker>
                }
              </MapContainer>
              <Form.Item
                  label=""
                  name="latlng"
                  rules={[
                    {
                      required: true,
                      message: "Разметка карты обязательна"
                    }
                  ]}
              >



              </Form.Item>
            </Col>
          </Row>


          <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
            {editOfficeSuccess ? 'Изменить' : 'Создать'}
          </Button>
        </Form>}
  </div>);
};

export default AddLocationMap;