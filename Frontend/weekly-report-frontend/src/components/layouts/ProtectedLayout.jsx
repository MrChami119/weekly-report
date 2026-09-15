import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ChatWidget from "../chat/ChatWidget";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedLayout() {
  const { user } = useAuth();
  const isManagerOrAdmin = user?.role === "MANAGER" || user?.role === "ADMIN";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      {isManagerOrAdmin && <ChatWidget />}
    </div>
  );
}
