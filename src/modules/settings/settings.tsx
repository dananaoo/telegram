import { useEffect } from "react";

export const Settings = () => {
  useEffect(() => {
    return () => {
      console.log("leave settings");
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-white text-gray-900 p-5">
      <header className="border-b border-gray-300 pb-3 mb-5">
        <h1 className="text-xl font-semibold">Настройки</h1>
      </header>
      <section className="flex flex-col gap-4">
        <div className="p-4 rounded hover:bg-gray-100 cursor-pointer">
          Аккаунт
        </div>
        <div className="p-4 rounded hover:bg-gray-100 cursor-pointer">
          Уведомления
        </div>
        <div className="p-4 rounded hover:bg-gray-100 cursor-pointer">
          Конфиденциальность
        </div>
        <div className="p-4 rounded hover:bg-gray-100 cursor-pointer">
          Чат и медиа
        </div>
      </section>
    </div>
  );
};
