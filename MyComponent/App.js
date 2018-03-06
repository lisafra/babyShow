/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

// 引入各个模块
import Account from './Account/account';
import Edit from './Edit/edit';
import List from './List/list';
import Picture from './Picture/picture';
import QYTabBar from './QYTabBar';

// 引入导航
import {Navigator} from 'react-native-deprecated-custom-components';
// 引入tab-view
import ScrollableTabView from 'react-native-scrollable-tab-view';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      tabNames:['视频','录制','图片','我的'],
      tabIconNames:['ios-videocam-outline','ios-recording','ios-reverse-camera','ios-contact']
    }
  }

  render() {
    let tabNames = this.state.tabNames;
    let tabIconNames = this.state.tabIconNames;
    return (
      <ScrollableTabView
        renderTabBar={()=><QYTabBar tabNames={tabNames} tabIconNames={tabIconNames}/>}
        tabBarPosition={"bottom"}
        scrollWithoutAnimation={true}
        locked={true}
      >
        <Navigator
          tabLabel="list"
          initialRoute={{component:List,name:'list',
            params:{
              title:'视频列表'
            }}}
          renderScene={
             (route, navigator) =>
               <route.component {...route.params} navigator={navigator} />
          }
          configureScene={
            (route, routeStack) =>
              Navigator.SceneConfigs.FloatFromRight
          }
          // 上面的方法和下面效果一样,下面的函数更利于展开参数进行操作
          // configureScene={
          //   (route, routeStack) => {
          //     return ({
          //       // 通过修改源码关闭拖拽pop的功能
          //       ...Navigator.SceneConfigs.FloatFromRight,
          //       gestures:{
          //         pop:null
          //       }
          //   })
          //   }
          // }
        />
        <Edit tabLabel="edit"/>
        <Picture tabLabel="picture"/>
        <Account tabLabel="account"/>
      </ScrollableTabView>
    );
  }
}


