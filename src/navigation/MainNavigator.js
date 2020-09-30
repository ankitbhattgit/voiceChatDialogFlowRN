import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {useSelector} from 'react-redux';
import {AuthNavigator, PhysicianNavigator} from './AppNavigator';
import Loader from './../components/Loader';

const MainNavigator = () => {
  const isAuth = useSelector((state) => !!state.auth.token);
  console.log('state.auth', isAuth);
  const [login, updateLogin] = useState('');

  useEffect(() => {
    const checkUserData = async () => {
      let physicianData = await AsyncStorage.getItem('userData');
      physicianData = JSON.parse(physicianData);
      if (physicianData && physicianData.token) {
        updateLogin('true');
      } else {
        updateLogin('false');
      }
    };
    checkUserData();
  }, [isAuth]);

  if (login === 'true') {
    return <PhysicianNavigator />;
  }

  if (login === 'false') {
    return <AuthNavigator />;
  }

  return <Loader />;
};

export default MainNavigator;
