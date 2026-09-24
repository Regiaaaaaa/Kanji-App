import { useMemo, useState } from "react";
import { kanjiData } from "../data/kanjiData";

export default function DaftarKanjiPage({ onBack }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return kanjiData;

    return kanjiData
      .map((bab) => ({
        ...bab,
        list: bab.list.filter(
          (item) =>
            item.kanji.includes(q) ||
            item.hiragana.toLowerCase().includes(q) ||
            item.arti.toLowerCase().includes(q)
        ),
      }))
      .filter((bab) => bab.list.length > 0);
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f6f2e9] text-[#2b2620]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-8 sm:py-12">
        <button
          type="button"
          onClick={onBack}
          className="btn btn-ghost btn-sm -ml-2 mb-4 px-2 text-[#8a3a3a] hover:bg-[#efe6d2] hover:text-[#8a3a3a] normal-case"
        >
          ← Kembali
        </button>

        <p className="text-xs tracking-wide text-[#8a3a3a] mb-1.5">
          漢字クイズ
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl leading-tight mb-1.5">
          Daftar kanji
        </h1>
        <p className="text-sm text-[#6b6459] max-w-md mb-6">
          Semua kanji yang dipakai di kuis, dikelompokkan per bab.
        </p>

        <label className="input input-bordered flex items-center gap-2 h-11 rounded-lg border-[#e2d9c3] bg-white/50 px-3.5 mb-8 max-w-md focus-within:border-[#8a3a3a]">
          <SearchIcon className="w-4 h-4 text-[#a39d8a] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kanji, hiragana, atau arti…"
            className="grow bg-transparent text-sm text-[#2b2620] placeholder:text-[#a39d8a] outline-none"
          />
        </label>

        {filtered.length > 0 && (
          <div className="lg:hidden sticky top-0 z-10 -mx-5 sm:-mx-8 mb-6 bg-[#f6f2e9]/95 backdrop-blur border-b border-[#e2d9c3]">
            <div className="flex gap-2 overflow-x-auto px-5 sm:px-8 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filtered.map((bab) => (
                <a
                  key={bab.bab}
                  href={`#bab-${bab.bab}`}
                  className="btn btn-xs h-7 shrink-0 rounded-full bg-[#efe6d2] border-none text-[#6b6459] hover:bg-[#e2d9c3] hover:text-[#2b2620] normal-case font-normal px-3 whitespace-nowrap"
                >
                  Bab {bab.bab}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {filtered.length > 0 && (
            <aside className="hidden lg:block lg:w-52 shrink-0">
              <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto pr-2">
                <p className="text-xs font-medium text-[#8a8371] mb-3">
                  DAFTAR BAB
                </p>
                <nav className="flex flex-col gap-0.5">
                  {filtered.map((bab) => (
                    <a
                      key={bab.bab}
                      href={`#bab-${bab.bab}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-[#6b6459] hover:bg-[#efe6d2] hover:text-[#2b2620] transition-colors"
                    >
                      <span>Bab {bab.bab}</span>
                      <span className="text-[11px] text-[#a39d8a]">
                        {bab.list.length}
                      </span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          <main className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-[#e2d9c3] bg-white/40 px-6 py-14 text-center">
                <p className="text-sm text-[#8a8371]">
                  Nggak ada kanji yang cocok dengan "{query}".
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filtered.map((bab) => (
                  <section
                    key={bab.bab}
                    id={`bab-${bab.bab}`}
                    className="scroll-mt-20 rounded-xl border border-[#e2d9c3] bg-white/40 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#efe6d2]/70 border-b border-[#e2d9c3]">
                      <h2 className="font-serif text-lg text-[#2b2620]">
                        Bab {bab.bab}
                      </h2>
                      <span className="badge border-none bg-white/70 text-[#8a3a3a] text-[11px] font-normal">
                        {bab.list.length} kanji
                      </span>
                    </div>

                    <ul className="list px-2 sm:px-4">
                      {bab.list.map((item, i) => (
                        <li
                          key={i}
                          className="list-row flex items-center gap-4 sm:gap-5 px-2 sm:px-2 py-3 border-b border-[#e2d9c3]/70 last:border-none hover:bg-[#efe6d2]/40 transition-colors"
                        >
                          <div className="font-serif text-2xl sm:text-3xl text-[#2b2620] w-11 sm:w-14 text-center shrink-0">
                            {item.kanji}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm sm:text-base text-[#2b2620] truncate">
                              {item.hiragana}
                            </div>
                            <div className="text-xs sm:text-sm text-[#8a8371] truncate">
                              {item.arti}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function SearchIcon({ className = "" }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="9" r="6" />
      <path d="M17 17l-3.5-3.5" />
    </svg>
  );
}