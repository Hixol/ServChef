
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import {SocketContextProvider} from "./socket/socketContext.jsx";
import {AuthContextProvider} from "./context/authContext.jsx";
import {ThemeProvider} from "@mui/material";
import theme from "./theme/themeConfig";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthContextProvider>
            <SocketContextProvider>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>
            </SocketContextProvider>
        </AuthContextProvider>
    </BrowserRouter>
);
