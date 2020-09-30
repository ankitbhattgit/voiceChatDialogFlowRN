import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import React from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import authReducer from './src/store/reducers/auth';
import MainNavigator from './src/navigation/MainNavigator';

enableScreens();
const rootReducer = combineReducers({
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
}
