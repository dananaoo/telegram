import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { askGemini } from "../../shared/lib/askGemini";

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
  const filteredChats = Object.entries(chatsData).filter(([, chat]) =>
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
  const isBotChat = chatIdNum === 101 || chatIdNum === 102;

  const [input, setInput] = useState("");
  const queryClient = useQueryClient();

  const { data: messages, isLoading, isError } = useQuery({
    queryKey: ["chatMessages", chatIdNum],
    queryFn: () => fetchChatMessages(chatIdNum),
    enabled: !!chat,
  });

  // Мутация для отправки сообщения
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!chat) throw new Error("Чат не найден");
      if (!text.trim()) return;

      const currentMessages: Message[] = await fetchChatMessages(chatIdNum);
      const userMessage: Message = {
        id: currentMessages.length > 0 ? currentMessages[currentMessages.length - 1].id + 1 : 1,
        text,
        fromMe: true,
      };
      const updated = [...currentMessages, userMessage];
      localStorage.setItem(LOCALSTORAGE_KEY_PREFIX + chatId, JSON.stringify(updated));

      if (isBotChat) {
        // Используем Gemini API для ответа бота
        try {
          const botReply = await askGemini(text);
          const botMessage: Message = {
            id: userMessage.id + 1,
            text: botReply,
            fromMe: false,
          };
          const updatedWithBot = [...updated, botMessage];
          localStorage.setItem(LOCALSTORAGE_KEY_PREFIX + chatId, JSON.stringify(updatedWithBot));
        } catch (e) {
          console.error("Gemini error:", e);
          const botMessage: Message = {
            id: userMessage.id + 1,
            text: "Ошибка ответа от Gemini",
            fromMe: false,
          };
          const updatedWithBot = [...updated, botMessage];
          localStorage.setItem(LOCALSTORAGE_KEY_PREFIX + chatId, JSON.stringify(updatedWithBot));
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatMessages", chatIdNum] });
      setInput("");
    },
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;
    sendMessageMutation.mutate(input);
  };

  if (!chat) {
    return <div className="p-4">Чат не найден</div>;
  }

  if (isLoading) {
    return <div className="p-4">Загрузка сообщений...</div>;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Ошибка загрузки сообщений</div>;
  }

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50 flex-1">
      <h2 className="text-xl font-bold mb-4">{chat.name}</h2>

      <div className="flex-1 overflow-auto mb-4 border rounded p-4 bg-white flex flex-col space-y-2">
        {messages && messages.map((msg) => (
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
              handleSendMessage();
            }
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleSendMessage}
          disabled={!input.trim() || sendMessageMutation.isPending}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

// Эмулируем асинхронный fetch сообщений чата
export const fetchChatMessages = async (chatId: number): Promise<Message[]> => {
  const chat = chatsData[chatId];
  if (!chat) throw new Error("Чат не найден");
  const saved = localStorage.getItem(LOCALSTORAGE_KEY_PREFIX + chatId);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return chat.messages;
    }
  }
  return chat.messages;
};
