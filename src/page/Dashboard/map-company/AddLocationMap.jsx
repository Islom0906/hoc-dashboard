import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Row, Select} from "antd";
import L from 'leaflet';
import {AppLoader, FormInput, FormInputNumber} from "../../../components";
import {useSelector} from "react-redux";
import {EditGetById,  SetInitialValue, SuccessCreateAndEdit} from "../../../hooks";
import { useEditQuery, useGetByIdQuery, usePostQuery} from "../../../service/query/Queries";
import {MapContainer, Marker, TileLayer, useMap, useMapEvents} from "react-leaflet";
import 'leaflet/dist/leaflet.css';


const initialValueForm = {
  nameRu:"",
  nameUz:"",
  addressRu:"",
  addressUz:"",
  workingTime:"",
  tel:"",
  latlng:[],
  link:""
};

function SetViewOnClick({ coords }) {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
}

const AddLocationMap = ({setIsModalOpen}) => {
  const [form] = Form.useForm();
  const {editId} = useSelector(state => state.query)
  const [position, setPosition] = useState([40.7821 ,72.3500])
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
    iconSize: [30, 30]
  });
  // query-map
  const {
    mutate: postMapMutate,
    isLoading: postMapLoading,
    isSuccess: postMapSuccess
  } = usePostQuery()
  // query-edit
  const {
    isLoading: editMapLoading,
    data: editMapData,
    refetch: editMapRefetch,
    isSuccess: editMapSuccess
  } = useGetByIdQuery(false, "edit-map", editId, '/map')
  // put-query
  const {
    mutate: putMapHome,
    isLoading: putMapHomeLoading,
    isSuccess: putMapHomeSuccess
  } = useEditQuery()


  // ================================ useEffect =============================

  // map success
  SuccessCreateAndEdit(postMapSuccess, putMapHomeSuccess, '/dashboard')
  // if edit map
  EditGetById(editMapRefetch)
  // if no edit map
  SetInitialValue(form, initialValueForm)


  //edit map
  useEffect(() => {
    if (editMapSuccess) {
      const edit = {
        nameRu:editMapData.nameRu,
        nameUz:editMapData.nameUz,
        addressRu:editMapData.addressRu,
        addressUz:editMapData.addressUz,
        workingTime:editMapData.workingTime,
        tel:editMapData.tel,
        latlng:[editMapData.lat,editMapData.lng],
        link:editMapData.link
      }
      setPosition([Number(editMapData.lat),Number(editMapData.lng)])
      form.setFieldsValue(edit)
      setIsModalOpen(false)
    }
  }, [editMapData])

  const onFinish = (value) => {

    const data = {
      nameUz:value.name,
      addressRu:value.address,
      workingTime:value.workingTime,
      tel:`${value.tel}`,
      lat:`${value.latlng[0]}`,
      lng:`${value.latlng[1]}`,
      link:value.link
    }

    if (editMapData) {
      putMapHome({url: '/map', data, id: editId})
    } else {
      postMapMutate({url: "/map", data});
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
  return (<div>
    {(postMapLoading || editMapLoading || putMapHomeLoading) ?
        <AppLoader/> :
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
                  required_text={'Ввод названия филиала обязателен!'}
                  label={'Название филиала'}
                  name={'name'}
              />
            </Col>
            <Col span={12}>
              <FormInput
                  required={true}
                  required_text={'Адрес'}
                  label={'Требуется адрес!'}
                  name={'address'}
              />
            </Col>

            <Col span={12}>
              <FormInput
                  required={true}
                  required_text={'Необходимо ввести часы работы'}
                  label={'Рабочее время'}
                  name={'workingTime'}
              />
            </Col>
            <Col span={12}>
              <FormInputNumber
                  required={true}
                  required_text={'Требуется номер телефона!'}
                  label={'Номер телефона'}
                  name={'tel'}
              />
            </Col>
            <Col span={24}>
              <FormInput
                  required={true}
                  required_text={'Требуется cсылка на сайт!'}
                  label={'Ссылка на сайт'}
                  name={'link'}
              />
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
            {editMapSuccess ? 'Изменить' : 'Создать'}
          </Button>
        </Form>}
  </div>);
};

export default AddLocationMap;