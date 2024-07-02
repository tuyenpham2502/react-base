import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Pagination, Select } from 'antd'

import Constants from '@/core/application/common/constants'
import { _t } from '@/infrastructure/utils/translation'

export const PaginationSearchJira = ({
  total,
  currentPage = 1,
  onChangePage = () => {},
  pageSize = Constants.PaginationConfigs.Size,
  onChangeSize = () => {},
  disabled = false,
}: any) => {
  return (
    <div className='w-full flex justify-between gap-2 container-pagination'>
      <Pagination
        current={currentPage}
        total={total}
        showSizeChanger={false}
        pageSize={pageSize}
        onChange={onChangePage}
      />
      <div className='flex gap-2'>
        <div className='m-auto text-15' style={{ color: '#1E2028' }}>
          {_t('Show')}
        </div>
        <div className='select-page-size'>
          <Select
            value={pageSize}
            showSearch
            className='w-full'
            onChange={onChangeSize}
            disabled={disabled}
            getPopupContainer={(trigger) => trigger.parentNode}
          >
            {Constants.PaginationConfigs.PageSizeListSearchJira.map((item, index) => {
              return (
                <Select.Option key={index} value={item.value} title={item.label}>
                  {item.label}
                </Select.Option>
              )
            })}
          </Select>
        </div>
        {/* <div className="m-auto text-15" style={{ color: "#1E2028" }}>{`${currentPage * pageSize - pageSize + 1} - ${currentPage * pageSize > total ? pageSize : (currentPage * pageSize)} of ${total}`}</div> */}
      </div>
    </div>
  )
}

export const PaginationUI = ({
  total,
  link = '',
  currentPage = 1,
  onChangePage = () => {},
  pageSize = Constants.PaginationConfigs.Size,
  onChangeSize = () => {},
  disabled = false,
}: any) => {
  return (
    <div className='w-full flex justify-between gap-2 container-pagination'>
      <Pagination
        itemRender={(page: any, type: any, originalElement: any) => {
          if (link) {
            let href = new URL(link)
            href.searchParams.set('page', page.toString())
            if (type === 'page') {
              return (
                <a href={href.toString()} key={page} onClick={(e) => e.preventDefault()}>
                  {' '}
                  {page}{' '}
                </a>
              )
            }
            // return <a  href={href.toString()} key={page} onClick={(e) => e.preventDefault()}> {originalElement} </a>;
          }
          return originalElement
        }}
        current={currentPage}
        total={total}
        showSizeChanger={false}
        pageSize={pageSize}
        onChange={onChangePage}
      />
      <div className='flex gap-2'>
        <div className='m-auto text-15' style={{ color: '#1E2028' }}>
          {_t('Show')}
        </div>
        <div className='select-page-size'>
          <Select
            value={pageSize}
            showSearch
            className='w-full'
            onChange={onChangeSize}
            disabled={disabled}
            getPopupContainer={(trigger) => trigger.parentNode}
          >
            {Constants.PaginationConfigs.PageSizeList.map((item, index) => {
              return (
                <Select.Option key={index} value={item.value} title={item.label}>
                  {item.label}
                </Select.Option>
              )
            })}
          </Select>
        </div>
        {/* <div className="m-auto text-15" style={{ color: "#1E2028" }}>{`${currentPage * pageSize - pageSize + 1} - ${currentPage * pageSize > total ? pageSize : (currentPage * pageSize)} of ${total}`}</div> */}
        <div className='m-auto text-15' style={{ color: '#1E2028' }}>
          {total ? `${_t('Total')} ${total}` : ''}
        </div>
      </div>
    </div>
  )
}

export const PaginationAWS = ({
  currentPage = 1,
  pageSize = Constants.PaginationConfigs.Size,
  onChangeSize = () => {},
  disabled = false,
  onPreviousPage = () => {},
  onNextPage = () => {},
  paginationToken,
}: any) => {
  return (
    <div className='w-full flex justify-between gap-2 container-pagination'>
      <div className='flex gap-2 items-center'>
        <Button
          className='btn-previous-next'
          icon={<LeftOutlined />}
          onClick={onPreviousPage}
          disabled={currentPage === 1 && true}
        ></Button>
        {/* <Button
                    className="btn-previous-next"
                    icon={<LeftOutlined />}
                    onClick={onPreviousPage}
                >
                    {currentPage}
                </Button> */}
        <div className='btn-active flex items-center justify-center'>{currentPage}</div>
        <Button
          className='btn-previous-next'
          onClick={onNextPage}
          icon={<RightOutlined />}
          disabled={paginationToken ? false : true}
        ></Button>
      </div>
      <div className='flex gap-2'>
        <div className='m-auto text-15' style={{ color: '#1E2028' }}>
          {_t('Show')}
        </div>
        <div className='select-page-size'>
          <Select
            value={pageSize}
            showSearch
            className='w-full'
            onChange={onChangeSize}
            disabled={disabled}
            getPopupContainer={(trigger) => trigger.parentNode}
          >
            {Constants.PaginationConfigs.PageSizeList.map((item, index) => {
              return (
                <Select.Option key={index} value={item.value} title={item.label}>
                  {item.label}
                </Select.Option>
              )
            })}
          </Select>
        </div>
        <div
          className='m-auto text-15'
          style={{ color: '#1E2028' }}
        >{`${currentPage * pageSize - pageSize + 1} - ${currentPage * pageSize}`}</div>
      </div>
    </div>
  )
}
