import '@/styles/css/common/input.css'

type Props = {
  isError: boolean
  message: string
}
export const MessageError = (props: Props) => {
  const { isError, message } = props
  return (
    <div className='message-error'>
      {isError === true && message && message.length ? (
        <div className='message'>{message}</div>
      ) : null}
    </div>
  )
}
