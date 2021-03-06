import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Search from './Screens/search.js';
import issues from './Screens/issue.js';

export default class App extends React.Component{
  render(){
    return(
      <AppContainer/>
    )
  }
}
const TabNavigator=createBottomTabNavigator({
  Issue:{screen:issues},
  Search:{screen:Search},
},
{

defaultNavigationOptions:({navigation})=>({
  tabBarIcon:()=>{
    const routeName=navigation.state.routeName
    if(routeName==="Transaction"){
      return(
        <Image
        source={require("./assets/book.png")}
        style={{width:40,height:40}}
        />
      )
    }
    else if(routeName==="Search"){
      return(
        <Image
        source={require("./assets/searchingbook.png")}
        style={{width:40,height:40}}
        />
      )
    }
  }
})
});
const AppContainer=createAppContainer(TabNavigator)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
