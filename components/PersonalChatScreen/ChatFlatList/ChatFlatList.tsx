import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { formatDate, formatTime } from '../../../utils/Time/formatTime.ts';
import ChatAudioMessageWave from '../ChatAudioMessageWave/ChatAudioMessageWave.tsx';
import { defaultVideoThumbnail } from '../../../screens/PersonalChat/temp.ts';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './ChatFlatList.styles.ts';
import { IChatFlatListProps } from '../../../interfaces/Chat/personalChat.ts';
import React from 'react';

export default function ChatFlatList({
  item,
  index,
  messages,
}: IChatFlatListProps) {
  const isMe = item.from === 'me';
  const isImage = item.type === 'image';
  const isAudio = item.type === 'audio';
  const isVideo = item.type === 'video';

  const currentDate = formatDate(item.timestamp);
  const prevDate = index > 0 ? formatDate(messages[index - 1].timestamp) : null;

  const showDateSeparator = currentDate !== prevDate;

  return (
    <View style={styles.container}>
      {showDateSeparator && (
        <View style={styles.dateSeparator}>
          <View style={styles.dateLine} />
          <Text style={styles.dateText}>{currentDate}</Text>
          <View style={styles.dateLine} />
        </View>
      )}

      <View style={styles.messageWrapper}>
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myMessage : styles.theirMessage,
            (isImage || isAudio) && styles.mediaBubble,
          ]}
        >
          {isImage && (
            <>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.messageImage}
              />
              {!!item.caption && (
                <Text style={styles.messageText}>{item.caption}</Text>
              )}
            </>
          )}

          {isAudio && (
            <View style={styles.audioCard}>
              <View style={styles.audioRow}>
                <View style={styles.audioPlay}>
                  <Icon name="play" size={12} color="#fff" />
                </View>
                <Text style={styles.audioDuration}>
                  {item.duration ?? '0:20'}
                </Text>
                <ChatAudioMessageWave />
              </View>
            </View>
          )}

          {isVideo && (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.videoContainer}
              >
                <ImageBackground
                  source={{
                    uri: item.thumbnailUrl ?? defaultVideoThumbnail,
                  }}
                  style={styles.videoThumb}
                  imageStyle={styles.videoThumbImage}
                >
                  <View style={styles.videoPlayOverlay}>
                    <View style={styles.videoPlayBtn}>
                      <Icon name="play" size={14} color="#fff" />
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>

              {!!item.caption && (
                <Text style={styles.messageText}>{item.caption}</Text>
              )}
            </>
          )}

          {!isImage && !isAudio && (
            <Text style={styles.messageText}>{item.text}</Text>
          )}

          <Text
            style={[styles.time, isMe ? styles.timeRight : styles.timeLeft]}
          >
            {formatTime(item.timestamp)}
            {isMe && item.status ? ` · ${item.status}` : ''}
          </Text>
        </View>
      </View>
    </View>
  );
}
