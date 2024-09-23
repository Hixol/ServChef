
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import {SocketContextProvider} from "./socket/socketContext.jsx";
import {AuthContextProvider} from "./context/authContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthContextProvider>
            <SocketContextProvider>
                <App />
            </SocketContextProvider>
        </AuthContextProvider>
    </BrowserRouter>
);
