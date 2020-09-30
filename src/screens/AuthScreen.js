import React, {useState, useEffect} from 'react';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  Icon,
} from 'native-base';
import {
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';
import * as authActions from './../store/actions/auth';

const imgUrl = require('./../../assets/background.png');

const AuthScreen = (props) => {
  // console.log('authscreen');
  const dispatch = useDispatch();
  let error = true;

  const [state, setState] = useState({
    email: 'yokesimt@ums.edu.my',
    password: 'abcd@1234',
  });
  const [apiError, setApiError] = useState();

  useEffect(() => {
    if (apiError) {
      Alert.alert('Error', apiError, [
        {
          text: 'Ok',
        },
      ]);
    }
  }, [apiError]);

  const validateEmail = (email) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({emailValidateColor: false, email: email});
      console.log('valid');
    } else {
      this.setState({emailValidateColor: true, email: email});
      console.log('invalid password');
    }
  };

  const handleSubmit = async () => {
    if (state.email && state.password) {
      let {email, password} = state;
      setApiError(null);
      try {
        await dispatch(authActions.login(email, password));
      } catch (err) {
        setApiError(err.message);
        // Alert.alert('Error!', err.message, [{text: 'Ok'}]);
        console.log('error', err);
      }
    } else {
      Alert.alert('Error', 'Please enter email and password', [
        {
          text: 'Ok',
        },
      ]);
    }
  };

  return (
    <Container style={styles.container}>
      <ImageBackground source={imgUrl} style={styles.image}>
        <Content contentContainerStyle={styles.mainView}>
          <Form style={styles.form}>
            <Item
              floatingLabel
              //    error={error === true ? true : ''}
            >
              <Label style={styles.label}>Email</Label>

              <Input
                style={styles.label}
                value={state.email}
                onChangeText={(email) => {
                  setState((prevState) => ({
                    ...prevState,
                    email,
                  }));
                }}
                returnKeyType="next"
                required
              />
            </Item>
            <Item floatingLabel>
              <Label style={styles.label}>Password</Label>
              <Input
                style={styles.label}
                value={state.password}
                secureTextEntry
                onChangeText={(password) => {
                  setState((prevState) => ({
                    ...prevState,
                    password,
                  }));
                }}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                required
              />
            </Item>
            <View>
              <Button rounded style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
              </Button>
            </View>
          </Form>
        </Content>
      </ImageBackground>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //  backgroundColor: 'blue',
  },
  mainView: {
    //  backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.9,
  },
  form: {
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    width: '90%',
  },
  button: {
    marginTop: 20,
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'grey',
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  label: {
    color: 'white',
  },
});

export default AuthScreen;
