import Chatbot from "./components/Chatbot";

export default function ChatPage() {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100"
            style={{ 
              backgroundImage: "url('/images/bg.png')", 
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              }}>
          
            <Chatbot />
        </div>
    );
}
