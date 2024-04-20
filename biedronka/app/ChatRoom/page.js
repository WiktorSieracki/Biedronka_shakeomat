"use client";
import { useState, useEffect } from "react";
import { useEffectOnce } from "use-effect-once";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

export default function ChatRoom() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(null);
  const searchParams = useSearchParams();
  const token = Cookies.get("token");
  const senderName = token ? jwt.decode(token).name : null;

  const userId = searchParams.get("userId").toString();

  useEffect(() => {
    const getChat = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/chats/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setChat(data);
      } catch (error) {
        console.error(error);
      }
    };
    getChat(userId);
  }, [chat]);

  useEffectOnce(() => {
    const getChat = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/chats/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setChat(data);
      } catch (error) {
        console.error(error);
      }
    };
    getChat(userId);
    if (!chat) {
      const createChat = async (id) => {
        try {
          const response = await fetch(`http://localhost:5000/chats/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setChat(data);
        } catch (error) {
          console.error(error);
        }
      };
      createChat(userId);
    }
  }, []);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = (message) => {
    const chatId = chat._id;
    const body = {
      content: message,
    };
    fetch(`http://localhost:5000/chats/${chatId}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-red-500 text-white text-lg">Chat Room</div>
      <div className="flex-grow overflow-y-auto p-4">
        {chat &&
          chat.messages &&
          chat.messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 my-2 rounded ${
                message.sender === senderName
                  ? "bg-blue-200 ml-auto text-right"
                  : "bg-green-200 mr-auto"
              }`}
            >
              <div className="font-bold">{message.sender}</div>
              <div>{message.content}</div>
            </div>
          ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        className="p-4 border-t border-gray-300 w-full"
        value={message}
        onChange={handleInputChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            sendMessage(message);
            setMessage("");
          }
        }}
      />
    </div>
  );
}
