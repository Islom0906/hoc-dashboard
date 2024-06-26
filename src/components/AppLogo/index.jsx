import './index.scss'
import {useSelector} from "react-redux";
import logo from './logo.svg'

const AppLogo = () => {
    const {systemMode} = useSelector(state => state.theme)
    return (
        <div className={'app-logo'}>

            {
                systemMode === 'dark' ?
                    <img src={logo} alt="logo-dark"/>
                    :
                    <img src={logo} alt="logo-light"/>
            }
        </div>
    );
};

export default AppLogo;