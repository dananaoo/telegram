import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBars, FaCog, FaUser } from "react-icons/fa";

const peopleChats = [
  { id: 1, name: "Aruzhan Zh" },
  { id: 2, name: "Yernar K" },
];
const aiChats = [
  { id: 101, name: "AI Tutor" },
  { id: 102, name: "Travel Bot" },
];

export const Wrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/profile");
    }
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-[--bg-primary] text-[--text-primary]">
      {/* Header */}
      <header className="bg-white border-b border-[--border-color] px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowSidebar((s) => !s)}>
            <FaBars className="text-[--primary-blue] text-xl" />
          </button>
          <h1 className="text-xl font-bold text-[--primary-blue]">Telegram Clone</h1>
        </div>
        <div className="flex items-center gap-4">
          <NavLink to="/settings">
            <FaCog className="text-xl hover:text-[--dark-blue]" />
          </NavLink>
          <NavLink to="/profile">
            <FaUser className="text-xl hover:text-[--dark-blue]" />
          </NavLink>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-80 bg-white border-r border-[--border-color] p-4 flex flex-col gap-6 overflow-auto">
            <section>
              <h2 className="text-md font-semibold text-[--text-secondary] mb-2 px-1">People</h2>
              <ul className="flex flex-col gap-2">
                {peopleChats.map((chat) => (
                  <li key={chat.id}>
                    <NavLink
                      to={`/posts/${chat.id}`}
                      className={({ isActive }) =>
                        `block px-4 py-2 rounded-md ${
                          isActive
                            ? "bg-[--primary-blue] text-white"
                            : "hover:bg-[--light-blue] hover:text-white"
                        }`
                      }
                    >
                      {chat.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-md font-semibold text-[--text-secondary] mb-2 px-1">AI Assistants</h2>
              <ul className="flex flex-col gap-2">
                {aiChats.map((chat) => (
                  <li key={chat.id}>
                    <NavLink
                      to={`/posts/${chat.id}`}
                      className={({ isActive }) =>
                        `block px-4 py-2 rounded-md ${
                          isActive
                            ? "bg-[--primary-blue] text-white"
                            : "hover:bg-[--light-blue] hover:text-white"
                        }`
                      }
                    >
                      {chat.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        )}

        {/* Content */}
        <main className="flex-1 overflow-auto bg-[--bg-secondary]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
