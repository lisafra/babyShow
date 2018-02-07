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
  Image
} from 'react-native';

// 引入图标库
import Icon from 'react-native-vector-icons/Ionicons';
// 获取当前屏幕宽高
var Dimensions = require('Dimensions');
const {width} = Dimensions.get('window');

export default class ListItem extends Component {

  constructor(props) {
    super(props);
    this.state=({
      rowData:this.props.rowData
    })
  }

  render() {
    let rowData = this.state.rowData;
    return (
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

