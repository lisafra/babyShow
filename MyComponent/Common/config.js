'use strict';

const config = {

  api:{
    baseUrl:'http://rapapi.org/mockjs/31504/',  // base
    list:'api/list',                            // 列表
    up:'api/up',                                // 点赞
  },
  map:{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    timeout:8000,
  }
};


module.exports = config;
