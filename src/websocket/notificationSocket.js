import { useNotificationStore } from '@/stores/notificationStore';

let stompClient = null;

export const connectNotificationSocket = (userEmail, userId) => {
    const notificationStore = useNotificationStore();
    
    // Check if SockJS & Stomp are globally or dynamically loaded, or fallback safely
    if (typeof window !== 'undefined' && window.SockJS && window.Stomp) {
        try {
            const socket = new window.SockJS('/ws');
            stompClient = window.Stomp.over(socket);
            stompClient.debug = null; // silence console noise

            stompClient.connect({}, () => {
                // Subscribe to user private channel
                if (userEmail) {
                    stompClient.subscribe(`/user/${userEmail}/notifications`, (message) => {
                        const payload = JSON.parse(message.body);
                        notificationStore.addRealtimeNotification(payload);
                    });
                }
                if (userId) {
                    stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
                        const payload = JSON.parse(message.body);
                        notificationStore.addRealtimeNotification(payload);
                    });
                }
            }, (error) => {
                console.warn('WebSocket connection error, retrying in 10s...', error);
                setTimeout(() => connectNotificationSocket(userEmail, userId), 10000);
            });
        } catch (e) {
            console.warn('Failed to initialize WebSocket client:', e);
        }
    }
};

export const disconnectNotificationSocket = () => {
    if (stompClient !== null) {
        stompClient.disconnect();
        stompClient = null;
    }
};
