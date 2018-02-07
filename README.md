# babyShow
基于React-Native框架练习的demo.

#### 初始化一个项目:

```
react-native init babyShow --version 0.44.3

```
#### 划分模块
在根目录新建一个 `MyComponent` 文件夹，存放实现App功能的文件。  
demo底部分为4个tabBar，创建四个文件夹与之对应：
* `List`：视频
* `Edit`：录制
* `Picture`：图片
* `Account`：我的

#### 开始demo的开发：  
在 `MyComponent` 文件夹下创建：
* `App.js`：作为 `android` 和 `iOS` 公用入口文件，只需要在对应的 `index.android.js` 和 `index.ios.js` 文件里引入 `App.js` 即可
```
import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';
import App from './MyComponent/App';

export default class babyShow extends Component {
  render() {
    return (
      <App/>
    );
  }
}
AppRegistry.registerComponent('babyShow', () => babyShow);
```
* `QYTabBar.js`：处理底部自定义tabBar的文件。  
1.项目中使用的tabBar引入了一个优秀的第三方的库 [react-native-scrollable-tab-view](https://github.com/skv-headless/react-native-scrollable-tab-view)  
2.tabBar上的icon使用了一个库 [ionicons](https://ionicframework.com/docs/ionicons/).  
```
在项目路径下执行终端：
// 引入tabBar的库
$ npm install react-native-scrollable-tab-view --save 
// icon库
$ npm install react-native-vector-icons --save 
// link,使ios项目关联icon需要的库，（不需要我们自己手动引入了）
$ react-native link

```
* * *

### 一、视频模块
#### 在 `List` 文件夹下创建 `list.js`   
#### 实现逻辑：
#####（1）使用 `ListView` 组件创建列表：（实现细节请看源码）  
#####（2）列表展示暂时没有真实接口,使用[RAP](http://rapapi.org/org/index.do)模拟假的接口,借用[Mock](http://mockjs.com/)语法,模拟了假数据;在项目中 `npm install mockjs --save` 安装mockjs.
#####（3）封装请求类：
* a).对请求类进行封装,在 `MyComponent` 文件夹下创建 `Common` 文件;  
* b).在 `Common` 文件夹下创建 `config.js` :处理post请求的一些基类参数;  
* c).在 `Common` 文件夹下创建 `request.js` :处理 POST/GET 请求;  
* d).`npm isntall query-string --save`:把参数拼接到get请求url上的工具;   
* e).`npm install lodash --save`:合并json工具.

完成之后的效果:  
![](http://upload-images.jianshu.io/upload_images/3265534-85d32527f647988f.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#####（4） 添加下拉加载更多效果：
为了实现分页效果，我在之前rap定义的接口中加入了两个字段。![](http://upload-images.jianshu.io/upload_images/3265534-33bf8cf2b65aaf0f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 a).加入加载更多方法
```
// 代码中加入上拉加载更多
<ListView
  dataSource={this.state.dataSource}
  renderRow={this._renderRow}
  style={styles.listView}
  onEndReached={this._fetchMoreData}
  onEndReachedThreshold={20}
>
</ListView>
```
b).初始化一个对象记录我们的参数:
```
 // 数据缓存
let cachedResults={
  // 当前加载的页码
  nextPage:1,
  // 服务器返回的数据
  items:[],
  // 服务器数据总条数
  total:0
};
```
 c).实现加载更多的函数
```
// 上拉加载更多
_fetchMoreData = () => {
  // 没有更多的数据 || 正在加载
  if (!this._hasMore() || this.state.isLoading) {
     return
  }
  // 去服务器加载更多数据
  this._fetchData(cachedResults.nextPage)
};
// 是否还有更多的数据
_hasMore() {
  //
  return cachedResults.items.length !== cachedResults.total
}
```
d).数据回来之后逻辑处理
```
  // 修改状态机
  this.setState({
    isLoadingMore:true // 正在加载更多
  });
 ...
    if (data.success) {
          // 将服务器得到的数据缓存
          cachedResults.items = cachedResults.items.concat(data.data);
          cachedResults.total = data.total;
          cachedResults.nextPage += 1;
          this.setState({
            // 更新数据
            dataSource:this.state.dataSource.cloneWithRows(cachedResults.items),
            // 还原状态
            isLoadingMore:false,
          })
        }
 ...
```
e).添加底部加载动画
引入 `ActivityIndicator` 组件;  
在 `ListView` 中加入 `renderFooter={this._renderFooter}`；
实现 `_renderFooter`函数;
```
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
```
##### (5) 添加下拉刷新逻辑：
a).在构造函数中给状态机添加参数 `isRefreshing:false` 记录是否正在下拉刷新；
b).加入下拉刷新组件 `refreshControl`
```
在ListView中实现函数：
...
// 下拉刷新
refreshControl={
  <RefreshControl
    refreshing={this.state.isRefreshing}
    onRefresh={this._onRefresh}
  />
}
```  
c).实现下拉刷新的函数
```
// 下拉刷新
_onRefresh = ()=> {
  if (!this._hasMore() || this.state.isRefreshing){
    return
  }
  this._fetchData(1);
};
```
d).数据回来之后逻辑处理(和上拉加载更多整合在了一起)
```
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
...
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
...
```
效果如下：  

![](http://upload-images.jianshu.io/upload_images/3265534-870eff3868a9f091.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)




* * *
### 二、编辑模块
##### 在 `Edit` 文件夹下创建 `edit.js`   

* * *
### 三、图片模块
##### 在 `Picture` 文件夹下创建 `picture.js`   

* * *
### 四、我的模块
##### 在 `Account` 文件夹下创建 `account.js`   

