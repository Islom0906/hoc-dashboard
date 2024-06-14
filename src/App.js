import AppLayout from "./AppLayout";
import {ConfigProvider} from "antd";
import {theme} from "./constants/theme";

function App() {
    return (
        <div>
            <ConfigProvider theme={theme}>
                <AppLayout/>
            </ConfigProvider>
        </div>
    );
}

export default App;
