/* eslint-disable react/display-name */
import React, {useRef, useState} from 'react';
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native';
import {useMessageContext} from 'stream-chat-react-native';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';

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

export const VoiceMessageAttachment = ({audio_length, asset_url, type}) => {
  const {message} = useMessageContext();
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentDurationSec, setCurrentDurationSec] = useState(audio_length);
  const [playTime, setPlayTime] = useState(0);
  const [duration, setDuration] = useState(audio_length);
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const onStartPlay = async () => {
    setPaused(false);
    setLoadingAudio(true);
    await audioRecorderPlayer.startPlayer(asset_url);

    setLoadingAudio(false);
    audioRecorderPlayer.addPlayBackListener(e => {
      if (e.currentPosition < 0) {
        return;
      }

      setCurrentPositionSec(e.currentPosition);
      setCurrentDurationSec(e.duration);
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));

      if (e.currentPosition === e.duration) {
        onStopPlay();
      }
      return;
    });
  };

  const onPausePlay = async () => {
    setPaused(true);
    await audioRecorderPlayer.pausePlayer();
  };

  const onStopPlay = async () => {
    setPaused(false);
    setCurrentPositionSec(0);
    setPlayTime(0);
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  if (type !== 'voice-message') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.audioPlayerContainer}>
        {message.status === 'sending' || loadingAudio ? (
          <View style={styles.loadingIndicatorContainer}>
            <ActivityIndicator size="small" />
          </View>
        ) : currentPositionSec > 0 && !paused ? (
          <Button title={'Pause'} onPress={onPausePlay} />
        ) : (
          <Button title={'Start'} onPress={onStartPlay} />
        )}
        <View style={styles.progressIndicatorContainer}>
          <View
            style={[
              styles.progressLine,
              {
                width: `${(currentPositionSec / currentDurationSec) * 100}%`,
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.progressDetailsContainer}>
        <Text style={styles.progressDetailsText}>Progress: {playTime}</Text>
        <Text style={styles.progressDetailsText}>Duration: {duration}</Text>
      </View>
    </View>
  );
};
