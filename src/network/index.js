// web应用的相关网络请求封装在这个文件中
import request from "./request"

/**
 * 获取下一道题目
 * @param {*} flag 是否有下一题 
 * @param {*} id 当前对话框显示的题目id
 */
function getNextQuestion(flag, id) {
  let url = '/api/collection/next'
  if(!flag) {
    url = '/api/collection/pre'
  }
  return request({
    url,
    params: {
      id
    }
  })
}

/**
 * 获取题目的详细信息
 * @param {*} id 题目id
 */
function getQueInfo(id) {
  return request({
    url: '/api/collection/info',
    params: {
      id
    }
  })
}

/**
 * 新增题目解答
 * @param {*} isUpdate 是否要更新旧解答
 * @param {*} data 请求体数据：解答
 * @returns 
 */
function addAnswer(isUpdate, data) {
  let url = '/api/answer/add'
  if(isUpdate) {
    url = '/api/answer/update'
  }
  return request({
    url,
    data,
    method: 'POST'
  })
}

/**
 * 删除解答
 * @param {*} id 要删除的解答id
 */
function delAnswer(id) {
  return request({
    url: '/api/answer/delete',
    params: {
      id
    }
  })
}

/**
 * 获取题目的简单信息
 * @param {*} id 题目id
 */
function getSimpleInfo(id) {
  return request({
    url: '/api/collection/simpleInfo',
    params: {
      id
    }
  })
}

/**
 * 删除题目
 * @param {*} id 题目id
 */
function delQue(id) {
  return request({
    url: '/api/collection/delete',
    params: {
      id
    }
  })
}

/**
 * 新增题目
 * @param {*} isUpdate 是否更新旧题目 
 * @param {*} data 请求体数据：题目数据
 * @returns 
 */
function addQue(isUpdate, data) {
  let url = '/api/collection/add'
  if(isUpdate) {
    url = '/api/collection/update'
  }
  return request({
    url,
    data,
    method: 'POST'
  })
}

/**
 * 获取题目列表
 * @param {*} page 请求的页码
 * @param {*} size 一页几条数据
 */
function getQueList(page, size) {
  return request({
    url: '/api/collection/list',
    params: {
      cur_page: page,
      page_size: size
    }
  })
}

/**
 * 获取某个题目的所有解答
 * @param {*} collectionId 题目id 
 */
function getAnswerList(collectionId) {
  return request({
    url: '/api/answer/list',
    params: {
      collection_id: collectionId
    }
  })
}

/**
 * 获取所有的知识点
 */
function getKnowledges() {
  return request({
    url: '/api/knowledge/all',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export default {
  getNextQuestion,
  getQueInfo,
  addAnswer,
  delAnswer,
  getSimpleInfo,
  delQue,
  addQue,
  getQueList,
  getAnswerList,
  getKnowledges
}