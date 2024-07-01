import { Breadcrumb } from 'antd'
import { _t } from 'src/infrastructure/utils/helpers'

interface IBreadcrumb {
  link?: string
  name: string
}
type Props = {
  items: IBreadcrumb[]
}

export const BreadcrumbUI = (props: Props) => {
  const { items } = props
  return (
    <Breadcrumb separator='>'>
      {items.map((it, idx) => {
        if (it.link) {
          return (
            <Breadcrumb.Item key={idx}>
              <a href={it.link}>{_t(it.name)}</a>
            </Breadcrumb.Item>
          )
        }
        return <Breadcrumb.Item key={idx}>{_t(it.name)}</Breadcrumb.Item>
      })}
    </Breadcrumb>
  )
}
