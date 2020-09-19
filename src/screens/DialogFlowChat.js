import React, {Component} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {dialogFlowConfig} from './../env';
import {v4 as uuidv4} from 'uuid';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from 'react-native-elements';
import Voice from '@react-native-community/voice';

const BOT_USER = {
  _id: 2,
  name: 'Ice Cream Bot',
  avatar:
    'https://previews.123rf.com/images/iulika1/iulika11909/iulika1190900021/129697389-medical-worker-health-professional-avatar-medical-staff-doctor-icon-isolated-on-white-background-vec.jpg',
};

var speak = 0;

export default class App extends Component {
  constructor(props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
  }

  state = {
    messages: [
      {
        _id: 1,
        text: 'Hi! I am the IceCreambot 🤖.\n\nHow may I help you today?',
        createdAt: new Date(),
        user: BOT_USER,
      },
    ],
    speechText: '',
  };

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogFlowConfig.client_email,
      dialogFlowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogFlowConfig.project_id,
    );
  }

  uuidGen = () => {
    return uuidv4();
  };

  micHandler = async () => {
    try {
      await Voice.start('en-US');
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
      (error) => console.log(error),
    );
  }

  async handleGoogleResponse(result) {
    let receivedText = '';
    let splitReceivedText = '';
    var extractDate = '';
    const dateRegex = /\d{4}\-\d{2}\-\d{2}?/gm;

    receivedText = result.queryResult.fulfillmentMessages[0].text.text[0];
    console.log('receivedText', receivedText);
    splitReceivedText = receivedText;
    extractDate = receivedText.match(dateRegex);

    if (extractDate != null) {
      var completeTimeValue = splitResponseForTime(receivedText);
      var timeValue = getTimeValue(completeTimeValue);
      function splitResponseForTime(str) {
        return str.split('at')[1];
      }

      function getTimeValue(str) {
        let time1 = str.split('T')[1];
        let hour = time1.split(':')[0];
        let min = time1.split(':')[1];
        return hour + ':' + min;
      }
      splitReceivedText =
        splitReceivedText + 'on ' + extractDate[0] + ' at ' + timeValue;
    }
    this.sendBotResponse(splitReceivedText);
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
        await Voice.stop();
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

  onSpeechStart = () => {
    this.setState({
      started: '√',
    });
  };

  onSpeechRecognized = (speech) => {
    console.log('onSpeechRecognized: ', speech);
  };

  onSpeechEnd = () => {
    console.log('onSpeechEnd: ');
    this.setState({
      end: '√',
    });
  };

  onSpeechError = (speech) => {
    console.log('onSpeechError: ', speech);
    this.setState({
      error: JSON.stringify(speech.error),
    });
  };

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  render() {
    return (
      <View style={styles.screen}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        <Button
          icon={<Icon name="microphone" size={24} color="white" />}
          onPress={this.micHandler}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
