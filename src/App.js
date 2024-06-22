import AppLayout from "./AppLayout";
import {Provider} from 'react-redux'
import {store} from './store'
import AuthProvider from "./page/auth/AuthProvider/AuthProvider";
import {BrowserRouter as Router} from 'react-router-dom';

function App() {


    return (
        <Provider store={store}>
            <Router>

            <AuthProvider>
                <AppLayout/>
            </AuthProvider>
            </Router>
        </Provider>
    );
}

export default App;
