import React, {Component, useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, Image, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Voice from '@react-native-community/voice';
import {Button} from 'react-native-elements';

const DialogFlowChat = (props) => {
  const [voiceState, setVoiceState] = useState({
    recognized: '',
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
  });

  const voiceChat = useCallback(() => {
    console.log('callback');
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    Voice.destroy().then(Voice.removeAllListeners);
  }, [onSpeechStart]);

  useEffect(() => {
    console.log('inside');
    voiceChat();
  }, []);

  const onSpeechStart = (e) => {
    console.log('onSpeechStart: ', e);
    setVoiceState({...voiceState, started: '√'});
  };

  const onSpeechRecognized = (e) => {
    console.log('onSpeechRecognized: ', e);
    setVoiceState({
      ...voiceState,
      recognized: '√',
    });
  };

  const onSpeechEnd = (e) => {
    console.log('onSpeechEnd: ', e);
    setVoiceState({
      ...voiceState,
      end: '√',
    });
  };

  const onSpeechError = (e) => {
    console.log('onSpeechError: ', e);
    setVoiceState({
      ...voiceState,
      error: JSON.stringify(e.error),
    });
  };

  const onSpeechResults = (e) => {
    console.log('onSpeechResults: ', e);
    setVoiceState({
      ...voiceState,
      results: e.value,
    });
  };

  const onSpeechPartialResults = (e) => {
    console.log('onSpeechPartialResults: ', e);
    setVoiceState({
      ...voiceState,
      partialResults: e.value,
    });
  };

  const onSpeechVolumeChanged = (e) => {
    console.log('onSpeechVolumeChanged: ', e);
    setVoiceState({
      ...voiceState,
      pitch: e.value,
    });
  };

  const _startRecognizing = async () => {
    setVoiceState({
      ...voiceState,
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    setVoiceState({
      ...voiceState,
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to React Native Voice!</Text>
      <Text style={styles.instructions}>
        Press the button and start speaking.
      </Text>
      <Text style={styles.stat}>{`Started: ${voiceState.started}`}</Text>
      <Text style={styles.stat}>{`Recognized: ${voiceState.recognized}`}</Text>
      <Text style={styles.stat}>{`Pitch: ${voiceState.pitch}`}</Text>
      <Text style={styles.stat}>{`Error: ${voiceState.error}`}</Text>
      <Text style={styles.stat}>Results</Text>
      {voiceState.results.map((result, index) => {
        return (
          <Text key={`result-${index}`} style={styles.stat}>
            {result}
          </Text>
        );
      })}
      <Text style={styles.stat}>Partial Results</Text>
      {voiceState.partialResults.map((result, index) => {
        return (
          <Text key={`partial-result-${index}`} style={styles.stat}>
            {result}
          </Text>
        );
      })}
      <Text style={styles.stat}>{`End: ${voiceState.end}`}</Text>
      <Button
        icon={<Icon name="microphone" size={24} color="white" />}
        onPress={_startRecognizing}
      />

      <TouchableHighlight onPress={_stopRecognizing}>
        <Text style={styles.action}>Stop Recognizing</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={_cancelRecognizing}>
        <Text style={styles.action}>Cancel</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={_destroyRecognizer}>
        <Text style={styles.action}>Destroy</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    paddingVertical: 8,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
    marginTop: 30,
  },
});

export default DialogFlowChat;
