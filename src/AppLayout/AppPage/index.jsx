import {Content} from "antd/es/layout/layout";
import './index.scss'
// import { Route, Routes} from 'react-router-dom';
import {TaskList, UserProfile} from "../../page";

const AppPage = () => {
    return (
        <Content>
          <UserProfile/>
          <TaskList/>
          {/*<Routes>*/}
          {/*  <Route path='/' element={} />*/}
          {/*</Routes>*/}
        </Content>
    );
};

export default AppPage;