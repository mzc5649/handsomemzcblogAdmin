import request from '@/utils/request'
export function addImage(image,onUploadProgress) {
  return request({
    url: '/blog-api/img/upload',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onUploadProgress,
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
