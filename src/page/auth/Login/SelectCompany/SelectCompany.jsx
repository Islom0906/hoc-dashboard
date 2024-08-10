import {Card, Flex, Spin, Typography} from "antd";
import { useSelector} from "react-redux";

const SelectCompany = () => {
  const {systemMode}=useSelector(state => state.theme)
  const { Title , Text } = Typography;
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
                        <Text style={{textAlign: "center"}}>
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