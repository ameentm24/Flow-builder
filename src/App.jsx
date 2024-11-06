import "./App.css";

import { Routes, Route } from "react-router-dom";

import UserSignup from "./Pages/Signup";
import UserLogin from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import FlowCreater from "./Pages/FlowCreater";
import PageNotFound from "./Pages/PageNotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/" element={<UserLogin />} />
        <Route path="/user/dashboard/:userid" element={<Dashboard />} />
        <Route path="/user/flow/:flowid" element={<FlowCreater />} />
        <Route path="*" element={<PageNotFound />} />     
      </Routes>
    </>
  );
}

export default App;
