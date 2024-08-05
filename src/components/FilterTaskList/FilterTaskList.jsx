import {Col, Flex, Select} from "antd";
import React, {useMemo} from "react";
import {deadlineColor} from "../../constants/deadlineColor";

const deadlineTime = [
  {
    label: '-deadline',
    value: '-deadline',
  },
  {
    label: 'deadline',
    value: 'deadline',
  },
  {
    label: 'странный',
    value: '',
  },
]

const FilterTaskList = ({setOrdering ,setDeadlineStatus , deadlineColorAlert}) => {

  const deadlineColorArray = useMemo(() => {
    return    Object.entries(deadlineColor).map(([key, value]) => ({
      label: key,
      value: key,
      color: value.color
    }));

  } , [deadlineColor])

  const onChangeDeadlineTime = (changleItem) => {
      setOrdering(changleItem)
  }
  const onChangeDeadlineStatus = (changleItem) => {
      setDeadlineStatus(changleItem.toString())

  }
  return (
     <>
       <Col span={6}>
         <label htmlFor="deadlineTimeSelect" ><p style={{fontSize:'14px' , marginBottom:10}}>по времени Крайнего срока:</p></label>
         <Select
             id="deadlineTimeSelect"
             style={{
               width: '100%',
             }}
             placeholder='по времени Крайнего срока'
             optionLabelProp='label'
             options={deadlineTime}
             onChange={onChangeDeadlineTime}
         />
       </Col>
       <Col span={6}>
         <label htmlFor="deadlineColorSelect" >
           <p style={{fontSize:'14px' , marginBottom:10}}>Цвет крайнего срока:</p></label>
         <Select
             id="deadlineColorSelect"
             style={{
               width: '100%',
             }}
             mode="multiple"
             placeholder='Цвет крайнего срока'
             optionLabelProp='label'
             options={deadlineColorArray}
             onChange={onChangeDeadlineStatus}
         />
       </Col>
       {
           deadlineColorAlert &&
           <Col span={12} >
             <p  style={{marginBottom:15 , textAlign:"end"}}>
               Ситуации задач:
             </p>
             <Flex gap={10} justify={"end"}>
               {
                 deadlineColorArray?.map(colorName => (
                     <Flex key={colorName.label} gap={5} align={'start'} >
                       <div  style={{width:20, height:20 , borderRadius:'100%', backgroundColor:colorName.color}}/>
                       <p>
                         {colorName?.label}
                       </p>
                     </Flex>
                 ))
               }
             </Flex>
           </Col>
       }
     </>
  );
};

export default FilterTaskList;
