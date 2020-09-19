import React from 'react';
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
import {View, StyleSheet, ImageBackground} from 'react-native';

const imgUrl = require('./../../assets/background.png');

const AuthScreen = (props) => {
  let error = true;

  return (
    <Container style={styles.container}>
      <ImageBackground source={imgUrl} style={styles.image}>
        <Content contentContainerStyle={styles.mainView}>
          <Form style={styles.form}>
            <Item
              floatingLabel
              //    error={error === true ? true : ''}
            >
              <Label style={styles.label}>Username</Label>
              <Input style={styles.label} />
            </Item>
            <Item floatingLabel>
              <Label style={styles.label}>Password</Label>
              <Input style={styles.label} />
            </Item>
            <View>
              <Button rounded style={styles.button}>
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
