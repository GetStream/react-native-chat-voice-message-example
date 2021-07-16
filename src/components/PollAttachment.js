/* eslint-disable react/display-name */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useMessageContext} from 'stream-chat-react-native';

import RadioForm from 'react-native-simple-radio-button';

const styles = StyleSheet.create({
  container: {
    padding: 5,
    width: 250,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  votePercentContainer: {
    width: 50,
  },
});

export const PollAttachment = ({type, votingOptions, multipleChoiceVote}) => {
  const {channel, message} = useMessageContext();

  const ownReactions = message.own_reactions;
  const hasVoted = ownReactions.some(
    reaction => reaction.type.indexOf('option') === 0,
  );

  if (hasVoted) {
    const voteCounts = message.reaction_counts;
    const totalNumberOfVotes = Object.keys(voteCounts).reduce(
      (acc, reactionType) => {
        if (reactionType.indexOf('option') === 0) {
          return acc + voteCounts[reactionType];
        }

        return acc;
      },
      0,
    );

    return (
      <View style={styles.container}>
        {votingOptions.map(option => (
          <View style={styles.row} key={option.id}>
            <View style={styles.votePercentContainer}>
              <Text>
                {((voteCounts[option.id] || 0) / totalNumberOfVotes) * 100} %
              </Text>
            </View>
            <Text>{option.value}</Text>
          </View>
        ))}
      </View>
    );
  }
  const radioProps = votingOptions.map(v => ({
    label: v.value,
    value: v.id,
  }));

  return (
    <View style={styles.container}>
      <RadioForm
        radio_props={radioProps}
        initial={-1}
        onPress={value => {
          channel.sendReaction(message.id, {
            type: value,
          });
        }}
      />
    </View>
  );
};
