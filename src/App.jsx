import {  Route, Routes } from "react-router-dom";
import { Profile, Login } from "./pages";
import HandleAuth from "./auth/HandleAuth";





function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<HandleAuth />}>
        <Route path="/" element={<Profile />} />
        
          
      </Route>
    </Routes>
  );
}

export default App;
