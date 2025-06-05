import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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

export const ChatList = () => {
  const [search, setSearch] = useState("");
  const filteredChats = Object.entries(chatsData).filter(([id, chat]) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 border-r h-full w-72 bg-gray-100 flex flex-col">
      <input
        className="mb-4 px-3 py-2 rounded border focus:outline-none"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex-1 overflow-auto">
        {filteredChats.length === 0 && <p>Чаты не найдены</p>}
        {filteredChats.map(([id, chat]) => (
          <Link
            key={id}
            to={`/chat/${id}`}
            className="block p-3 mb-2 rounded hover:bg-blue-200"
          >
            {chat.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export const Chat = () => {
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId || "";
  const chatIdNum = Number(chatId);

  const chat = chatsData[chatIdNum];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!chat) return;
    const saved = localStorage.getItem(LOCALSTORAGE_KEY_PREFIX + chatId);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      } catch {
        setMessages(chat.messages);
      }
    } else {
      setMessages(chat.messages);
    }
    setInput("");
  }, [chatId, chat]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: messages.length > 0 ? messages[messages.length - 1].id + 1 : 1,
      text: input,
      fromMe: true,
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(LOCALSTORAGE_KEY_PREFIX + chatId, JSON.stringify(updatedMessages));
    setInput("");
  };

  if (!chat) {
    return <div className="p-4">Чат не найден</div>;
  }

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50 flex-1">
      <h2 className="text-xl font-bold mb-4">{chat.name}</h2>

      <div className="flex-1 overflow-auto mb-4 border rounded p-4 bg-white flex flex-col space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`
              max-w-[70%] px-4 py-2 rounded-lg break-words
              ${msg.fromMe
                ? "bg-blue-600 text-white self-end rounded-br-sm"
                : "bg-gray-200 text-black self-start rounded-bl-sm"
              }
            `}
            style={{ wordBreak: "break-word" }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};
