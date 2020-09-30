import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {dialogFlowConfig} from './../env';
import {v4 as uuidv4} from 'uuid';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from 'react-native-elements';
import Voice from '@react-native-community/voice';
import * as authActions from './../store/actions/auth';
import AsyncStorage from '@react-native-community/async-storage';

const BOT_USER = {
  _id: 2,
  name: 'Ice Cream Bot',
  avatar:
    'https://previews.123rf.com/images/iulika1/iulika11909/iulika1190900021/129697389-medical-worker-health-professional-avatar-medical-staff-doctor-icon-isolated-on-white-background-vec.jpg',
};

var speak = 0;

class DialogFlowChatVoice extends Component {
  constructor(props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;

    Tts.addEventListener('tts-start', (event) => console.log('start', event));
    Tts.addEventListener('tts-finish', () => {
      if (Platform.OS === 'android') {
        this.micHandler();
      }
    });
    Tts.addEventListener('tts-cancel', (event) => console.log('cancel', event));

    this.state = {
      messages: [
        {
          _id: 1,
          text: 'Hi! I am the HealthCare Bot 🤖.\n\nHow may I help you today?',
          createdAt: new Date(),
          user: BOT_USER,
        },
      ],
      token: '',
      speechText: '',
      showLoader: false,
      animated: new Animated.Value(0),
      opacityA: new Animated.Value(1),
    };
  }

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogFlowConfig.client_email,
      dialogFlowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogFlowConfig.project_id,
    );

    //  this.getToken();
  }

  async getToken() {
    let physicianData = await AsyncStorage.getItem('userData');
    physicianData = JSON.parse(physicianData);
    const token = physicianData.token;
    this.setState({
      token,
    });
    console.log('token', token);
  }

  uuidGen = () => {
    return uuidv4();
  };

  micHandler = async () => {
    this.setState({
      showLoader: true,
    });
    this._runAnimation();
    try {
      await Voice.start('en-US', {
        EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 5000,
        EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 10000,
        EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 10000,
      });
    } catch (e) {
      console.error(e);
    }
  };

  onSpeechResults = async (speech) => {
    console.log('onSpeechResults event: ', speech.value[0]);

    this.setState({
      speechText: speech.value[0],
    });

    speak = 1;
    let StateVariable = [
      {
        text: speech.value[0],
        user: {
          _id: 1,
        },
        createdAt: new Date(),
        _id: Math.random(),
      },
    ];
    this.onSend(StateVariable);
  };

  onSend(messages = []) {
    console.log('onSend messages', messages);
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log('response error dialog flow', error),
    );
  }

  async handleGoogleResponse(result) {
    console.log('dialog flow result', JSON.stringify(result));
    let receivedText = '';

    if (
      result.queryResult.queryText &&
      result.queryResult.parameters.MRN &&
      Number.isInteger(result.queryResult.parameters.MRN)
    ) {
      receivedText = 'Fetching patient details';
      const mrn = 'PU' + result.queryResult.parameters.MRN;
      try {
        const response = await fetch(
          `https://clinicareapiqa.sdglobaltech.com/alexa/getPatientInfo/mobile/${mrn}`,
        );

        if (!response.ok) {
          receivedText = 'Please share a valid MRN.';
        } else if (response.ok) {
          const patientData = await response.json();
          console.log('patient data', patientData);
          receivedText = 'Here are the patient details:-\n';
          receivedText = receivedText + `Patient name is ${patientData.name}\n`;
          receivedText =
            receivedText +
            "The patient's recently recorded vitals are as follows:\n";
          const vitalsArray = patientData.vitals;
          if (vitalsArray.length > 0) {
            vitalsArray.forEach((vitals) => {
              if (vitals.vitalValue) {
                let vitalName = vitals.vitalName.toLowerCase();
                receivedText =
                  receivedText +
                  `Patient ${vitalName} is ${vitals.vitalValue}\n`;
              }
            });
          }

          console.log('receivedText', receivedText);

          //  (
          //   <View>
          //     <Text>Following is the patient details</Text>
          //   </View>
          // );
        }
      } catch (err) {
        console.error('patient details api error', err);
        receivedText = 'Please share a valid MRN.';
      }
    } else {
      receivedText = result.queryResult.fulfillmentText;
    }

    this.sendBotResponse(receivedText);
  }

  async sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };

    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, msg),
    }));

    if (speak) {
      try {
        //  await Voice.stop();
      } catch (e) {
        console.error(e);
      }
      speak = 0;
      Tts.getInitStatus().then(
        () => {
          Tts.setDucking(true);
          if (Platform.OS === 'android') {
            Tts.speak(text);
          } else {
            Tts.speak(text, {
              iosVoiceId: 'com.apple.ttsbundle.siri_female_en-US_compact',
            });
          }
        },
        (err) => {
          if (err.code === 'no_engine') {
            Tts.requestInstallEngine();
          }
        },
      );
    }
  }

  onSpeechStart = () => {};

  onSpeechRecognized = (speech) => {
    console.log('onSpeechRecognized: ', speech, speech.isFinal);
  };

  onSpeechEnd = (speech) => {
    this.setState({
      showLoader: false,
    });
    console.log('onSpeechEnd: ', speech);
  };

  onSpeechError = (error) => {
    this.setState({
      showLoader: false,
    });
    console.log('onSpeechError: ', error);
  };

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onLogout() {
    this.props.store.dispatch(authActions.logout);
  }

  renderBubble(props) {
    //  console.log('renderBubble', props);
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: '#6646ee',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  }

  renderMessage() {
    return (
      <View>
        <Text />
      </View>
    );
  }

  _runAnimation() {
    const {animated, opacityA} = this.state;

    Animated.loop(
      Animated.parallel([
        Animated.timing(animated, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(opacityA, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }
  _stopAnimation() {
    const {animated, opacityA} = this.state;
    Animated.loop(
      Animated.parallel([Animated.timing(animated), Animated.timing(opacityA)]),
    ).stop();
  }

  renderLoading() {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  render() {
    const {animated, opacityA} = this.state;
    return (
      <View style={styles.screen}>
        <View style={styles.chat}>
          <GiftedChat
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            placeholder="Type your message here..."
            alwaysShowSend
            renderLoading={this.renderLoading}
            //   renderMessage={this.renderMessage}
            renderBubble={this.renderBubble}
            user={{
              _id: 1,
            }}
          />
          <Button
            icon={<Icon name="microphone" size={24} color="white" />}
            onPress={this.micHandler}
          />
          {this.state.showLoader && (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 0.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Animated.View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: 'blue',
                    opacity: opacityA,
                    transform: [
                      {
                        scale: animated,
                      },
                    ],
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Button
                  icon={
                    <Icon name="microphone-slash" size={24} color="white" />
                  }
                  onPress={async () => {
                    this._stopAnimation();
                    await Voice.stop();
                  }}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chat: {
    flex: 1,
    marginBottom: 25,
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default DialogFlowChatVoice;
