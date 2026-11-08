"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Что такое фигня?",
    a: "Мы не знаем. Вы не знаете. Никто не знает. Но как только вы добавите первую запись, жизнь никогда не будет прежней.",
  },
  {
    q: "Это бесплатно?",
    a: "Создание аккаунта, коллекционирование и оценка фигни — бесплатно и без ограничений. Premium-тариф нужен только тем, кто хочет больше ощущения премиальности.",
  },
  {
    q: "Кто такой Жора Крутой?",
    a: "Основатель, главный редактор и единственный член жюри. Он лично отбирает записи в «Подборку Жоры» — высшую степень признания в мире фигни.",
  },
  {
    q: "Можно ли удалить фигню?",
    a: "Да, свою фигню можно редактировать и удалять в любой момент. Чужую — только если вы администратор с соответствующими полномочиями.",
  },
  {
    q: "Как оценивается фигня?",
    a: "По шкале от 1 до 5 звёзд. Единица — «ну это фигня», пятёрка — «это гениальная фигня». Объективность гарантируется Жорой.",
  },
];

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className="mx-auto mt-12 max-w-3xl space-y-3">
      {faqs.map((item, i) => (
        <div
          key={item.q}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
          >
            <span className="text-[15px] font-medium text-white">{item.q}</span>
            <Plus
              className={cn(
                "h-5 w-5 shrink-0 text-plum transition-transform duration-300",
                open === i && "rotate-45",
              )}
            />
          </button>
          <div
            className={cn(
              "grid transition-all duration-300",
              open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-400">
                {item.a}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
