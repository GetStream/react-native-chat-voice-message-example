/* eslint-disable react/display-name */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ChannelPreviewMessage} from 'stream-chat-react-native';

import MicIcon from '../icons/mic.svg';

const styles = StyleSheet.create({
  voiceMessagePreview: {
    flexDirection: 'row',
  },
  voiceMessagePreviewText: {
    marginHorizontal: 5,
    color: 'grey',
    fontSize: 12,
  },
});

export const ListPreviewMessage = ({latestMessagePreview}) => {
  const latestMessageAttachments =
    latestMessagePreview.messageObject?.attachments;

  if (
    latestMessageAttachments &&
    latestMessageAttachments.length === 1 &&
    latestMessageAttachments[0].type === 'voice-message'
  ) {
    return (
      <View style={styles.voiceMessagePreview}>
        <MicIcon height="15" width="15" />
        <Text style={styles.voiceMessagePreviewText}>Voice Message</Text>
      </View>
    );
  }

  return <ChannelPreviewMessage latestMessagePreview={latestMessagePreview} />;
};
