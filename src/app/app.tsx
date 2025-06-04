import "./app.css";
import { Route, Routes } from "react-router";
import { Wrapper } from "./ui/wrapper.tsx";
import { Profile } from "../modules/profile/profile.tsx";
import { Posts } from "../modules/posts/posts.tsx";
import { Settings } from "../modules/settings/settings.tsx";

import { Chat } from "../modules/chat/chats.tsx";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Wrapper />}>
        <Route path="profile" element={<Profile />} />
        <Route path="posts">
          <Route index element={<Posts />} />
          <Route path=":chatId" element={<Chat />} />
        </Route>
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};