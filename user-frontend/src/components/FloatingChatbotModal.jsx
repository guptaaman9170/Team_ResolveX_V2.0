import { useState, useEffect } from "react";
import { Send, Mic, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const API_BASE = import.meta.env.VITE_API_BASE;

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

  // Speech recognition setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recog = new window.webkitSpeechRecognition();
      recog.lang = "en-US";
      recog.continuous = true;
      recog.interimResults = false;
      let manualStop = false;
      recog.onstart = () => {
        setListening(true);
        manualStop = false;
      };
      recog.onend = () => {
        if (!manualStop) return;
        setListening(false);
      };
      recog.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        sendMessage(transcript);
      };
      setRecognition(recog);
    }
  }, []);

  // Stop speech when closing modal
  useEffect(() => {
    if (!open && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (recognition && listening) {
        recognition.stop();
        setListening(false);
      }
    }
  }, [open]);

  // Speak bot responses
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMicClick = () => {
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
    }
  };

  const sendMessage = async (forcedMessage = null) => {
    const userInput = forcedMessage || input;
    if (!userInput.trim()) return;
    const newUserMessage = { role: "user", content: userInput };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    try {
      const res = await fetch(`${API_BASE}/chat`, {
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
  style={{ bottom: "30px", left: "32px" }}
  className="fixed w-16 h-16 rounded-full 
             bg-gradient-to-r from-indigo-600 to-purple-600 
             hover:from-indigo-700 hover:to-purple-700 
             shadow-lg flex items-center justify-center z-50"
  onClick={() => setOpen(true)}
  aria-label="Open Chatbot"
>
  <Bot className="w-7 h-7 text-white" />
</Button>


      {/* Chat Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md flex flex-col h-[90vh] max-h-[600px] rounded-2xl shadow-xl bg-blue-50">
          {/* Blue Header */}
          <DialogHeader className="bg-blue-600 p-3 rounded-t-2xl">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              🤖 Civic AI Assistant
            </DialogTitle>
          </DialogHeader>
          {/* Fixed height messages container with scroll */}
          <div
            className="flex-1 p-3 bg-blue-100 rounded-b-md overflow-y-auto"
            style={{ minHeight: "300px", maxHeight: "360px" }}
          >
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
                  listening
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
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
