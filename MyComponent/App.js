/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
        <List tabLabel="list"/>
        <Edit tabLabel="edit"/>
        <Picture tabLabel="picture"/>
        <Account tabLabel="account"/>
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

