import {Route, Routes } from "react-router-dom";
import { OrdersPage, Login } from "./pages/index.js";
import HandleAuth from "./auth/HandleAuth";

function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<HandleAuth />}>
        <Route path="/" element={<OrdersPage />} />    
      </Route>
    </Routes>
  );
}

export default App;



