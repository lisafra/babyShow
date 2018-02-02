# babyShow
基于React-Native框架练习的demo.

#### 初始化一个项目:

```
react-native init babyShow --version 0.44.3

```
#### 划分模块
在根目录新建一个`MyComponent`文件夹，存放实现App功能的文件。  
demo底部分为4个tabBar，创建四个文件夹与之对应：
* `List`：视频
* `Edit`：录制
* `Picture`：图片
* `Account`：我的

#### 开始demo的开发：  
在`MyComponent`文件夹下创建：
* `App.js`：作为android和ios公用入口文件，只需要在对应的`index.android.js`和`index.ios.js`文件里引入`App.js`即可
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
1.项目中使用的tabBar引入了一个优秀的第三方的库[react-native-scrollable-tab-view](https://github.com/skv-headless/react-native-scrollable-tab-view)  
2.tabBar上的icon使用了一个库[ionicons](https://ionicframework.com/docs/ionicons/).  
```
在项目路径下执行终端：
// 引入tabBar的库
$ npm install react-native-scrollable-tab-view --save 
// icon库
$ npm install react-native-vector-icons --save 
// link,使ios项目关联icon需要的库，（不需要我们自己手动引入了）
$ react-native link

```

#### 视频模块

