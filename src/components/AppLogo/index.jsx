import './index.scss'
import {useSelector} from "react-redux";
const AppLogo = () => {
    const {systemMode} = useSelector(state => state.theme)
    const {company} = useSelector(state => state.companySlice)
    return (
        <div className={'app-logo'}>

            {
                systemMode === 'dark' ?
                    <img src={company?.image_light} style={{width:'100%', height:100 , objectFit:"contain"}} alt="logo-dark"/>
                    :
                    <img src={company?.image_dark} style={{width:'100%', height:100 , objectFit:"contain"}} alt="logo-light"/>
            }
        </div>
    );
};
export default AppLogo;