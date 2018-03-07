# babyShow
基于React-Native框架练习的demo.

### 初始化一个项目:

```
$ react-native init babyShow --version 0.44.3
```
### 划分模块
在根目录新建一个 `MyComponent` 文件夹，存放实现App功能的文件。  
demo底部分为4个tabBar，创建四个文件夹与之对应：
* `List`：视频
* `Edit`：录制
* `Picture`：图片
* `Account`：我的

### 开始demo的开发：  
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

## 一、视频模块
### 在 `List` 文件夹下创建 `list.js`   
### 实现逻辑：
#### （1）使用 `ListView` 组件创建列表：（实现细节请看源码）  
#### （2）列表展示暂时没有真实接口,使用[RAP](http://rapapi.org/org/index.do)模拟假的接口,借用[Mock](http://mockjs.com/)语法,模拟了假数据;在项目中 `npm install mockjs --save` 安装mockjs.      
#### （3）封装请求类：
* a). 对请求类进行封装,在 `MyComponent` 文件夹下创建 `Common` 文件;  
* b). 在 `Common` 文件夹下创建 `config.js` :处理post请求的一些基类参数;  
* c). 在 `Common` 文件夹下创建 `request.js` :处理 POST/GET 请求;  
* d). `npm isntall query-string --save`:把参数拼接到get请求url上的工具;   
* e). `npm install lodash --save`:合并json工具.

完成之后的效果:  
![](http://upload-images.jianshu.io/upload_images/3265534-85d32527f647988f.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#### （4）添加下拉加载更多效果：
为了实现分页效果，我在之前rap定义的接口中加入了两个字段。![](http://upload-images.jianshu.io/upload_images/3265534-33bf8cf2b65aaf0f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 a). 加入加载更多方法
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
b). 初始化一个对象记录我们的参数:
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
 c). 实现加载更多的函数
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
  return cachedResults.items.length < cachedResults.total
}
```
d). 数据回来之后逻辑处理
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
e). 添加底部加载动画
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
#### （5）添加下拉刷新逻辑：
a). 在构造函数中给状态机添加参数 `isRefreshing:false` 记录是否正在下拉刷新；      
b). 加入下拉刷新组件 `refreshControl`
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
c). 实现下拉刷新的函数
```
// 下拉刷新
_onRefresh = ()=> {
  if (!this._hasMore() || this.state.isRefreshing){
    return
  }
  this._fetchData(1);
};
```
d). 数据回来之后逻辑处理(和上拉加载更多整合在了一起)
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
![](http://upload-images.jianshu.io/upload_images/3265534-bb9d517348750db0.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### （6） item上面的逻辑处理：
上面的功能实现完之后，整个 `list.js` 文件是相当冗余的。把 `listView` 里面渲染cell的模块单独抽取出来为 `listItem.js`，详情请看我代码中的该文件。

a). 点赞功能的实现:
* 在rap上面定义点赞接口 `api/up`  
![](http://upload-images.jianshu.io/upload_images/3265534-213aa1aea48ea4cd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


* 添加接口到 `config.js`中：
```
api:{
  baseUrl:'http://rapapi.org/mockjs/31504/',  // base
  list:'api/list',                            // 列表
  up:'api/up',                                // 点赞
},
```
* 在  `listItem.js` 文件中给点赞的图标Icon和文字添加 `onPress` 事件,实现 `_up` 函数，根据样式的改变修改对应的`style`和图片的`name`属性；具体实现细节请查看代码。  
 效果如下：  
 ![](http://upload-images.jianshu.io/upload_images/3265534-5d28081e238d83fb.gif?imageMogr2/auto-orient/strip)

#### （7）点击item进入视频详情页        
a). 之前的页面是没有加导航的。现在在 `App.js` 文件中加入 `Navigator`，实现导航的逻辑(根视图为 `List` 组件)：
```
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
/>
```
b). 创建 `detail.js` 处理详情逻辑。
c). 添加push到 `Detail` 组件(即 `detail.js`)的逻辑：  
* 在 `list.js` 文件中给封装的组件添加属性
```
<ListItem rowData={rowData} 
          onSelect={()=>this._loadPage(rowData)}
/>
...
// 实现函数：
// 通过导航控制器跳转到详情页
_loadPage(rowData) {
   /*
     因为当前的List组件是在Navigator包裹下的，
     所以可以通过this.props.navigator取到导航控制器进行push
  */
  let {navigator} = this.props;
  if (navigator) {
    navigator.push({
      name:'detail',
      component:Detail
    })
  }
}
```
* 在 `listItem` 中给item绑定 `onPress` 事件
```
<TouchableOpacity onPress={this.props.onSelect}>
```
效果如下：      
![](http://upload-images.jianshu.io/upload_images/3265534-f728dc43ab1dd909.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### (8) 处理视频播放功能
a). 引用第三方视频播放的库[video](https://github.com/react-native-community/react-native-video)，执行终端命令：
```
$ npm i -S react-native-video
$ react-native link
```
b). 然后从新编译项目；       
c). 在 `detail.js` 中引入 `'react-native-video'` 组件，实现视频播放的功能
```
// 导入播放器
import Video from 'react-native-video';
...
// 这里Video有一些参数设置
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
    }
... 
```
具体实现细节请查看源码。
* 给视频添加简单的加载动画：
导入 `ActivityIndicator` 组件，
```
// 在状态机中定义一个字段，标注是否加载完成视频资源
 videoLoaded:false

...

// 根据状态在render()中确定需要绘制的内容
{/* 视频加载动画 */}
{!this.state.videoLoaded ?
  <ActivityIndicator
    color={'red'}
    size={'large'}
    style={styles.videoLoad}
  />
  : null
}

... 

// 当视频加载完之后修改状态机中字段的状态
_onProgress = (data)=> {
  if (!this.state.videoLoaded) {
    this.setState({
      videoLoaded:true
    })
  }
};
```
* 给视频添加播放进度条：
```
// 设置视频播放进度条（一个是当前时间,一个是剩余时间）
const flexCompleted = this.getCurrentTimePercentage() * 100;
const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

...

{/* 视频播放进度条 */}
<View style={styles.progress}>
  <View style={[styles.innerProgressCompleted, {flex: flexCompleted}]} />
  <View style={[styles.innerProgressRemaining, {flex: flexRemaining}]} />
</View>

...

// 计算视频播放进度
getCurrentTimePercentage() {
  if (this.state.currentTime > 0) {
    return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
  } else {
    return 0;
  }
}
```
效果如下：       
![](http://upload-images.jianshu.io/upload_images/3265534-4855799761c833f9.gif?imageMogr2/auto-orient/strip)
* 给视频添加重新播放、暂停/继续的功能：
逻辑和上面如出一辙，不累赘了，具体查看源码。
#### (9) 处理视频信息的展示
a). 给视频详情页添加了导航
```
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
```
b). 给视频详情页添加作者信息
* 我在之前的接口中又加入了几个字段来表示作者信息![](http://upload-images.jianshu.io/upload_images/3265534-afb3dc0de4c99b47.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 因为评论要以列表的形式展示出来，视频作者信息是要能跟着列表一起滚动的，所以把该模块放在列表的Header上，作者信息代码实现（css请查看源码）：
```
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
```
#### (10) 处理评论信息的展示
a). 在视频信息 `render` 函数内部加入评论信息的 `ListView` 组件（带加载更多功能，此处不再说明，同`list.js` 中的加载更多一样）
```
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
```
b). 创建评论列表的接口：    
![](http://upload-images.jianshu.io/upload_images/3265534-fb46d60109b72cd4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)     
c). 在 `componentDidMount` 生命周期函数中发送请求，绘制item.      
效果如下：     
![](http://upload-images.jianshu.io/upload_images/3265534-24aebfa5d476b1f8.gif?imageMogr2/auto-orient/strip)


* * *
## 二、编辑模块
#### 在 `Edit` 文件夹下创建 `edit.js`   

* * *
## 三、图片模块
#### 在 `Picture` 文件夹下创建 `picture.js`   

* * *
## 四、我的模块
#### 在 `Account` 文件夹下创建 `account.js`   

