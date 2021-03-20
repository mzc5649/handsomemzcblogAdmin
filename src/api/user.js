import request from '@/utils/request'
import qs from 'qs'
export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/userInfo',
    method: 'get',
    params: { token: token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
export function getUserList(params) {
  return request({
    url: '/admin/user',
    method: 'get',
    params
  })
}

export function delUserById(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}
export function uptUser(user) {
  const data = qs.parse(user)
  return request({
    url: '/admin/user',
    method: 'put',
    data
  })
}
