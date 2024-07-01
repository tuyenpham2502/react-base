import { Button } from 'antd'
import { useEffect } from 'react'

import { Endpoint } from '@/core/application/common/endPoint'
import { useApiRequestHook } from '@/infrastructure/common/libs/hooks/useApiRequest.hook'
import { AuthManagementService } from '@/infrastructure/repository/auth/services/auth.service'

const Test = () => {
  const [request] = useApiRequestHook()

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
    handleTest()
  }, [])
  return (
    <div>
      <Button
        onClick={() => {
          handleTest()
        }}
      >
        Login
      </Button>
      <h1>Login Page</h1>
    </div>
  )
}

export default Test
