import { useEffect, useMemo, useState } from "react";

export default function Home({ onNavigate }) {
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    if (!aboutOpen) return;
    const onKey = (e) => e.key === "Escape" && setAboutOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aboutOpen]);

  return (
    <div className="relative min-h-screen bg-[#f4f0e6] flex items-center justify-center px-4 py-16 overflow-hidden">
      <FloatingKanjiBackground />

      <button
        type="button"
        onClick={() => setAboutOpen(true)}
        aria-label="Informasi tentang website"
        title="Tentang website"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-20
             h-9 w-9 flex items-center justify-center
             text-[#6b6459] hover:text-[#3a3630]
             border border-[#e4ddc9] hover:border-[#8a3a3a]/40
             bg-[#faf8f2]/80 backdrop-blur
             rounded-full transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="11" x2="12" y2="16" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </button>

      <div className="relative w-full max-w-md">
        <div className="bg-[#faf8f2] border border-[#e4ddc9] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(58,54,48,0.25)] px-6 py-8 sm:px-8 sm:py-9 text-center">
          <div className="mx-auto mb-5 h-10 w-10 rounded-full border border-[#8a3a3a]/30 flex items-center justify-center">
            <span className="font-serif text-base text-[#8a3a3a]">文</span>
          </div>

          <h1 className="text-2xl sm:text-[28px] font-semibold text-[#3a3630] mb-1.5 font-serif">
            漢字クイズ
          </h1>
          <p className="text-sm text-[#6b6459] mb-8">
            Belajar dan uji kemampuan kanji kamu
          </p>

          <div className="flex flex-col gap-3">
            <MenuButton
              label="Mulai Kuis"
              description="Uji pemahaman kanji, hiragana, dan arti"
              onClick={() => onNavigate("quiz-setup")}
              primary
            />
            <MenuButton
              label="Mulai Flashcard"
              description="Belajar kanji dengan pendekatan self-recall"
              onClick={() => onNavigate("flashcard-setup")}
            />
            <MenuButton
              label="Daftar Kanji"
              description="Lihat semua kanji per bab"
              onClick={() => onNavigate("daftar-kanji")}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-[#e4ddc9]">
            <p className="mb-3 text-[10px] font-medium tracking-[0.18em] text-[#8a8371] uppercase">
              Ikuti Saya
            </p>
            <div className="flex items-center justify-center gap-3">
              <SocialIcon
                label="GitHub"
                href="https://github.com/regiaaaaaa"
                icon={<GithubIcon />}
              />
              <SocialIcon
                label="LinkedIn"
                href="https://linkedin.com/in/rafagheiza"
                icon={<LinkedinIcon />}
              />
              <SocialIcon
                label="Instagram"
                href="https://instagram.com/ghezzz___"
                icon={<InstagramIcon />}
              />
            </div>
          </div>
        </div>
      </div>

      {aboutOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center px-4 bg-[#211d16]/40 backdrop-blur-sm transition-opacity"
          onClick={() => setAboutOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#faf8f2] border border-[#e4ddc9] rounded-2xl shadow-xl p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2
                id="about-title"
                className="text-lg font-semibold text-[#3a3630] font-serif"
              >
                Tentang Website Ini
              </h2>
              <button
                type="button"
                onClick={() => setAboutOpen(false)}
                aria-label="Tutup"
                className="text-[#6b6459] hover:text-[#3a3630] leading-none text-xl -mt-1"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-[#6b6459] leading-7 text-justify">
              Kanji Quiz dibuat untuk membantu kamu mempelajari dan menghafalkan
              kanji yang umum diujikan pada JFT A2 dengan cara yang lebih
              praktis. Di sini, kamu bisa melihat daftar kanji yang perlu
              dipelajari sekaligus melatih kemampuan mengingatnya tanpa harus
              terus-menerus menulis kanji. Dengan pendekatan{" "}
              <em className="italic">active recall</em> (retrieval practice),
              Kanji Quiz membantu kamu menguji ingatan secara langsung sehingga
              proses belajar terasa lebih sederhana, interaktif, dan efektif.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const KANJI_POOL = [
  "学",
  "水",
  "火",
  "山",
  "川",
  "人",
  "心",
  "力",
  "道",
  "光",
  "花",
  "夢",
  "空",
  "風",
  "月",
  "木",
  "音",
  "時",
  "本",
  "海",
];

function FloatingKanjiBackground() {
  const items = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const seed = i * 137.5;
      return {
        id: i,
        char: KANJI_POOL[i % KANJI_POOL.length],
        top: (seed * 1.618) % 100,
        left: (seed * 0.618) % 100,
        size: 28 + ((i * 37) % 64),
        opacity: 0.05 + ((i * 13) % 6) * 0.01,
        duration: 10 + ((i * 7) % 10),
        delay: -((i * 3.3) % 12),
        drift: 12 + (i % 4) * 4,
        rotate: (i % 2 === 0 ? 1 : -1) * (2 + (i % 3)),
      };
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden"
    >
      <style>{`
        @keyframes kanji-float {
          0%   { transform: translateY(0) rotate(var(--r, 0deg)); }
          50%  { transform: translateY(var(--d, 14px)) rotate(calc(var(--r, 0deg) * -1)); }
          100% { transform: translateY(0) rotate(var(--r, 0deg)); }
        }
        .kanji-particle { animation: kanji-float linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .kanji-particle { animation: none; }
        }
      `}</style>
      {items.map((k) => (
        <span
          key={k.id}
          className="kanji-particle absolute font-serif text-[#3a3630]"
          style={{
            top: `${k.top}%`,
            left: `${k.left}%`,
            fontSize: `${k.size}px`,
            opacity: k.opacity,
            animationDuration: `${k.duration}s`,
            animationDelay: `${k.delay}s`,
            "--d": `${k.drift}px`,
            "--r": `${k.rotate}deg`,
          }}
        >
          {k.char}
        </span>
      ))}
    </div>
  );
}

function MenuButton({ label, description, onClick, primary }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl border px-5 py-4 transition-colors
        ${
          primary
            ? "bg-[#211d16] border-[#211d16] text-white hover:bg-[#2c261c]"
            : "bg-white border-[#e4ddc9] text-[#3a3630] hover:border-[#8a3a3a]/50"
        }`}
    >
      <span className="block text-base font-semibold">{label}</span>
      <span
        className={`block text-xs mt-0.5 ${
          primary ? "text-white/70" : "text-[#6b6459]"
        }`}
      >
        {description}
      </span>
    </button>
  );
}

function SocialIcon({ label, href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="h-9 w-9 flex items-center justify-center rounded-full border border-[#e4ddc9] text-[#6b6459] hover:text-[#3a3630] hover:border-[#8a3a3a]/50 transition-colors"
    >
      {icon}
    </a>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.11.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.67.79.55A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3.2 8.75h3.5V21H3.2V8.75Zm6.1 0h3.36v1.68h.05c.47-.88 1.6-1.8 3.3-1.8 3.53 0 4.18 2.32 4.18 5.35V21h-3.5v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9.3V8.75Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
