import request from '@/utils/request'

export function getClassifyList(params) {
  return request({
    url: '/admin/classify',
    method: 'get',
    params
  })
}
export function addClassiy(data) {
  return request({
    url: '/admin/classify',
    method: 'post',
    data: data
  })
}
