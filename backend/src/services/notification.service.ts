import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { PrismaClient } from '@prisma/client';

const expo = new Expo();
const prisma = new PrismaClient();

export const sendPushNotification = async (userId: string, title: string, body: string, data: any = {}) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user || !user.pushToken) {
      console.log(`User ${userId} has no push token. Skipping notification.`);
      return false;
    }

    if (!Expo.isExpoPushToken(user.pushToken)) {
      console.error(`Push token ${user.pushToken} is not a valid Expo push token`);
      return false;
    }

    const messages: ExpoPushMessage[] = [{
      to: user.pushToken,
      sound: 'default',
      title,
      body,
      data,
    }];

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending push chunk:', error);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in sendPushNotification:', error);
    return false;
  }
};

export const notifyAllEditors = async (title: string, body: string, data: any = {}) => {
  try {
    const editors = await prisma.user.findMany({
      where: { 
        role: 'EDITOR',
        pushToken: { not: null }
      }
    });

    const messages: ExpoPushMessage[] = editors
      .filter(u => u.pushToken && Expo.isExpoPushToken(u.pushToken))
      .map(user => ({
        to: user.pushToken as string,
        sound: 'default',
        title,
        body,
        data,
      }));

    if (messages.length === 0) return false;

    const chunks = expo.chunkPushNotifications(messages);
    
    for (const chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error('Error sending push chunk to editors:', error);
      }
    }
    return true;
  } catch (error) {
    console.error('Error notifying all editors:', error);
    return false;
  }
};
