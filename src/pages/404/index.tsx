import { Result } from 'antd'

import { _t } from '@/infrastructure/utils/helpers'

export const NotFound = () => {
  return (
    <Result
      icon={<></>}
      style={{ width: '100%' }}
      status='404'
      title='404'
      subTitle={_t('Not Found')}
    />
  )
}
