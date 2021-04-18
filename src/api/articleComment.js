import request from '@/utils/request'

/**
 * 获取文章评论列表
 * @param params
 */
export function listArticleComment(params) {
  return request({
    url: '/admin/articleComment/page',
    method: 'get',
    params
  })
}

/**
 * 更新状态
 * @param id
 * @param params
 * @returns {AxiosPromise}
 */
export function uptArticleCommentStatus(id, params) {
  return request({
    url: '/admin/articleComment/uptStatus/' + id,
    method: 'put',
    params
  })
}

/**
 * 删除评论
 * @param id
 * @param params
 * @returns {AxiosPromise}
 */
export function delArticleCommentById(id) {
  return request({
    url: '/admin/articleComment/' + id,
    method: 'delete'
  })
}
