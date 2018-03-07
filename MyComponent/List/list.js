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
  ActivityIndicator,
  RefreshControl
} from 'react-native';

// item
import ListItem from './listItem';
// 详情页
import Detail from './detail';

// request
import request from '../Common/request';
import config from '../Common/config';

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
    return cachedResults.items.length < cachedResults.total
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

  // 渲染item
  _renderRow = (rowData) => {
    return(
      <ListItem rowData={rowData} 
                onSelect={()=>this._loadPage(rowData)}
      />
    )
  };

// 通过导航控制器跳转到详情页
  _loadPage(rowData) {
    /*
      因为当前的List组件是在Navigator包裹下的，
      所以可以通过this.props.navigator取到导航控制器
    */
    let {navigator} = this.props;
    if (navigator) {
      navigator.push({
        component:Detail,
        params:{
          rowData:rowData
        }
      })
    }
  }


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
// 样式
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

