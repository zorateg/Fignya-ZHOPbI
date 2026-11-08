import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getNonsenseItems } from "@/lib/nonsense-server";
import type { NonsenseItem } from "@/lib/nonsense";
import { SiteHeader } from "@/components/marketing/site-header";
import { Faq } from "@/components/marketing/faq";
import { categoryColor, categoryLabel } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Layers,
  Lock,
  PlayCircle,
  Sparkles,
  Star,
  Zap,
  Check,
} from "lucide-react";

export const dynamic = "force-dynamic";

const features = [
  {
    icon: Layers,
    title: "Коллекция фигни",
    text: "Одна лента для всего бессмысленного. Создавайте, редактируйте и удаляйте записи за пару секунд.",
  },
  {
    icon: Crown,
    title: "Подборка Жоры",
    text: "Лучшие образцы фигни лично отбираются Жорой и получают статус премиальной бессмыслицы.",
  },
  {
    icon: Star,
    title: "Оценка 1–5",
    text: "Каждой фигне — честный рейтинг. От «ну это фигня» до «это гениальная фигня».",
  },
  {
    icon: Zap,
    title: "Мгновенно",
    text: "Оптимистичные обновления: новая фигня появляется раньше, чем вы успеваете передумать.",
  },
  {
    icon: Lock,
    title: "Только для любителей",
    text: "Личный кабинет, сессии и пароли. Чужая фигня остаётся чужой фигнёй.",
  },
  {
    icon: BadgeCheck,
    title: "Persistent data",
    text: "Всё хранится в PostgreSQL. Фигня не исчезнет после перезагрузки страницы.",
  },
];

export default async function LandingPage() {
  const user = await getCurrentUser();
  const items = await getNonsenseItems({ sort: "rating" });
  const featured = items.filter((i: NonsenseItem) => i.isFeatured).slice(0, 3);
  const total = items.length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-void">
      <SiteHeader isAuthed={Boolean(user)} />

      {/* HERO */}
      <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-70" />
        <div className="aura left-1/2 top-[-14rem] h-[34rem] w-[46rem] -translate-x-1/2 bg-plum/30" />
        <div className="aura right-[-8rem] top-24 h-72 w-72 bg-fuchsia-glow/20" />
        <div className="aura left-[-8rem] top-64 h-72 w-72 bg-ember/15" />

        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
          <Link
            href="#features"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-xs font-medium text-zinc-300 backdrop-blur transition hover:border-white/25"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Новинка 2026 — уже в доступе
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <h1 className="mt-8 text-[clamp(2.6rem,8vw,5.4rem)] font-bold leading-[0.98] tracking-[-0.03em] text-white">
            Жора Крутой
            <br />
            представляет <span className="text-gradient">Фигню</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-[17px] leading-relaxed text-zinc-400 sm:text-lg">
            Мы не знаем, что это. Вы не знаете, зачем это. Но как только вы это
            попробуете — жизнь никогда не будет прежней.{" "}
            <span className="text-zinc-200">
              Самое необъяснимое открытие десятилетия.
            </span>
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={user ? "/dashboard/nonsense/new" : "/register"}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-8 text-sm font-semibold text-white glow-cta transition hover:brightness-110 sm:w-auto"
            >
              <Sparkles className="h-4 w-4" />
              Попробовать Фигню
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/nonsense"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-7 text-sm font-medium text-white transition hover:bg-white/[0.08] sm:w-auto"
            >
              <PlayCircle className="h-5 w-5 text-plum" />
              Смотреть демо
              <span className="text-zinc-500">2:14</span>
            </Link>
          </div>

          <p className="mt-6 text-xs text-zinc-500">
            Демо-доступ: zhora@fignya.ru · пароль parol123
          </p>

          {/* Stats strip */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              { value: String(total), label: "единиц фигни" },
              { value: String(featured.length), label: "в подборке Жоры" },
              { value: "3", label: "коллекционера" },
              { value: "100%", label: "бессмыслицы" },
            ].map((s) => (
              <div key={s.label} className="bg-abyss/90 px-4 py-5">
                <div className="text-2xl font-semibold text-white">{s.value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-zinc-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Возможности"
          title="Всё для профессиональной работы с фигнёй"
          subtitle="Инструменты, которые не нужны никому — и поэтому идеальны."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-plum/40 hover:bg-white/[0.05]"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-plum/20 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-brand-soft text-plum">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[15px] font-semibold text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {f.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRODUCT */}
      <section id="product" className="relative border-y border-white/[0.07] bg-abyss/60 py-20">
        <div className="aura left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 bg-fuchsia-glow/10" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-plum">
              Продукт
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Дашборд, в котором фигня
              <br />
              <span className="text-gradient">наконец-то систематизирована</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-zinc-400">
              Поиск, категории, сортировка по рейтингу, рейтинг Жоры и полный
              контроль над каждой записью. Всё как в серьёзных продуктах, только
              фигня.
            </p>

            <ul className="mt-7 space-y-3">
              {[
                "Боковая навигация и адаптивный дашборд",
                "Быстрое создание прямо из ленты",
                "Личная статистика и подборка Жоры",
                "Редактирование и удаление своих записей",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-zinc-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <Link
              href={user ? "/dashboard" : "/register"}
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-6 text-sm font-medium text-white transition hover:bg-white/[0.09]"
            >
              Открыть дашборд <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Product mock */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-brand opacity-20 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-surface/90 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-3 rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">
                  fignya.app/dashboard
                </span>
              </div>
              <div className="grid grid-cols-[88px_1fr] gap-0">
                <div className="space-y-2 border-r border-white/[0.07] p-3">
                  {["Дашборд", "Фигня", "Настройки"].map((n, i) => (
                    <div
                      key={n}
                      className={`rounded-lg px-2 py-1.5 text-[10px] ${
                        i === 1
                          ? "bg-brand-soft text-fuchsia-200"
                          : "text-zinc-500"
                      }`}
                    >
                      {n}
                    </div>
                  ))}
                </div>
                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-medium text-white">Фигня</div>
                    <div className="rounded-md bg-brand px-2 py-1 text-[9px] font-semibold text-white">
                      + Добавить
                    </div>
                  </div>
                  {featured.length > 0
                    ? featured.map((item: NonsenseItem) => (
                        <div
                          key={item.id}
                          className="rounded-lg border border-white/10 bg-white/[0.04] p-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`rounded px-1.5 py-0.5 text-[8px] ${categoryColor(item.category)}`}>
                              {categoryLabel(item.category)}
                            </span>
                            <span className="text-[8px] text-amber-300">
                              {"★".repeat(item.rating)}
                            </span>
                          </div>
                          <div className="mt-1 truncate text-[10px] font-medium text-white">
                            {item.title}
                          </div>
                          <div className="truncate text-[8px] text-zinc-500">
                            {item.author.name}
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Тарифы"
          title="Выберите свою степень премиальности"
          subtitle="Любой тариф включает неограниченное количество фигни."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <PricingCard
            name="Фигня Старт"
            price="0 ₽"
            period="навсегда"
            text="Для тех, кто только знакомится с фигнёй."
            items={[
              "Неограниченные записи",
              "Категории и рейтинги",
              "Личный дашборд",
              "Подборка Жоры (просмотр)",
            ]}
            cta="Начать бесплатно"
            href={user ? "/dashboard" : "/register"}
          />
          <PricingCard
            highlighted
            name="Фигня PREMIUM"
            price="299 ₽"
            period="в месяц"
            text="Для настоящих ценителей прекрасной бессмыслицы."
            items={[
              "Всё из тарифа Старт",
              "Приоритет в подборке Жоры",
              "Расширенная статистика",
              "Значок премиум-коллекционера",
              "Поддержка лично от Жоры",
            ]}
            cta="Попробовать Фигню"
            href={user ? "/dashboard/nonsense/new" : "/register"}
          />
          <PricingCard
            name="Фигня Enterprise"
            price="∞"
            period="по запросу"
            text="Когда фигни так много, что нужен отдельный человек."
            items={[
              "Всё из тарифа Premium",
              "Выделенный менеджер по фигне",
              "SLA на бессмыслицу",
              "Персональный аудит коллекции",
            ]}
            cta="Связаться с Жорой"
            href="/register"
          />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-white/[0.07] bg-abyss/50 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Часто задаваемые вопросы о фигне"
            subtitle="Ответы, которые не отвечают ни на что."
          />
          <Faq />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <div className="aura left-1/2 top-1/2 h-72 w-[44rem] -translate-x-1/2 -translate-y-1/2 bg-plum/25" />
        <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
          <div className="overflow-hidden rounded-3xl border border-white/12 bg-brand-soft p-10 text-center backdrop-blur">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white">
              <Crown className="h-3.5 w-3.5 text-amber-300" />
              Одобрено Жорой
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Готовы добавить свою первую <span className="text-gradient">фигню</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-300">
              Регистрация занимает 20 секунд. Коллекция сразу загружается
              реальными примерами, чтобы вы почувствовали масштаб.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={user ? "/dashboard/nonsense/new" : "/register"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-8 text-sm font-semibold text-white glow-cta transition hover:brightness-110"
              >
                {user ? "Добавить фигню" : "Создать аккаунт"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-8 text-sm font-medium text-white transition hover:bg-white/[0.1]"
              >
                Войти в аккаунт
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.07] bg-void">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
              <Crown className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold text-white">Жора Крутой</div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-plum">
                Premium
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500">
            <a href="#features" className="hover:text-zinc-300">Возможности</a>
            <a href="#product" className="hover:text-zinc-300">Продукт</a>
            <a href="#pricing" className="hover:text-zinc-300">Тарифы</a>
            <a href="#faq" className="hover:text-zinc-300">FAQ</a>
          </div>
          <p className="text-xs text-zinc-600">
            © 2026 Просто фигня. Сделано для любителей фигни.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-plum">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm text-zinc-400">{subtitle}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  text,
  items,
  cta,
  href,
  highlighted,
}: {
  name: string;
  price: string;
  period: string;
  text: string;
  items: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        highlighted
          ? "border-plum/50 bg-brand-soft glow-plum"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          Выбор Жоры
        </span>
      )}
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
        {name}
      </h3>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-white">{price}</span>
        <span className="text-xs text-zinc-500">{period}</span>
      </div>
      <p className="mt-3 text-sm text-zinc-400">{text}</p>
      <ul className="mt-6 flex-1 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-plum" />
            {i}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-7 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition ${
          highlighted
            ? "bg-brand text-white glow-cta hover:brightness-110"
            : "border border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.1]"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
