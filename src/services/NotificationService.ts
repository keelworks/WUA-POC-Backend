import { Expo, ExpoPushTicket } from 'expo-server-sdk';

import UserProfileDTO from '../models/DTO/UserProfile/UserProfileDTO.js';

export class NotificationService {
    private expo: Expo;

    constructor() {
        this.expo = new Expo();
    }

    // TODO: Send a message to a user
    async sendMessageToUser(user: UserProfileDTO, message: MessageDTO): Promise<ExpoPushTicket[]> {
        // This is a placeholder implementation. In a real application, you would retrieve the user's push token from the database and send a notification to it.
        console.log('Sending notification...');
        return [];
    }

    // TODO: Send a message to all users
    async sendMessageToAllUsers(message: MessageDTO): Promise<ExpoPushTicket[]> {
        // This is a placeholder implementation. In a real application, you would retrieve the user's push token from the database and send a notification to it.
        console.log('Sending notification...');
        return [];
    }

    async sendNotification(pushToken: string, title: string, message: string): Promise<ExpoPushTicket[]> {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            return [];
        }

        const notification = {
            to: pushToken,
            sound: 'default',
            title: title,
            body: message,
        };

        let tickets = await this.expo.sendPushNotificationsAsync([notification]);

        return tickets;
    }

    async sendNotifications(pushTokens: string[], title: string, message: string): Promise<ExpoPushTicket[]> {
        let notifications = [];
        
        for (let token of pushTokens) {
            if (!Expo.isExpoPushToken(token)) {
                console.error(`Push token ${token} is not a valid Expo push token`);
                continue;
            }

            notifications.push({
                to: token,
                sound: 'default',
                title: title,
                body: message
            });
        };

        // Expo recommends sending notifications in batches of 100
        let chunks = this.expo.chunkPushNotifications(notifications);
        let tickets: ExpoPushTicket[] = [];

        for (let chunk of chunks) {
            try {
                let ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Error sending notification chunk:', error);
            }
        }

        return tickets; 
    }
}
