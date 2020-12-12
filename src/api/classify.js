import request from '@/utils/request'

export function getClassifyList(params) {
  return request({
    url: '/blog-api/admin/classify',
    method: 'get',
    params
  })
}
