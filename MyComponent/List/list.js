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
  ListView,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
// 引入图标库
import Icon from 'react-native-vector-icons/Ionicons';
// 获取当前屏幕宽高
var Dimensions = require('Dimensions');
const {width,height} = Dimensions.get('window');

// request
import config from '../Common/config';
import request from '../Common/request';

// 数据缓存
let cachedResults={
  nextPage:1,
  items:[],
  total:0
};

export default class list extends Component {
  constructor(props) {
    super(props);
    this.state={
      dataSource:new ListView.DataSource({
        rowHasChanged:(r1,r2)=>r1!==r2,
      }),
      isLoadingMore:false,
      isRefreshing:false
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {/*导航条*/}
        <View style={styles.header}>
          <Text style={styles.headerText}>
            视频列表
          </Text>
        </View>
        {/*列表页面*/}
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          style={styles.listView}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={20}
          // 上拉加载更多底部动画
          renderFooter={this._renderFooter}
          // 下拉刷新
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
        </ListView>
      </View>
    );
  }

  // 下拉刷新
  _onRefresh = ()=> {
    if (!this._hasMore() || this.state.isRefreshing){
      return
    }
    this._fetchData(1);
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
    return cachedResults.items.length !== cachedResults.total
  }

  componentWillMount() {
    // 加载本地缓存数据
    this._dsFetchData()
  }
  componentDidMount() {
    // 加载网络数据
    this._fetchData(1)
  }

  // 加载网络数据
  _fetchData(page) {

    // 修改状态机
    if (page === 1) {
      this.setState({
        isRefreshing:true  // 刷新
      })
    } else {
      this.setState({
        isLoadingMore:true // 正在加载更多
      })
    }

    // 发送网络请求
    request.get(config.api.baseUrl + config.api.list,{
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
          if (page === 1) {// 刷新
            this.setState({
              // 更新数据
              dataSource:this.state.dataSource.cloneWithRows(cachedResults.items),
              // 还原状态
              isRefreshing:false
            })
          } else {
            this.setState({
              // 更新数据
              dataSource:this.state.dataSource.cloneWithRows(cachedResults.items),
              // 还原状态
              isLoadingMore:false
            })
          }
        }
      }
    ).catch(
      (error) => {
        if (page === 1) {
          this.setState({
            isRefreshing:false
          })
        } else {
          this.setState({
            isLoadingMore:false
          })
        }
        console.error("error:"+error);
      });
  }

  // 加载本地缓存数据
  _dsFetchData() {
    this.setState({
      dataSource:this.state.dataSource.cloneWithRows([
        {
          "id":"410000198702238412","thumb":"http://dummyimage.com/1280x720/2589ee)","title":"@cparagraph(1, 3)","video":"http://v.youku.com/v_show/id_XMjk0MTU1MjA0MA==.html?spm=a2hww.20027244.ykRecommend.5~5~5~5~A"
        }
        ,
        {
          "id":"650000197803011428","thumb":"http://dummyimage.com/1280x720/946afe)","title":"@cparagraph(1, 3)","video":"http://v.youku.com/v_show/id_XMjk0MTU1MjA0MA==.html?spm=a2hww.20027244.ykRecommend.5~5~5~5~A"
        }
        ,
        {
          "id":"430000198906061923","thumb":"http://dummyimage.com/1280x720/a017bb)","title":"@cparagraph(1, 3)","video":"http://v.youku.com/v_show/id_XMjk0MTU1MjA0MA==.html?spm=a2hww.20027244.ykRecommend.5~5~5~5~A"
        }
      ])
    });
  }

  // 渲染cell
  _renderRow = (rowData) => {
    return(
      <TouchableOpacity>
        {/*整个cell*/}
        <View style={styles.cellStyle}>
          {/*标题文字*/}
          <Text style={styles.titleStyle}>{rowData.title}</Text>
          {/*封面图片*/}
          <Image style={styles.imageSryle} source={{uri:rowData.thumb}}>
            <Icon name='ios-play'
                  size={30}
                  style={styles.play}
            />
          </Image>
          {/*下半部分*/}
          <View style={styles.cellFooter}>
            {/*点赞*/}
            <View style={styles.footerBox}>
              <Icon name="ios-heart-outline"
                    size={30}
                    style={styles.boxIcon}
              />
              {/*点赞文字*/}
              <Text style={styles.boxText}>点赞</Text>
            </View>
            {/*评论*/}
            <View style={styles.footerBox}>
              <Icon name="ios-chatbubbles"
                    size={30}
                    style={styles.boxIcon}
              />
              {/*评论文字*/}
              <Text style={styles.boxText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header:{
    paddingTop:25,
    paddingBottom:15,
    backgroundColor:"#dddddd",
    borderBottomWidth:0.5,
    borderBottomColor:'black',
    marginTop:Platform.OS === 'ios' ? 20:0
  },
  headerText:{
    fontSize:16,
    fontWeight:'600',
    textAlign:'center',
  },
  listView:{

  },
  // cell
  cellStyle:{
    width:width,
    marginTop:10,
    backgroundColor:'white'
  },
  titleStyle:{
    fontSize:18,
    padding:10,
    color:'black',
  },
  imageSryle:{
    width:width,
    height:width*0.56,
    resizeMode:'cover',
  },
  // 播放按钮
  play:{
    position:'absolute',
    bottom:14,
    right:14,
    width:45,
    height:45,
    paddingTop:9,
    paddingLeft:18,
    backgroundColor:'transparent',
    borderColor:'#ddd',
    borderWidth:1,
    borderRadius:23,
  },
  cellFooter:{
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:'#dddddd'
  },
  footerBox:{
    padding:10,
    flexDirection:'row',
    backgroundColor:'white',
    flex:1,
    marginLeft:1,
  },
  boxIcon:{
    fontSize:22,
    color:'#333',
  },
  boxText:{
    fontSize:18,
    color:"#333",
    paddingLeft:12,
  },
  // 加载动画
  loadingMore:{
    marginVertical:20
  },
  loadingText:{
    fontSize:18,
    color:'#777',
    textAlign:'center'
  }
});

