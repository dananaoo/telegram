import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

type Message = { id: number; text: string; fromMe: boolean };
type ChatType = { name: string; messages: Message[] };

const chatsData: Record<number, ChatType> = {
  1: {
    name: "Aruzhan Zh",
    messages: [
      { id: 1, text: "Привет!", fromMe: false },
      { id: 2, text: "Привет, как дела?", fromMe: true },
    ],
  },
  2: {
    name: "Yernar K",
    messages: [
      { id: 1, text: "Здарова!", fromMe: false },
      { id: 2, text: "Привет!", fromMe: true },
    ],
  },
  101: {
    name: "AI Tutor",
    messages: [{ id: 1, text: "Здравствуйте! Чем могу помочь?", fromMe: false }],
  },
  102: {
    name: "Travel Bot",
    messages: [
      { id: 1, text: "Хотите узнать лучшие места для путешествий?", fromMe: false },
    ],
  },
};

const LOCALSTORAGE_KEY_PREFIX = "chat_messages_";

export const Chat = () => {
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId || "";
  const chatIdNum = Number(chatId);

  const chat = chatsData[chatIdNum];

  const loadMessages = (): Message[] => {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY_PREFIX + chatId);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return chat?.messages || [];
      }
    }
    return chat?.messages || [];
  };

  const [messages, setMessages] = useState<Message[]>(loadMessages());
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(loadMessages());
    setInput("");
  }, [chatId]);

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY_PREFIX + chatId, JSON.stringify(messages));
    // Скроллим вниз при новых сообщениях
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatId]);

  if (!chat) {
    return <div className="p-4">Чат не найден</div>;
  }

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: messages.length > 0 ? messages[messages.length - 1].id + 1 : 1,
      text: input,
      fromMe: true,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-xl font-bold mb-4">{chat.name}</h2>

      <div className="flex-1 overflow-auto mb-4 border rounded p-4 bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 max-w-[70%] p-2 rounded ${
              msg.fromMe ? "bg-[--primary-blue] text-white ml-auto" : "bg-gray-200 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};
