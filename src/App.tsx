import { RecoilRoot } from 'recoil'
import './App.css'
import { ToastContainer } from 'react-toastify'
import RecoilOutsideComponent from '@/infrastructure/common/libs/recoil-outside/recoil.service'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ROUTE_PATH } from '@/core/application/common/appRouters';
import DashBoardPage from '@/pages/dashboard';
import LoginPage from '@/pages/login/login';
import { NotFound } from '@/pages/404';

const RouteRoot = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_PATH.DASHBOARD} element={<DashBoardPage />} />
        <Route path={ROUTE_PATH.LOGIN} element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};


function App() {
  return (
    <RecoilRoot>
      <ToastContainer style={{ width: "500px", }} />
      <RecoilOutsideComponent />
      <RouteRoot />
    </RecoilRoot>
  )
}

export default App
