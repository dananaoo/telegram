import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBars, FaCog, FaUser } from "react-icons/fa";

const allChats = [
  { id: 1, name: "Aruzhan Zh", type: "people" },
  { id: 2, name: "Yernar K", type: "people" },
  { id: 101, name: "AI Tutor", type: "ai" },
  { id: 102, name: "Travel Bot", type: "ai" },
];

export const Wrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/profile");
    }
  }, []);

  const filteredPeopleChats = allChats.filter(
    (chat) => chat.type === "people" && chat.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredAiChats = allChats.filter(
    (chat) => chat.type === "ai" && chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-screen h-screen flex flex-col bg-[--bg-primary] text-[--text-primary]">
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

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <aside className="w-80 bg-white border-r border-[--border-color] p-4 flex flex-col gap-6 overflow-auto">
            <input
              className="mb-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Поиск чата..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <section>
              <h2 className="text-md font-semibold text-[--text-secondary] mb-2 px-1">People</h2>
              <ul className="flex flex-col gap-2">
                {filteredPeopleChats.map((chat) => (
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
                {filteredAiChats.map((chat) => (
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

        <main className="flex-1 overflow-auto bg-[--bg-secondary]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
