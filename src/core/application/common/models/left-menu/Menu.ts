import { MenuTheme } from 'antd'

import Constants from '@/core/application/common/constants'

export default class Menu {
  constructor(
    theme: MenuTheme = Constants.AppTheme,
    key: string = '',
    defaultSelectedKeys: string[] = ['1'],
    mode: any = 'inline',
    children: any[]
  ) {
    this.theme = theme
    this.defaultSelectedKeys = defaultSelectedKeys
    this.mode = mode
    this.key = key
    this.items = children
  }
  theme: MenuTheme = Constants.AppTheme
  defaultSelectedKeys: string[] = ['1']
  key: string
  mode: any = 'inline'
  items: any[] // children of the menu
}
