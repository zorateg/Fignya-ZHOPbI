import "dotenv/config";
import { db } from "@/db";
import { users, nonsenseItems } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { count } from "drizzle-orm";

const DEMO_PASSWORD = "parol123";

const userData = [
  { name: "Жора Крутой", email: "zhora@fignya.ru", role: "admin" as const },
  { name: "Анна", email: "anna@fignya.ru", role: "user" as const },
  { name: "Максим", email: "max@fignya.ru", role: "user" as const },
];

const itemsData = [
  {
    title: "Сапоги для хомяков",
    body:
      "Ортопедические сапожки на микроскопической подошве. Для хомяков, которые устали бегать в колесе босиком. Жора personally тестировал на своём хомяке — теперь тот бежит быстрее.",
    category: "invention",
    rating: 5,
    isFeatured: true,
    authorIndex: 0,
  },
  {
    title: "Завтрак из мыла",
    body:
      "Пена с запахом лаванды и лёгкая горечь послевкусия. Не рекомендуется к употреблению, но выглядит эстетично на фото. Жора утверждает, что это искусство.",
    category: "absurd",
    rating: 4,
    isFeatured: true,
    authorIndex: 0,
  },
  {
    title: "Почему облака выглядят как ленивые коты",
    body:
      "Феноменальное наблюдение: каждое второе облако на небе — это спящий кот размером с район. Доказательства прилагаются в виде блокнота с рисунками от руки.",
    category: "quote",
    rating: 5,
    isFeatured: false,
    authorIndex: 0,
  },
  {
    title: "Велосипед с квадратными колёсами",
    body:
      "Ехать нельзя, но стоять удобно. Идеально для тех, кто любит велосипед, но не любит движение. Прототип собран в гараже.",
    category: "invention",
    rating: 2,
    isFeatured: false,
    authorIndex: 1,
  },
  {
    title: "Инструкция по приготовлению чая из ложек",
    body:
      "Возьмите ложки (желательно серебряные), залейте кипятком, настояйте 3 минуты. Получится чай с нотками металла и сожаления.",
    category: "absurd",
    rating: 3,
    isFeatured: false,
    authorIndex: 2,
  },
  {
    title: "Теория относительности для котов",
    body:
      "Время замедляется, когда вы ждёте, пока кот решит сойти с колен. Скорость света равна скорости бегания за лазерной точкой.",
    category: "absurd",
    rating: 4,
    isFeatured: true,
    authorIndex: 0,
  },
  {
    title: "Браслет из скрепок",
    body:
      "Офисный аксессуар №1. Пригодится, если вдруг понадобится скрепить документы прямо с запястья. Жора носит такой каждый день.",
    category: "meme",
    rating: 3,
    isFeatured: false,
    authorIndex: 0,
  },
  {
    title: "Песня про пустоту",
    body:
      "Три минуты тишины с лёгким шёпотом в конце. Популярна среди любителей минимализма и людей, которых не слушали в детстве.",
    category: "quote",
    rating: 5,
    isFeatured: false,
    authorIndex: 1,
  },
  {
    title: "Холодильник без света",
    body:
      "Экономим электричество. Теперь вы никогда не узнаете, горит ли свет в холодильнике, когда дверь закрыта. Интрига сохраняется.",
    category: "invention",
    rating: 1,
    isFeatured: false,
    authorIndex: 2,
  },
  {
    title: "Зонт для пиццы",
    body:
      "Защищает вашу пиццу от дождя на пути от двери до стола. Совместим с большинством стандартных пицц диаметром до 35 см.",
    category: "invention",
    rating: 2,
    isFeatured: false,
    authorIndex: 0,
  },
  {
    title: "Глазки для ноутбука",
    body:
      "Приклейте глазки на крышку ноутбука — и теперь он грустит, когда вы работаете в субботу. Эффект взят из исследований مجно.",
    category: "meme",
    rating: 4,
    isFeatured: false,
    authorIndex: 1,
  },
  {
    title: "Как вставить unités в текст",
    body:
      "Инструкция на 47 страниц о том, зачем нужны пробелы между числом и единицей измерения. Жора читал её трижды и всё ещё не понял.",
    category: "absurd",
    rating: 3,
    isFeatured: false,
    authorIndex: 2,
  },
  {
    title: "Носки с изображением носков",
    body:
      "Рекурсия для ног. На носках изображены те же носки. Бесконечность на каждом шагу.",
    category: "meme",
    rating: 4,
    isFeatured: false,
    authorIndex: 0,
  },
  {
    title: "Часы без стрелок",
    body:
      "Всегда показывают верное время — если смотреть достаточно долго и верить в лучшее. Минимализм в чистом виде.",
    category: "invention",
    rating: 5,
    isFeatured: true,
    authorIndex: 0,
  },
];

async function main() {
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  // Idempotent: clear existing data so re-seeding is safe.
  await db.delete(nonsenseItems);
  await db.delete(users);

  const createdUsers = [];
  for (const u of userData) {
    const [created] = await db
      .insert(users)
      .values({ ...u, passwordHash })
      .returning();
    createdUsers.push(created);
  }

  for (const item of itemsData) {
    await db.insert(nonsenseItems).values({
      title: item.title,
      body: item.body,
      category: item.category,
      rating: item.rating,
      isFeatured: item.isFeatured,
      authorId: createdUsers[item.authorIndex].id,
    });
  }

  const [{ count: itemCount }] = await db
    .select({ count: count() })
    .from(nonsenseItems);
  // eslint-disable-next-line no-console
  console.log(`Seeded ${createdUsers.length} users and ${itemCount} nonsense items.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
