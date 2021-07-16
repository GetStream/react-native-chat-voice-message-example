/* eslint-disable react/display-name */
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  AttachButton,
  SendButton,
  useChatContext,
  useMessageInputContext,
  useMessagesContext,
  ImageUploadPreview,
  FileUploadPreview,
  AutoCompleteInput,
  useChannelContext,
} from 'stream-chat-react-native';

import MicIcon from '../icons/mic.svg';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const styles = StyleSheet.create({
  flex: {flex: 1},
  fullWidth: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    height: 40,
  },
  autoCompleteInputContainer: {
    marginHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
  },
});

export const InputBox = () => {
  const {client} = useChatContext();
  const {text, giphyActive, imageUploads, fileUploads, toggleAttachmentPicker} =
    useMessageInputContext();
  const {updateMessage} = useMessagesContext();
  const {channel} = useChannelContext();

  const [recordingActive, setRecordingActive] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState(0);

  const sendVoiceMessage = async uri => {
    // Compose a message object to be sent.
    const message = {
      created_at: new Date(),
      attachments: [
        {
          asset_url: uri,
          file_size: 200,
          mime_type: 'audio/mp4',
          title: 'test.mp4',
          type: 'voice-message',
          audio_length: recordTime,
        },
      ],
      mentioned_users: [],
      id: `random-id-${new Date().toTimeString()}`,
      status: 'sending',
      type: 'regular',
      user: client.user,
    };

    // Add the message optimistically to local state first.
    updateMessage(message);

    // Upload the file to cdn.
    const res = await channel.sendFile(uri, 'test.mp4', 'audio/mp4');
    const {
      created_at,
      html,
      type,
      status,
      user,
      ...messageWithoutReservedFields
    } = message;

    messageWithoutReservedFields.attachments[0].asset_url = res.file;

    // Send the message on channel.
    await channel.sendMessage(messageWithoutReservedFields);
  };

  const onStartRecord = async () => {
    setRecordingActive(true);

    await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener(e => {
      setRecordSecs(e.currentPosition);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));

      return;
    });
  };

  const onStopRecord = async () => {
    setRecordingActive(false);

    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);

    await sendVoiceMessage(result);
  };

  const sendPoll = async () => {
    const message = {
      text: 'What food would you like?',
      attachments: [
        {
          type: 'poll',
          multipleChoiceVote: false,
          votingOptions: [
            {
              id: 'option1',
              value: 'Pizza',
            },
            {
              id: 'option2',
              value: 'Indian Curry',
            },
            {
              id: 'option3',
              value: 'Dutch Sandwiches',
            },
            {
              id: 'option4',
              value: 'Stakes',
            },
          ],
        },
      ],
    };

    await channel.sendMessage(message);
  };

  const emptyInput =
    !text && !imageUploads.length && !fileUploads.length && !giphyActive;

  return (
    <View style={styles.fullWidth}>
      <ImageUploadPreview />
      <FileUploadPreview />
      <View style={[styles.fullWidth, styles.row, styles.inputContainer]}>
        {!recordingActive ? (
          <View style={[styles.flex, styles.row]}>
            <AttachButton handleOnPress={() => sendPoll()} />
            <View style={styles.autoCompleteInputContainer}>
              <AutoCompleteInput />
            </View>
          </View>
        ) : (
          <View style={styles.flex}>
            <Text>Recording Voice {recordTime}</Text>
          </View>
        )}
        {emptyInput ? (
          <TouchableOpacity
            onLongPress={onStartRecord}
            onPressOut={onStopRecord}>
            <MicIcon width={22} height={22} />
          </TouchableOpacity>
        ) : (
          <SendButton />
        )}
      </View>
    </View>
  );
};
