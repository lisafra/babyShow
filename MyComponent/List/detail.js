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
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ListView
} from 'react-native';

// 导入播放器
import Video from 'react-native-video';
// 引入图标库
import Icon from 'react-native-vector-icons/Ionicons';
// request
import request from '../Common/request';
import config from '../Common/config';

// 获取当前屏幕宽高
var Dimensions = require('Dimensions');
const {width} = Dimensions.get('window');

// 数据缓存
let cachedResults={
  nextPage:1,
  items:[],
  total:0
};

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
      // ---------- 以下为自定义参数 ----------
      // 标记加载状态
      videoLoaded:false,
      // 播放状态
      playing:false,
      // 是否播放结束
      playEnd:false,
      // 视频加载失败
      videoError:false,
      // 评论参数
      dataSource:new ListView.DataSource({
        rowHasChanged:(r1,r2)=>r1!==r2,
      }),
      isLoadingMore:false,
    }

  }
  render() {
    let rowData = this.state.rowData;
    // 设置视频播放进度条（一个是当前时间,一个是剩余时间）
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

    return (
      <View style={styles.container}>
        {/* 导航栏 */}
        <View style={styles.nav_navStyle}>
          {/* 返回按钮 */}
          <TouchableOpacity
            style={styles.nav_backBox}
            onPress={this._pop}
          >
            <Icon name={'ios-arrow-back'}
                  style={styles.nav_backIcon}
            />
            <Text style={styles.nav_backText}>返回</Text>
          </TouchableOpacity>
          {/* 标题 */}
          <Text style={styles.nav_navText} numberOfLines={1}>视频详情页面</Text>
        </View>
        {/* 播放器 */}
        <View style={styles.video_videoBox}>
          <Video
            ref="videoPlayer"
            source={{uri:rowData.video}}
            style={styles.video_video}
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
          {/* 错误提示 */}
          {this.state.videoError ?
            <Text style={styles.video_errorStyle}>很抱歉，视频加载失败</Text>
            : null
          }
          {/* 视频加载动画 */}
          {!this.state.videoLoaded ?
            <ActivityIndicator
              color={'red'}
              size={'large'}
              style={styles.video_videoLoad}
            />
            : null
          }
          {/* 从新播放按钮 */}
          {!this.state.playing && this.state.videoLoaded ?
            <Icon name={'ios-refresh'}
                  size={45}
                  style={styles.video_refreshStyle}
                  onPress={this._replay}
            />
            : null
          }
          {/* 暂停&继续 */}
          {this.state.playing ?
            <TouchableOpacity
              activeOpacity={1}
              style={styles.video_pausedStyle}
              onPress={()=>this._pause(true)}
            >
              {this.state.paused ?
                <Icon name={'ios-play'}
                      size={45}
                      style={styles.video_play}
                      color={'white'}
                      onPress={()=>this._pause(false)}
                />
                : null
              }
            </TouchableOpacity>
            : null
          }
          {/* 视频播放进度条 */}
          <View style={styles.video_progress}>
            <View style={[styles.video_innerProgressCompleted, {flex: flexCompleted}]} />
            <View style={[styles.video_innerProgressRemaining, {flex: flexRemaining}]} />
          </View>
        </View>
        {/* 评论信息 */}
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          renderHeader={this._renderHeader}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={20}
          // 上拉加载更多底部动画
          renderFooter={this._renderFooter}
        />
      </View>
    )
  }

  componentDidMount() {
    // 从服务端获取数据
    this._fetchData(1);
  }
  _fetchData(page) {

    // 修改状态机
    this.setState({
      isLoadingMore:true // 正在加载更多
    });

    // 发送网络请求
    request.get(config.api.baseUrl + config.api.comments,{
      id:"123456",
      accessToken:"joeyoungtest",
      page:page
    }).then(
      (data) => {
        if (data.success) {

          // 将服务器得到的数据缓存
          // 拷贝对象生成一个新数组
          let items = cachedResults.items.slice(0);
          if (page === 1) {// 刷新
            items = data.data.concat(items);
            cachedResults.nextPage = 1;
          } else {
            items = items.concat(data.data);
            cachedResults.nextPage += 1;
          }

          cachedResults.items = items;
          cachedResults.total = data.total;

          this.setState({
            // 更新数据
            dataSource:this.state.dataSource.cloneWithRows(cachedResults.items),
            // 还原状态
            isLoadingMore:false
          })
        }
      }
    ).catch(
      (error) => {
        this.setState({
          isLoadingMore:false
        })
        console.error("error:"+error);
      }
    );
  }

  // 自定义Header视图
  _renderHeader = ()=> {
    let rowData = this.state.rowData;
    return (
      // 视频作者信息
      <View style={styles.info_infoBox}
      >
        <Image
          style={styles.info_avatar}
          source={{uri:rowData.author.avatar}}
        />
        <View style={styles.info_descBox}>
          <Text style={styles.info_nickname}>作者：{rowData.author.nickname}</Text>
          <Text style={styles.info_title}>标题：{rowData.title}</Text>
        </View>
      </View>
    )
  };

  // 自定义Footer视图
  _renderFooter = ()=> {
    if(!this._hasMore()) {
      return(
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>没有更多的数据了...</Text>
        </View>
      )
    }
    // 显示小菊花
    return(
      <ActivityIndicator style={styles.loadingMore}/>
    )
  };
  // 上拉加载更多
  _fetchMoreData = () => {
    // 没有更多的数据 || 正在加载
    if (!this._hasMore() || this.state.isLoadingMore) {
      return
    }
    // 去服务器加载更多数据
    this._fetchData(cachedResults.nextPage)

  };
  // 是否还有更多的数据
  _hasMore() {
    return cachedResults.items.length < cachedResults.total
  }

  // 处理item
  _renderRow =(rowData)=> {
    return (
      <View style={styles.comment_commentBox}
            key={rowData.id}
      >
        <Image style={styles.comment_avatar}
               source={{uri:rowData.commentator.avatar}}
        />
        <View style={styles.comment_descBox}>
          <Text style={styles.comment_nickname}>{rowData.commentator.nickname}</Text>
          <Text style={styles.comment_title}>{rowData.content}</Text>
        </View>
      </View>
    )
  };
  // 返回上级页面
  _pop = ()=> {
    let {navigator} = this.props;
    if (navigator) {
      navigator.pop()
    }
  };

  // 从新播放
  _replay = ()=> {
    this.setState({
      playEnd:false,
      paused:false
    })
    // seek(0):从头开始播放
    this.refs.videoPlayer.seek(0);
  };
  // 继续&暂停
  _pause(status) {
    if (status === this.state.paused) return;
      this.setState({
        paused:status
      })
  };

// -------------------------------------- videoFunction ---------------------------------------
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
    // 修改播放状态
    if (!this.state.playing && !this.state.playEnd) {
      this.setState({
        playEnd:false,
        playing:true
      })
    }
    this.setState({currentTime:data.currentTime})
    // console.log('_onProgress---当前时间'+data.currentTime);

  };
  _onEnd = ()=> {

    // 修改播放状态
    this.setState({
      playing:false,
      paused:true,
      playEnd:true,
    })

  };
  _onError = (error)=> {
    this.setState({
      videoError:true
    });
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

// 设置frame
let videoBoxHeight = 280;
let videoHeight = videoBoxHeight - 10;
let loadingTop = videoBoxHeight * 0.5 - 30;
let playWH = 60;
let playTop = videoBoxHeight * 0.5 - playWH*0.5;
let errorTextTop = videoBoxHeight*0.5 + playWH*0.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  // 导航栏
  nav_navStyle:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:"center",
    width:width,
    height:64,
    backgroundColor:'#dddddd',
  },
  nav_backBox:{
    position:'absolute',
    left:12,
    top:30,
    width:60,
    flexDirection:'row',
    alignItems:"center",
  },
  nav_backIcon:{
    fontSize:22,
    marginRight:5
  },
  nav_backText:{
    fontSize:16
  },
  nav_navText:{
    marginTop:20,
    fontSize:16,
    fontWeight:'600',
    textAlign:'center',
    width:width-120,
  },
  // 视频播放器
  video_videoBox:{
    width:width,
    height:videoBoxHeight,
    backgroundColor:'black'
  },
  video_video:{
    width:width,
    height:videoHeight,
    backgroundColor:'black'
  },
  // 视频加载失败提示
  video_errorStyle:{
    position:'absolute',
    left:0,
    width:width,
    top:errorTextTop,
    textAlign:'center',
    color:'red',
    fontSize:20
  },
  // 视频加载动画
  video_videoLoad:{
    position:'absolute',
    top:loadingTop,
    width:width,
    left:0,
    alignItems:'center',
  },
  // 视频播放进度条
  video_progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  video_innerProgressCompleted: {
    height: 10,
    backgroundColor: 'orange',
  },
  video_innerProgressRemaining: {
    height: 10,
    backgroundColor: '#2C2C2C',
  },
  // 刷新按钮
  video_refreshStyle:{
    position:'absolute',
    top:playTop,
    left:width*0.5-playWH*0.5,
    width:playWH,
    height:playWH,
    paddingTop:10,
    paddingLeft:22,
    backgroundColor:'transparent',
    borderColor:'black',
    borderWidth:1,
    borderRadius:playWH*0.5,
  },
  // 播放按钮
  video_play:{
    position:'absolute',
    top:playTop,
    left:width*0.5-playWH*0.5,
    width:playWH,
    height:playWH,
    paddingTop:10,
    paddingLeft:22,
    backgroundColor:'transparent',
    borderColor:'white',
    borderWidth:1,
    borderRadius:playWH*0.5,
  },
  // 播放&暂停
  video_pausedStyle:{
    position:'absolute',
    top:0,
    left:0,
    width:width,
    height:videoHeight,
  },
  // 视频信息
  info_infoBox:{
    flexDirection:'row',
    width:width,
    justifyContent:"center",
    marginTop:10,
    paddingBottom:10,
    borderBottomWidth:6,
    borderBottomColor:"#ddd"
  },
  info_avatar:{
    width:60,
    height:60,
    borderRadius:30,
    marginRight:10,
    marginLeft:10
  },
  info_descBox:{
    flex:1,
  },
  info_nickname:{
    fontSize:16
  },
  info_title:{
    marginTop:8,
    fontSize:14,
    color:'#666'
  },
  // 评论
  comment_commentBox:{
    flexDirection:'row',
    width:width,
    height:80,
    justifyContent:'center',
    marginTop:10,
  },
  comment_avatar:{
    width:30,
    height:30,
    borderRadius:15,
    marginRight:10,
    marginLeft:10
  },
  comment_descBox:{
    flex:1,
    borderBottomWidth:1,
    borderBottomColor:'#ddd'
  },
  comment_nickname:{
    fontSize:16
  },
  comment_title:{
    marginTop:8,
    fontSize:14,
    color:'#666'
  },
  // 评论加载动画
  loadingMore:{
    marginVertical:20
  },
  loadingText:{
    fontSize:18,
    color:'#777',
    textAlign:'center'
  }

});

