import request from '@/utils/request'
import qs from 'qs'
export function getArticleList(params) {
  return request({
    url: '/blog-api/admin/article',
    method: 'get',
    params
  })
}
export function delArticle(id) {
  return request({
    url: '/blog-api/admin/article/' + id,
    method: 'delete'
  })
}
export function getArticleById(id) {
  return request({
    url: '/blog-api/admin/article/' + id,
    method: 'get'
  })
}
export function uptArticleById(id, article) {
  const data = qs.parse(article)
  return request({
    url: '/blog-api/admin/article/' + id,
    method: 'put',
    data
  })
}
export function addArticle(article) {
  const data = qs.parse(article)
  return request({
    url: '/blog-api/admin/article',
    method: 'post',
    data
  })
}
