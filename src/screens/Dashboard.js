import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import * as authActions from './../store/actions/auth';

const Dashboard = (props) => {
  const dispatch = useDispatch();

  const logout = () => {
    try {
      dispatch(authActions.logout());
    } catch (err) {
      console.log('dipsatch error', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Button title="Logout" onPress={() => logout()} />
      </View>
      <View style={styles.button}>
        <Button
          title="Go to Voice Module"
          onPress={() => {
            props.navigation.navigate('ChatBot');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 5,
  },
});

export default Dashboard;
