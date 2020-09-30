import React from 'react';
import {Platform, SafeAreaView, Button, View} from 'react-native';
import DialogFlowChatVoice from '../screens/DialogFlowChatVoice';
import Dashboard from '../screens/Dashboard';
import DialogFlowChat from '../screens/DialogFlowChat';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AuthScreen from '../screens/AuthScreen';

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStackNavigator.Screen name="Auth" component={AuthScreen} />
    </AuthStackNavigator.Navigator>
  );
};

// const PhysicianStackNavigator = createStackNavigator();

// export const PhysicianNavigator = () => {
//   return (
//     <PhysicianStackNavigator.Navigator>
//       <PhysicianStackNavigator.Screen name="Dashboard" component={Dashboard} />
//       <PhysicianStackNavigator.Screen
//         name="ChatBot"
//         component={DialogFlowChatVoice}
//       />
//     </PhysicianStackNavigator.Navigator>
//   );
// };

const PhysicianTabNavigator = createBottomTabNavigator();

export const PhysicianNavigator = () => {
  return (
    <PhysicianTabNavigator.Navigator>
      <PhysicianTabNavigator.Screen
        name="ChatBot"
        component={DialogFlowChatVoice}
      />
      <PhysicianTabNavigator.Screen name="Dashboard" component={Dashboard} />
      {/*    <PhysicianTabNavigator.Screen name="Chat" component={DialogFlowChat} /> */}
    </PhysicianTabNavigator.Navigator>
  );
};
