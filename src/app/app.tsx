import "./app.css";
import type { FC } from "react";
import { Button } from "../shared/ui/button.tsx";
import { Route, Routes } from "react-router";
import { Wrapper } from "./ui/wrapper.tsx";
import { Profile } from "../modules/profile/profile.tsx";
import { Posts } from "../modules/posts/posts.tsx";
import { Settings } from "../modules/settings/settings.tsx";
//
// interface User {
//   age: number;
//   name: string;
//   hasALotOfMoney: boolean;
//   hobbies: string[];
// }
//
// const bakhredin: User = {
//   age: 22,
//   name: "bakhredin",
//   hasALotOfMoney: true,
//   hobbies: ["coding", "reading", "playing video games", "wrestling", 1, 2],
// };

export const App = () => {
  return (
    <Routes>
      <Route path={"/"} element={<Wrapper />}>
        <Route path="profile" element={<Profile />} />
        <Route path="posts" element={<Posts />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};
