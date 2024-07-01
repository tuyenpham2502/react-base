import { Button } from 'antd'
import { useEffect } from 'react'

import Test from './components/test'

import { Endpoint } from '@/core/application/common/endPoint'
import { useApiRequestHook } from '@/infrastructure/common/libs/hooks/useApiRequest.hook'
import { AuthManagementService } from '@/infrastructure/repository/auth/services/auth.service'

const LoginPage = () => {
  const [request] = useApiRequestHook()

  const handleLogin = () => {
    request(
      new AuthManagementService().loginAsync,
      Endpoint.Auth.Login,
      {
        email: '',
        password: '',
      },
      () => {
        handleTest()
      },
      () => {
        handleTest()
      }
    )
  }
  function handleTest() {
    request(
      new AuthManagementService().logoutAsync,
      Endpoint.Auth.Logout,
      {
        email: '',
        password: '',
      },
      () => {},
      () => {}
    )
  }
  useEffect(() => {
    handleLogin()
  }, [])
  return (
    <div>
      <Button
        onClick={() => {
          handleLogin()
        }}
      >
        Login
      </Button>
      <Test />
      <h1>Login Page</h1>
    </div>
  )
}

export default LoginPage
