import AppLayout from "./AppLayout";
import {ConfigProvider, theme} from "antd";
import {configDark,configLight} from "./constants/theme";
import {useState} from "react";

function App() {
    const [isDark, setIsDark] = useState(true)
      const {defaultAlgorithm,darkAlgorithm}=theme

    return (
        <div>
            <ConfigProvider theme={{
                algorithm:isDark? darkAlgorithm:defaultAlgorithm,
                token:isDark? configDark:configLight,
            }}>
                <AppLayout/>
            </ConfigProvider>
        </div>
    );
}

export default App;
