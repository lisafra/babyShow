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
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';

// 引入图标库
import Icon from 'react-native-vector-icons/Ionicons';
// 获取当前屏幕宽高
var Dimensions = require('Dimensions');
const {width} = Dimensions.get('window');
// request
import request from '../Common/request';
import config from '../Common/config';

export default class ListItem extends Component {

  constructor(props) {
    super(props);
    this.state=({
      rowData:this.props.rowData,
      up:this.props.rowData.voted,
    })
  }

  // 点赞接口
  _up = ()=> {
    let up = !this.state.up;
    let rowData = this.state.rowData;
    let url = config.api.baseUrl + config.api.up;
    // 发送网络请求
    let body = {
      id:rowData.id,
      up:up ? 'yes':'no',
      accessToken:'joeyoungtest',
    };
    request.post(url,body)
      .then(
        (data) => {
          if (data.success) {
            this.setState({
              up:up
            })
          } else {
            Alert.alert('网络错误，请稍后重试！');
          }
        }
      )
      .catch(
        (error) => {
          console.error("error:"+error);
        }
      )
  };

  render() {
    let rowData = this.state.rowData;
    return (
      <TouchableOpacity onPress={this.props.onSelect}>
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
              <Icon name={this.state.up ? "ios-heart":'ios-heart-outline'}
                    size={30}
                    onPress={this._up}
                    style={this.state.up ? styles.upStyle:styles.downStyle}
              />
              {/*点赞文字*/}
              <Text style={this.state.up ? styles.boxTextSelected:styles.boxText}>点赞</Text>
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
    );
  }
}

const styles = StyleSheet.create({
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
    justifyContent:'center',
    backgroundColor:'white',
    flex:1,
    marginLeft:1,
  },
  boxIcon:{
    fontSize:22,
    color:'#333',
  },
  upStyle:{
    fontSize:22,
    color:'red'
  },
  downStyle:{
    fontSize:22,
    color:'#333'
  },
  boxText:{
    fontSize:18,
    color:"#333",
    paddingLeft:12,
  },
  boxTextSelected:{
    fontSize:18,
    color:"red",
    paddingLeft:12,
  }
});

