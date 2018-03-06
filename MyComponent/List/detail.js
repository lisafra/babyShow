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
  Platform,
  ActivityIndicator
} from 'react-native';

// 导入播放器
import Video from 'react-native-video';

// 获取当前屏幕宽高
var Dimensions = require('Dimensions');
const {width} = Dimensions.get('window');

export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 服务端返回的数据
      rowData:this.props.rowData,
      // 播放速度
      rate: 1,
      // 音量
      volume: 1,
      // 是否静音
      muted: false,
      // 展示模式: 'cover', 'contain', 'stretch'
      resizeMode: 'contain',
      // 是否暂停
      paused: false,
      // 处理视频进度
      duration: 0.0,
      currentTime: 0.0,
      // 自定义参数（标记加载状态）
      videoLoaded:false
    }

  }
  render() {
    let rowData = this.state.rowData;
    // 设置视频播放进度条（一个是当前时间,一个是剩余时间）
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={this._backToList}>
          详情页面---{rowData.title}
        </Text>
        {/* 播放器 */}
        <View style={styles.videoBox}>
          <Video
            source={{uri:rowData.video}}
            style={styles.video}
            rate={this.state.rate}
            paused={this.state.paused}
            volume={this.state.volume}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            repeat={false}

            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onProgress={this._onProgress}
            onEnd={this._onEnd}
            onError={this._onError}
          />
          {/* 视频加载动画 */}
          {!this.state.videoLoaded ?
            <ActivityIndicator
              color={'red'}
              size={'large'}
              style={styles.videoLoad}
            />
            : null
          }
          {/* 视频播放进度条 */}
          <View style={styles.progress}>
            <View style={[styles.innerProgressCompleted, {flex: flexCompleted}]} />
            <View style={[styles.innerProgressRemaining, {flex: flexRemaining}]} />
          </View>
        </View>
      </View>
    )
  }
  _backToList = ()=> {
    let {navigator} = this.props;
    if (navigator) {
      navigator.pop()
    }
  };

  // ------------------- videoFunction --------------------
  _onLoadStart = ()=> {
    console.log('_onLoadStart')
  };
  _onLoad = (data)=> {
    console.log('_onLoad--视频总长度'+data.duration);

    this.setState({duration:data.duration})
  };
  _onProgress = (data)=> {

    if (!this.state.videoLoaded) {
      this.setState({
        videoLoaded:true
      })
    }
    this.setState({currentTime:data.currentTime})
    // console.log('_onProgress---当前时间'+data.currentTime);

  };
  _onEnd = ()=> {
    console.log('_onEnd');
    alert('enEnd');

  };
  _onError = (error)=> {
    console.log('错误'+JSON.stringify(error))
  };
// 计算视频播放进度
getCurrentTimePercentage() {
  if (this.state.currentTime > 0) {
    return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
  } else {
    return 0;
  }
}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginTop:Platform.OS === 'ios' ? 20:0
  },
  videoBox:{
    width:width,
    height:360,
    backgroundColor:'black'
  },
  video:{
    width:width,
    height:350,
    backgroundColor:'black'
  },
  // 视频加载动画
  videoLoad:{
    position:'absolute',
    top:160,
    width:width,
    left:0,
    alignItems:'center',
  },
  // 视频播放进度条
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 10,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 10,
    backgroundColor: '#2C2C2C',
  },

});

