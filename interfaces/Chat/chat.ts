export interface Message {
    from: string;       // userId or "me"
    text: string;
    timestamp: string;  // ISO 8601 timestamp
}

export interface Chat {
    id: string;         // unique chat ID
    userId: string;     // the user this chat is with
    messages: Message[];
}