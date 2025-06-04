import { useEffect, useState } from "react";
import type { User } from "../../shared/model/types.ts";

export const Profile = () => {
  const [user, setUser] = useState<User>({
    name: "Ilya Kuleshov",
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    imgSrc: "/images/ilya.jpeg",
  });

  useEffect(() => {
    // setUser({ ...user, name: "Shoqan" });
  }, [user]);

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col items-center p-6 gap-6">
      <div
        className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer shadow-md"
        onClick={() => setUser({ ...user, name: "Bakhredin" })}
      >
        <img
          src={user.imgSrc}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>

      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-4 text-center text-gray-700 text-base leading-relaxed">
        {user.description}
      </div>
    </div>
  );
};
