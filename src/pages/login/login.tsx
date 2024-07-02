import { useEffect } from 'react'

import Test from './components/test'

import { useCancelToken } from '@/infrastructure/common/libs/hooks/cancelToken.hook'
import { useLoginHook } from '@/infrastructure/repository/auth/hooks/useLogin.hook'
import { useLogoutHook } from '@/infrastructure/repository/auth/hooks/useLogout.hook'

const LoginPage = () => {
  useCancelToken()

  const [requestLogin] = useLoginHook()
  const [requestLogout] = useLogoutHook()

  const handleLogin = () => {
    requestLogin(
      {
        email: '',
        password: '',
      },
      () => {
        // handleTest()
      },
      () => {
        // handleTest()
      }
    )
  }
  function handleTest() {
    requestLogout(
      {
        email: '',
        password: '',
      },
      () => {
        // handleTest()
      },
      () => {
        // handleTest()
      }
    )
  }
  useEffect(() => {
    handleLogin()
    handleTest()
  }, [])
  useEffect(() => {}, [])

  return (
    <div>
      {/* <Button
        onClick={() => {
          handleLogin()
          handleTest()
        }}
      >
        Login
      </Button> */}
      <Test />
      <h1>Login Page</h1>
    </div>
  )
}

export default LoginPage
