'use strict';

const config = {

  api:{
    baseUrl:'http://rapapi.org/mockjs/31504/',
    list:'api/list',
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
