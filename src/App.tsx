import { RecoilRoot } from 'recoil'
import './App.css'
import { ToastContainer } from 'react-toastify'
import RecoilOutsideComponent from '@/infrastructure/common/libs/recoil-outside/recoil.service'
import { BrowserRouter, Routes } from 'react-router-dom';

const RouteRoot = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path={ROUTE_PATH.HOME} element={<HomePage />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
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
