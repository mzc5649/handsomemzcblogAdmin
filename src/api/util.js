import request from '@/utils/request'
export function addImage(image) {
  return request({
    url: '/blog-api/img/upload',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' }, // 请求头，发送FormData格式的数据，必须是 这种请求头。
    data: image
  })
}
export function delImage(url) {
  return request({
    url: '/blog-api/img/del',
    method: 'delete',
    data: url
  })
}
