// src/pages/Chat.jsx

import { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";

import {
  connectWebSocket,
  subscribeToChat,
  sendChatMessage,
  sendTypingStatus,
  subscribeToTyping,
  subscribeToUserStatus,
} from "../services/websocketService";

import {
  getMessages,
  sendMessage,
  getConversations,
  uploadChatFile,
} from "../services/chatService";

import { getAllContracts } from "../services/contractService";

import { getUser } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const BASE_URL = API_URL.replace("/api", "");

function Chat() {
  const user = getUser();

  const { contractId } = useParams();

  const [messages, setMessages] = useState([]);

  const [content, setContent] = useState("");

  const [conversations, setConversations] = useState([]);

  const [activeChat, setActiveChat] = useState(null);

  const [typingUser, setTypingUser] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const messagesEndRef = useRef(null);

  const inputRef = useRef(null);

  const fileInputRef = useRef(null);

  const typingTimeoutRef = useRef(null);

  const fileBaseUrl = `${BASE_URL}/uploads`;

  const isImageFile = (fileUrl = "") =>
    /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(fileUrl);

  const appendMessage = (message) => {
    setMessages((prev) => {
      const exists = prev.some((msg) => msg.id === message.id);

      if (exists) {
        return prev;
      }

      return [...prev, message];
    });
  };

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // INITIAL LOAD
  useEffect(() => {
    const load = async () => {
      try {
        const [conversationData, contractData] = await Promise.all([
          getConversations(),
          getAllContracts(),
        ]);

        const data = Array.isArray(conversationData)
          ? [...conversationData]
          : [];

        (Array.isArray(contractData) ? contractData : []).forEach(
          (contract) => {
            const currentUserId = String(user.id || "");

            const client = contract.client;

            const freelancer = contract.freelancer;

            const partner =
              String(client?.id) === currentUserId ||
              client?.email === user.email
                ? freelancer
                : client;

            const exists = data.some(
              (conversation) =>
                String(conversation.contractId) === String(contract.id),
            );

            if (partner && !exists) {
              data.push({
                contractId: contract.id,
                userId: partner.id,
                userName: partner.name || partner.email || "Project partner",
                lastMessage: "Start the conversation",
                unreadCount: 0,
                online: Boolean(partner.online),
              });
            }
          },
        );

        setConversations(data);

        const selectedChat =
          data.find(
            (conversation) =>
              String(conversation.contractId) === String(contractId),
          ) || data[0];

        if (selectedChat) {
          setActiveChat(selectedChat);
        }
      } catch (error) {
        console.log(error);
      }
    };

    load();

    connectWebSocket(user.id);

    const statusSub = subscribeToUserStatus((status) => {
      setConversations((prev) =>
        prev.map((conversation) =>
          String(conversation.userId) === String(status.userId)
            ? {
                ...conversation,
                online: status.online,
              }
            : conversation,
        ),
      );

      setActiveChat((current) =>
        current && String(current.userId) === String(status.userId)
          ? {
              ...current,
              online: status.online,
            }
          : current,
      );
    });

    return () => {
      statusSub?.unsubscribe();
    };
  }, [contractId, user.email, user.id]);

  // LOAD ACTIVE CHAT
  useEffect(() => {
    if (!activeChat) {
      return;
    }

    const loadMessages = async () => {
      try {
        const data = await getMessages(activeChat.contractId);

        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    loadMessages();

    // CHAT SUBSCRIBE
    const chatSub = subscribeToChat(
      activeChat.contractId,

      (message) => {
        appendMessage(message);

        setConversations((prev) =>
          prev.map((conversation) =>
            String(conversation.contractId) === String(message.contract?.id)
              ? {
                  ...conversation,
                  lastMessage: message.fileUrl
                    ? "File shared"
                    : message.content,
                }
              : conversation,
          ),
        );
      },
    );

    // TYPING SUBSCRIBE
    const typingSub = subscribeToTyping(
      activeChat.contractId,

      (data) => {
        if (data.senderName !== user.name) {
          setTypingUser(`${data.senderName} is typing`);

          window.clearTimeout(typingTimeoutRef.current);

          typingTimeoutRef.current = window.setTimeout(() => {
            setTypingUser("");
          }, 1500);
        }
      },
    );

    return () => {
      chatSub?.unsubscribe();

      typingSub?.unsubscribe();

      window.clearTimeout(typingTimeoutRef.current);
    };
  }, [activeChat, user.name]);

  // SEND MESSAGE
  const handleSend = async (event) => {
    event.preventDefault();

    if (!activeChat) {
      return;
    }

    if (!content.trim() && !selectedFile) {
      return;
    }

    try {
      let savedMessage;

      if (selectedFile) {
        const formData = new FormData();

        formData.append("file", selectedFile);

        formData.append("contractId", activeChat.contractId);

        formData.append("receiverId", activeChat.userId);

        savedMessage = await uploadChatFile(formData);

        setSelectedFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        savedMessage = await sendMessage({
          contractId: activeChat.contractId,

          receiverId: activeChat.userId,

          content: content.trim(),
        });
      }

      appendMessage(savedMessage);

      // REALTIME
      sendChatMessage(savedMessage);

      setContent("");

      setConversations((prev) =>
        prev.map((conversation) =>
          String(conversation.contractId) === String(activeChat.contractId)
            ? {
                ...conversation,
                lastMessage: savedMessage.fileUrl
                  ? "File shared"
                  : savedMessage.content,
              }
            : conversation,
        ),
      );

      inputRef.current?.focus();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="app-page">
      <section className="page-shell max-w-7xl">
        {/* TOP */}
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="portal-eyebrow">Messages</p>

            <h1 className="mt-2 text-3xl font-black text-slate-950">
              Project conversations
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Realtime communication between client and freelancer.
            </p>
          </div>

          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm">
            {conversations.length} active chat
            {conversations.length === 1 ? "" : "s"}
          </div>
        </div>

        {/* MAIN CHAT */}
        <div className="surface-card grid h-[82vh] overflow-hidden p-0 shadow-xl lg:grid-cols-[22rem_1fr]">
          {/* SIDEBAR */}
          <div className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
            {/* SIDEBAR HEADER */}
            <div className="border-b border-slate-200 bg-[#075e54] p-5 text-white">
              <h2 className="text-lg font-black">Chats</h2>

              <p className="mt-1 text-sm text-slate-300">
                Your active conversations
              </p>
            </div>

            {/* CHAT LIST */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {conversations.length === 0 && (
                <div className="p-6 text-sm text-slate-500">
                  No conversations yet
                </div>
              )}

              {conversations.map((conversation) => (
                <button
                  key={conversation.userId}
                  onClick={() => setActiveChat(conversation)}
                  className={`flex w-full gap-3 border-b border-slate-100 px-5 py-4 text-left transition hover:bg-blue-50 ${
                    activeChat?.userId === conversation.userId
                      ? "bg-emerald-50"
                      : "bg-white"
                  }`}
                >
                  {/* AVATAR */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#128c7e] text-sm font-black uppercase text-white">
                    {conversation.userName?.charAt(0)}
                  </div>

                  {/* USER INFO */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-black text-slate-950">
                        {conversation.userName}
                      </p>

                      {conversation.unreadCount > 0 && (
                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-2 text-xs font-black text-white">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 flex items-center gap-2 text-xs font-bold text-slate-500">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          conversation.online
                            ? "bg-emerald-500"
                            : "bg-slate-300"
                        }`}
                      />

                      {conversation.online ? "Online" : "Offline"}
                    </p>

                    <p className="mt-2 truncate text-sm text-slate-500">
                      {conversation.lastMessage || "Open conversation"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CHAT AREA */}
          <div className="flex min-h-0 flex-col bg-[#111b21]">
            {/* CHAT HEADER */}
            <div className="border-b border-[#1f2c33] bg-[#202c33] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#128c7e] text-base font-black uppercase text-white">
                  {activeChat?.userName?.charAt(0)}
                </div>

                <div>
                  <h1 className="text-xl font-black text-white">
                    {activeChat ? activeChat.userName : "No chat selected"}
                  </h1>

                  <p className="mt-1 flex items-center gap-2 text-xs font-bold text-slate-300">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        activeChat?.online ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />

                    {activeChat?.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            {/* TYPING */}
            {typingUser && (
              <div className="border-b border-[#1f2c33] bg-[#111b21] px-6 py-2 text-sm italic text-emerald-300">
                <div className="flex items-center gap-2">
                  <span>{typingUser}</span>

                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400"></span>

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:0.2s]"></span>

                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}

            {/* MESSAGES */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-[#111b21] p-5 sm:p-6">
              {messages.map((message) => {
                const isMine =
                  String(message.sender?.id) === String(user.id) ||
                  message.sender?.email === user.email;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                    style={{
                      animation: "fadeIn 0.2s ease",
                    }}
                  >
                    <div
                      className={`relative max-w-[75%] px-4 py-3 shadow-md ${
                        isMine
                          ? "rounded-l-2xl rounded-br-2xl rounded-tr-sm bg-[#005c4b] text-white"
                          : "rounded-r-2xl rounded-bl-2xl rounded-tl-sm bg-[#202c33] text-white"
                      }`}
                    >
                      {/* NAME */}
                      <div className="mb-1 flex items-center justify-between gap-5">
                        <p
                          className={`text-xs font-black ${
                            isMine ? "text-emerald-200" : "text-sky-300"
                          }`}
                        >
                          {isMine ? "You" : message.sender.name}
                        </p>

                        <p className="text-[11px] text-slate-300">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",

                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* MESSAGE */}
                      {message.content && (
                        <p className="whitespace-pre-wrap break-words text-[15px] leading-6">
                          {message.content}
                        </p>
                      )}

                      {message.fileUrl && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/10">
                          {isImageFile(message.fileUrl) && (
                            <img
                              src={`${fileBaseUrl}/${message.fileUrl}`}
                              alt="Chat attachment"
                              className="max-h-64 w-full object-cover"
                            />
                          )}

                          <a
                            href={`${fileBaseUrl}/${message.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`block px-3 py-2 text-sm font-bold ${
                              isMine ? "text-emerald-100" : "text-sky-200"
                            }`}
                          >
                            Open attachment
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            {activeChat && (
              <form
                onSubmit={handleSend}
                className="border-t border-[#1f2c33] bg-[#202c33] p-4"
              >
                {selectedFile && (
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-[#31434c] bg-[#111b21] px-4 py-2 text-sm text-slate-200">
                    <span className="min-w-0 truncate font-semibold">
                      {selectedFile.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);

                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="rounded-full bg-[#2a3942] px-3 py-1 text-xs font-black text-slate-200 transition hover:bg-[#31434c]"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="flex gap-3">
                  <label className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#2a3942] text-2xl font-light text-slate-200 transition hover:bg-[#31434c]">
                    +
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={(event) =>
                        setSelectedFile(event.target.files?.[0] || null)
                      }
                      className="sr-only"
                    />
                  </label>

                  <input
                    ref={inputRef}
                    type="text"
                    value={content}
                    onChange={(event) => {
                      setContent(event.target.value);

                      sendTypingStatus(
                        activeChat.contractId,

                        user.name,
                      );
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSend(event);
                      }
                    }}
                    placeholder="Type message..."
                    className="flex-1 rounded-full border border-[#2a3942] bg-[#2a3942] px-5 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-[#00a884]"
                  />

                  <button
                    type="submit"
                    className="rounded-full bg-[#00a884] px-7 py-3 text-sm font-black text-[#071b16] transition hover:bg-[#06cf9c]"
                  >
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Chat;
