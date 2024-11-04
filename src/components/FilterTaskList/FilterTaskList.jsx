import { Col, Flex, Select, Tag } from "antd";
import React, {useEffect, useMemo} from "react";
import { deadlineColor } from "../../constants/deadlineColor";
import {selectStaffIDs} from "../../store/slice/staffSlice";
import {useDispatch, useSelector} from "react-redux";

const deadlineTime = [
  {
    label: 'Предстоящие',
    value: '-deadline',
  },
  {
    label: 'Ближайшие',
    value: 'deadline',
  },
  {
    label: 'Новые',
    value: '',
  },
];
const FilterTaskList = ({ setOrdering, setDeadlineStatus, deadlineColorAlert , getTagCompany , setGetTagCompany ,getStaffForModuls =[] }) => {
  const dispatch = useDispatch()

  const {staffIDs} = useSelector(state => state.staffSlice)
  const deadlineColorArray = useMemo(() => {
    return Object.entries(deadlineColor).map(([key, value]) => ({
      label: value.text,
      value: key,
      color: value.color,
    }));
  }, [deadlineColor]);
  const getTagCompanyArray = useMemo(() => {
    return Object.entries(getTagCompany).map(([key, value]) => ({
      label: `${value?.title} (${value?.count})`,
      value: value?.id,
    }));
  }, [getTagCompany]);
  const getModulsArray = useMemo(() => {
    return Object.entries(getStaffForModuls).map(([ key , value]) => ({
      label: `${value?.full_name} ${value?.position}`,
      value: value?.id,
    }));
  }, [getStaffForModuls ,staffIDs]);

  const onChangeDeadlineTime = (changleItem) => {
    setOrdering(changleItem.toString());
  };
  const onChangeTagCompany = (changleItem) => {
    setGetTagCompany(changleItem);
  };
  const onChangeDeadlineStatus = (changleItem) => {
    setDeadlineStatus(changleItem.toString());
  };


  const onChangeModulsStaff = (changleItem) => {
    dispatch(selectStaffIDs(changleItem))
  }
  const getStaffIDs = useMemo(() => {
    let user = ''
    if(staffIDs) {
        user = ''
      return user
    }else {
      user = getStaffForModuls.filter((item) => item?.id === staffIDs)
      return {
        label: `${user[0]?.full_name} ${user[0]?.roles[0]?.position}`,
        value: user[0]?.id,
      }
    }

  }, [staffIDs]);

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const color = deadlineColor[value]?.color;
    return (
        <Tag
            color={color}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
        >
          {label}
        </Tag>
    );
  };
  return (
      <>
        {deadlineColorAlert && (
            <Col span={24}>
              <p style={{ marginBottom: 15,}}>Ситуации задач:</p>
              <Flex gap={10} >
                {deadlineColorArray?.map((colorName) => (
                    <Flex key={colorName.label} gap={5} align={'start'}>
                      <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '100%',
                            backgroundColor: colorName.color,
                          }}
                      />
                      <p>{colorName?.label}</p>
                    </Flex>
                ))}
              </Flex>
            </Col>
        )}

        <Col span={6}>
          <label htmlFor="selectCompany">
            <p style={{ fontSize: '14px', marginBottom: 10 }}>Выберите компанию:</p>
          </label>
          <Select
              id="selectCompany"
              mode="multiple"
              allowClear

              style={{ width: '100%' }}
              placeholder="Выберите компанию"
              optionLabelProp="label"
              options={getTagCompanyArray  || []}
              onChange={onChangeTagCompany}
          />
        </Col>
        {
            getStaffForModuls.length > 0 &&
            <Col span={6}>
              <label htmlFor="selectModulsStaff">
                <p style={{ fontSize: '14px', marginBottom: 10 }}>Сотрудники:</p>
              </label>
              <Select
                  id="selectModulsStaff"
                  style={{ width: '100%' }}
                  mode="multiple"
                  value={staffIDs? staffIDs:[]}
                  placeholder="Сотрудники"
                  optionLabelProp="label"
                  options={getModulsArray || []}
                  onChange={onChangeModulsStaff}
              />
            </Col>
        }

        <Col span={6}>
          <label htmlFor="deadlineTimeSelect">
            <p style={{ fontSize: '14px', marginBottom: 10 }}>по времени Крайнего срока:</p>
          </label>
          <Select
              id="deadlineTimeSelect"
              style={{ width: '100%' }}
              placeholder="по времени Крайнего срока"
              optionLabelProp="label"
              options={deadlineTime}
              onChange={onChangeDeadlineTime}
          />
        </Col>
        <Col span={6}>
          <label htmlFor="deadlineColorSelect">
            <p style={{ fontSize: '14px', marginBottom: 10 }}>Цвет крайнего срока:</p>
          </label>
          <Select
              id="deadlineColorSelect"
              style={{ width: '100%' }}
              mode="multiple"
              placeholder="Цвет крайнего срока"
              optionLabelProp="label"
              options={deadlineColorArray}
              onChange={onChangeDeadlineStatus}
              tagRender={tagRender}
              // dropdownRender={dropdownRender}
          />
        </Col>

      </>
  );
};

export default FilterTaskList;
