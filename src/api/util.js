import request from '@/utils/request'
/**
 * 上传图片
 * @param params
 * @returns {AxiosPromise}
 */
export function addImage(image, onUploadProgress) {
  return request({
    url: '/img/upload',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onUploadProgress,
    data: image
  })
}
export function delImage(url) {
  return request({
    url: '/img/del',
    method: 'delete',
    data: url
  })
}
