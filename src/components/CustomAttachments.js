/* eslint-disable react/display-name */
import React, {useRef, useState} from 'react';
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native';
import {useMessageContext} from 'stream-chat-react-native';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import {VoiceMessageAttachment} from './VoiceMessageAttachment';
import {PollAttachment} from './PollAttachment';

const styles = StyleSheet.create({
  loadingIndicatorContainer: {
    padding: 7,
  },
  container: {
    padding: 5,
    width: 250,
  },
  audioPlayerContainer: {flexDirection: 'row', alignItems: 'center'},
  progressDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressDetailsText: {
    paddingHorizontal: 5,
    color: 'grey',
    fontSize: 10,
  },
  progressIndicatorContainer: {
    flex: 1,
    backgroundColor: '#e2e2e2',
  },
  progressLine: {
    borderWidth: 1,
    borderColor: 'black',
  },
});

export const CustomAttachments = props => {
  if (props.type === 'voice-message') {
    return <VoiceMessageAttachment {...props} />;
  }

  if (props.type === 'poll') {
    return <PollAttachment {...props} />;
  }

  return null;
};
