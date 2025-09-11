// src/components/FloatingChatbotModal.jsx
import { useState, useEffect } from "react";
import { Send, Mic, Bot } from "lucide-react"; // ⬅️ Use Bot icon instead of MessageCircle
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const FloatingChatbotModal = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "👋 Hi! I’m your Civic Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [listening, setListening] = useState(false);


  // ✅ Setup speech recognition
useEffect(() => {
  if ("webkitSpeechRecognition" in window) {
    const recog = new window.webkitSpeechRecognition();
    recog.lang = "en-US";
    recog.continuous = true; // ✅ important
    recog.interimResults = false;

    let manualStop = false;

    recog.onstart = () => {
      console.log("🎤 Listening started...");
      setListening(true);
      manualStop = false;
    };

    recog.onend = () => {
      console.log("🛑 Listening stopped.");
      if (!manualStop) return; // ignore auto-stops
      setListening(false);
    };

    recog.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      sendMessage(transcript);
    };

    setRecognition(recog);
  }
}, []);



  // ✅ Speak bot responses
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };
  const handleMicClick = () => {
  if (!recognition) return;

  if (listening) {
    recognition.stop(); // stop listening
    setListening(false); // ✅ update button immediately
  } else {
    recognition.start(); // start listening
  }
};


  // ✅ Send message to backend
  const sendMessage = async (forcedMessage = null) => {
    const userInput = forcedMessage || input;
    if (!userInput.trim()) return;

    const newUserMessage = { role: "user", content: userInput };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();
      const botReply = { role: "bot", content: data.reply };

      setMessages((prev) => [...prev, botReply]);
      speakText(data.reply);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "❌ Server error, please try again later." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        size="lg"
        className="fixed bottom-24 left-8 w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg flex items-center justify-center z-50 animate-bounce"
        onClick={() => setOpen(true)}
        aria-label="Open Chatbot"
      >
        {/* 🤖 Robot Icon */}
        <div className="flex flex-col items-center">
          <Bot className="w-9 h-9 text-white" />
          <span className="text-xs text-white font-semibold mt-1">AI Bot</span>
        </div>
      </Button>

      {/* Chat Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md flex flex-col h-[520px] rounded-2xl shadow-xl bg-blue-50">
          {/* Blue Header */}
          <DialogHeader className="bg-blue-600 p-3 rounded-t-2xl">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              🤖 Civic AI Assistant
            </DialogTitle>
          </DialogHeader>

          {/* Messages - blue background */}
          <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-blue-100 rounded-b-md">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl max-w-[80%] text-sm shadow ${
                  msg.role === "user"
                    ? "ml-auto bg-indigo-600 text-white"
                    : "mr-auto bg-white text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          {/* Input + Buttons */}
          <DialogFooter className="flex gap-2 items-center border-t pt-2 bg-blue-50">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button size="icon" onClick={() => sendMessage()}>
              <Send className="w-5 h-5" />
            </Button>
            {recognition && (
             <Button
               size="icon"
               className={`transition-colors duration-200 ${
                 listening ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={handleMicClick}
            >
             <Mic className="w-5 h-5 text-white" />
          </Button>

)}

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingChatbotModal;
