import {useGetQuery} from "../../../../service/query/Queries";
import {useEffect} from "react";
import {Card, Flex, Spin, Typography} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {selectCompany} from "../../../../store/slice/companySlice";

const SelectCompany = () => {
  const {systemMode}=useSelector(state => state.theme)
  const {data:companies,isLoading:getCompaniesLoading,refetch:refetchCompanies}=useGetQuery(false,'company-get','/users/companies/',false)
  const dispatch = useDispatch()
  const { Title , Text } = Typography;
  useEffect(() =>{
    refetchCompanies()
  } , [])


  const onSelectCompany = (company) => {
    dispatch(selectCompany(company))
  }
  return(
        <Spin spinning={getCompaniesLoading}>
          <Flex  vertical={true} style={{minHeight:'100vh' , padding:'70px' , width:'100%'}}>
            <Flex justify={"center"} style={{marginBottom:'10%'}}>
              <Title level={1} style={{textAlign:"center"}}>
                Head of Companies
              </Title>
            </Flex>
            <Flex justify={"space-between"} wrap={true}  >
              {
                companies?.map(company => (
                    <Card hoverable key={company?.id} size={"small"}>
                      <Flex vertical={true} gap={5}   onClick={ ()=> onSelectCompany(company)}>
                        {
                          systemMode === 'light' ?
                              <img src={company?.image_light} className={'logo'} alt={'company light'}
                                   style={{width: '200px', height: '200px', objectFit: 'contain'}}/>
                              :
                              <img src={company?.image_dark} className={'logo'} alt={'company dark'}
                                   style={{width: '200px', height: '200px', objectFit: 'contain'}}/>
                        }
                        <Text style={{textAlign:"center"}}>
                          {
                            company?.title
                          }
                        </Text>
                      </Flex>
                    </Card>
                ))
              }
            </Flex>
          </Flex>
        </Spin>
  )
}
export default SelectCompany