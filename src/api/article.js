import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取文章列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getArticleList(params) {
  return request({
    url: '/admin/article',
    method: 'get',
    params
  })
}
/**
 * 获取审核文章列表
 * @param params
 * @returns {AxiosPromise}
 */
export function listArticleOfExamine(params) {
  return request({
    url: '/admin/article/examine',
    method: 'get',
    params
  })
}
/**
 * 删除文章
 * @param params
 * @returns {AxiosPromise}
 */
export function delArticle(id) {
  return request({
    url: '/admin/article/' + id,
    method: 'delete'
  })
}
/**
 * 获取文章根据id
 * @param params
 * @returns {AxiosPromise}
 */
export function getArticleById(id) {
  return request({
    url: '/admin/article/' + id,
    method: 'get'
  })
}
/**
 * 更新文章根据id
 * @param params
 * @returns {AxiosPromise}
 */
export function uptArticleById(id, article) {
  const data = qs.parse(article)
  return request({
    url: '/admin/article/' + id,
    method: 'put',
    data
  })
}
/**
 * 文章置顶
 * @param params
 * @returns {AxiosPromise}
 */
export function uptArticleIsTopById(id) {
  return request({
    url: '/admin/article/top/' + id,
    method: 'put'
  })
}
/**
 * 添加文章
 * @param params
 * @returns {AxiosPromise}
 */
export function addArticle(article) {
  const data = qs.parse(article)
  return request({
    url: '/admin/article',
    method: 'post',
    data
  })
}
/**
 * 修改文章状态
 * @param params
 * @returns {AxiosPromise}
 */
export function uptArticleStatusById(id, params) {
  return request({
    url: '/admin/article/uptStatus/' + id,
    method: 'put',
    params
  })
}

