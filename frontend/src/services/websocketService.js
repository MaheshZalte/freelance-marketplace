// src/services/websocketService.js

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let isConnected = false;
let notificationSubscription = null;
const pendingSubscriptions = [];

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ;


const createSubscriptionHandle = (destination, callback) => {
  const pending = {
    active: true,
    destination,
    subscription: null,
    callback,
  };

  const subscribeNow = () => {
    if (!pending.active || !stompClient || !isConnected) {
      return;
    }

    pending.subscription = stompClient.subscribe(destination, callback);
  };

  if (stompClient && isConnected) {
    subscribeNow();
  } else {
    pendingSubscriptions.push(pending);
  }

  return {
    unsubscribe: () => {
      pending.active = false;
      pending.subscription?.unsubscribe();
    },
  };
};

const flushPendingSubscriptions = () => {
  while (pendingSubscriptions.length > 0) {
    const pending = pendingSubscriptions.shift();

    if (pending.active && stompClient && isConnected) {
      pending.subscription = stompClient.subscribe(
        pending.destination,
        pending.callback,
      );
    }
  }
};

export const connectWebSocket = (userId, onNotification = () => {}) => {
  if (stompClient?.active) {
    return stompClient;
  }

  stompClient = new Client({
    reconnectDelay: 5000,
    webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
    onConnect: () => {
      isConnected = true;

      if (userId) {
        notificationSubscription?.unsubscribe();
        notificationSubscription = stompClient.subscribe(
          `/topic/notifications/${userId}`,
          (message) => {
            onNotification(JSON.parse(message.body));
          },
        );
      }

      flushPendingSubscriptions();
    },
    onDisconnect: () => {
      isConnected = false;
    },
    onWebSocketClose: () => {
      isConnected = false;
    },
    onStompError: (frame) => {
      console.log("Broker Error:", frame);
    },
  });

  stompClient.activate();

  return stompClient;
};

export const disconnectWebSocket = () => {
  notificationSubscription?.unsubscribe();
  notificationSubscription = null;
  isConnected = false;

  if (stompClient) {
    stompClient.deactivate();
  }
};

export const subscribeToChat = (contractId, onMessage) => {
  return createSubscriptionHandle(`/topic/chat/${contractId}`, (message) => {
    onMessage(JSON.parse(message.body));
  });
};

export const sendChatMessage = (message) => {
  if (!stompClient || !isConnected) {
    return false;
  }

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(message),
  });

  return true;
};

export const sendTypingStatus = (contractId, senderName) => {
  if (!stompClient || !isConnected) {
    return false;
  }

  stompClient.publish({
    destination: "/app/chat.typing",
    body: JSON.stringify({
      contractId,
      senderName,
    }),
  });

  return true;
};

export const subscribeToTyping = (contractId, onTyping) => {
  return createSubscriptionHandle(`/topic/typing/${contractId}`, (message) => {
    onTyping(JSON.parse(message.body));
  });
};

export const subscribeToUserStatus = (onStatus) => {
  return createSubscriptionHandle("/topic/users/status", (message) => {
    onStatus(JSON.parse(message.body));
  });
};
