export type ChatProps = {
  chat: Chat;
};

export interface Message {
    from: string;       // userId or "me"
    text: string;
    timestamp: number;  // ISO 8601 timestamp
}

export interface Chat {
    id: string;         // unique chat ID
    username: string;
    lastSeen: number;   // last seen timestamp
    messages: Message[];
}
