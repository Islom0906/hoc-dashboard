import { Col, Select } from "antd";
import React, { useEffect, useMemo } from "react";
import { useGetQuery } from "../../service/query/Queries";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { selectCompany } from "../../store/slice/companySlice";

const FilterCompanyForAdmin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const companyID = useSelector((state) => state.companySlice.companyID);
  const {data:{user}}=useSelector(state => state.auth)

  const {
    data: getCompany,
    refetch: refetchGetCompany,
  } = useGetQuery(false, "get-company", "/users/companies/", false);

  useEffect(() => {
    if(user?.roles[0]?.role.name === 'admin') {
      refetchGetCompany();
    }else {
      // dispatch(selectCompany(id))
    }
    return () => {
      queryClient.removeQueries();
    };
  }, []);



  const optionsCompany = useMemo(() => {
    return getCompany?.map((option) => {
      return {
        value: option?.id,
        label: option?.title,
      };
    });
  }, [getCompany]);

  const onChangeCompany = (id) => {
    dispatch(selectCompany(id));
  };

  return (
      <Col span={6}>
        <Select
            style={{
              width: "100%",
            }}
            placeholder="Выберите компанию"
            optionLabelProp="label"
            options={optionsCompany}
            onChange={onChangeCompany}
            value={companyID}
        />
      </Col>
  );
};

export default FilterCompanyForAdmin;
