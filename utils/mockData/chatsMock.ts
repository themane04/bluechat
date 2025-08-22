import {Chat} from "../../interfaces/Chat/chat.ts";

export const chats: Chat[] = [
    {
        id: "c1",
        userId: "u1",
        messages: [
            { from: "u1", text: "Hey!", timestamp: "2025-08-22T09:00:00Z" },
            { from: "me", text: "Yo!", timestamp: "2025-08-22T09:01:30Z" },
            { from: "u1", text: "How’s the project going?", timestamp: "2025-08-22T09:02:10Z" }
        ]
    },
    {
        id: "c2",
        userId: "u2",
        messages: [
            { from: "u2", text: "Did you finish?", timestamp: "2025-08-22T10:15:00Z" },
            { from: "me", text: "Almost done, will send soon.", timestamp: "2025-08-22T10:16:45Z" }
        ]
    },
    {
        id: "c3",
        userId: "u3",
        messages: [
            { from: "u3", text: "Want to meet later?", timestamp: "2025-08-22T11:20:00Z" },
            { from: "me", text: "Sure, 6 PM works!", timestamp: "2025-08-22T11:21:10Z" }
        ]
    }
];
