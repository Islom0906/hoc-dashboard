import AppLayout from "./AppLayout";
import {Provider} from 'react-redux'
import {store} from './store'
import AuthProvider from "./page/auth/AuthProvider/AuthProvider";

function App() {


    return (
        <Provider store={store}>
            <AuthProvider>
                <AppLayout/>
            </AuthProvider>
        </Provider>
    );
}

export default App;
