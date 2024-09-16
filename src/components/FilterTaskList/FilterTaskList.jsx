import { Col, Flex, Select, Tag } from "antd";
import React, { useMemo } from "react";
import { deadlineColor } from "../../constants/deadlineColor";

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
const FilterTaskList = ({ setOrdering, setDeadlineStatus, deadlineColorAlert , getTagCompany , setGetTagCompany }) => {
  const deadlineColorArray = useMemo(() => {
    return Object.entries(deadlineColor).map(([key, value]) => ({
      label: value.text,
      value: key,
      color: value.color,
    }));
  }, [deadlineColor]);
  const getTagCompanyArray = useMemo(() => {
    return Object.entries(getTagCompany).map(([key, value]) => ({
      label: value?.name,
      value: value?.id,
    }));
  }, [getTagCompany]);
  const onChangeDeadlineTime = (changleItem) => {
    setOrdering(changleItem);
  };
  const onChangeTagCompany = (changleItem) => {
    setGetTagCompany(changleItem);
  };
  const onChangeDeadlineStatus = (changleItem) => {
    setDeadlineStatus(changleItem.toString());
  };
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
              options={getTagCompanyArray}
              onChange={onChangeTagCompany}
          />
        </Col>
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
