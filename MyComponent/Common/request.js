'use strict';

import Mock from 'mockjs';
import queryString from 'query-string';
import _ from 'lodash';

// 请求参数配置
import config from './config';

let request={

};

//----------------------------- GET ----------------------------------
// 设定params json对象
request.get = (url, params) => {
  if (params) {
    url += '?' + queryString.stringify(params)
  }
  // 发送网络请求
  return fetch(url)
           .then((response) => response.json())
           .then((responseJson) => Mock.mock(responseJson))
};


//----------------------------- POST ----------------------------------
request.post = (url, body) => {

  // 合并json对象
  let map = _.extend(config.map,{
    body:JSON.stringify(body)
  });
return fetch(url,map)
         .then((response) => response.json())
         .then((responseJson) => Mock.mock(responseJson))
};


module.exports = request;