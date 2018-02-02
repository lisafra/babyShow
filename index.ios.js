/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
