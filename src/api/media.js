import request from '@/utils/request'

/**
 * 获取媒体信息列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getMediaList(params) {
  return request({
    url: '/admin/media/all',
    method: 'get',
    params
  })
}
