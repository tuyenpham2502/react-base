import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { RecoilRoot } from 'recoil'

import { ROUTE_PATH } from '@/core/application/common/appRouters'
import RecoilOutsideComponent from '@/infrastructure/common/libs/recoil-outside/recoil.service'
import './App.css'
import { NotFound } from '@/pages/404'
import DashBoardPage from '@/pages/dashboard'
import LoginPage from '@/pages/login/login'

const RouteRoot = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_PATH.DASHBOARD} element={<DashBoardPage />} />
        <Route path={ROUTE_PATH.LOGIN} element={<LoginPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <RecoilRoot>
      <ToastContainer style={{ width: '500px' }} />
      <RecoilOutsideComponent />
      <RouteRoot />
    </RecoilRoot>
  )
}

export default App
