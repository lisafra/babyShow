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
} from 'react-native';
// 引入图标库
import Icon from 'react-native-vector-icons/Ionicons';
// 获取当前屏幕宽高
var Dimensions = require('Dimensions');
const {width,height} = Dimensions.get('window');


// request
import config from '../Common/config';
import request from '../Common/request';

export default class list extends Component {
  constructor(props) {
    super(props);
    this.state={
      dataSource:new ListView.DataSource({
        rowHasChanged:(r1,r2)=>r1!==r2,
      })
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
        >

        </ListView>
      </View>
    );
  }

  // 上拉加载更多
  _fetchMoreData = () => {
    if (!this._hasMore() ) {
       return
    }
  };

  _hasMore() {

  }

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
  componentWillMount() {
    // 加载本地数据
    this._dsFetchData();
  }
  componentDidMount() {
    // 加载网络数据
    this._fetchData();
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

  // 加载网络数据
  _fetchData() {
     // 发送网络请求
     request.get(config.api.baseUrl + config.api.list,{
       accessToken:"joeyoungtest"
     }).then(
       (data) => {
         if (data.success) {
           this.setState({
             dataSource:this.state.dataSource.cloneWithRows(data.data)
           })
         }
       }
     ).catch((error) => {
       console.error(error);
     });
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
    marginTop:Platform.OS == 'ios' ? 20:0
  },
  headerText:{
    fontSize:16,
    fontWeight:'600',
    textAlign:'center',
  },
  listView:{

  },
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
  }
});

