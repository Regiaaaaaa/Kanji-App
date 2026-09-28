import { useMemo, useState } from "react";
import { getBabNumbers } from "../data/kanjiData";

export default function FlashcardSetupPage({ onStartFlashcard, onBack }) {
  const babNumbers = useMemo(() => getBabNumbers(), []);
  const [selectedBabs, setSelectedBabs] = useState([]);

  const toggleBab = (bab) => {
    setSelectedBabs((prev) =>
      prev.includes(bab) ? prev.filter((b) => b !== bab) : [...prev, bab]
    );
  };

  const pilihSemua = () => setSelectedBabs(babNumbers);
  const kosongkan = () => setSelectedBabs([]);
  const bisaMulai = selectedBabs.length > 0;

  const handleMulai = () => {
    if (!bisaMulai || !onStartFlashcard) return;

    onStartFlashcard({
      babList: selectedBabs,
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f2e9] text-[#2b2620]">
      <div className="max-w-5xl w-full mx-auto px-6 sm:px-10 lg:px-10 py-5 sm:py-7">
        <header className="mb-5 sm:mb-7">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn btn-ghost btn-xs -ml-2 mb-2.5 px-2 text-[#8a3a3a] hover:bg-[#efe6d2] hover:text-[#8a3a3a] normal-case"
            >
              ← Kembali
            </button>
          )}
          <p className="text-xs tracking-wide text-[#8a3a3a] mb-1">
            フラッシュカード
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl leading-tight mb-1.5">
            Pilih bab flashcard
          </h1>
          <p className="text-sm text-[#6b6459] max-w-md">
            Pilih bab yang ingin kamu pelajari hari ini. Kartu akan diacak untuk sesi ini.
          </p>
        </header>

        <div className="bg-[#faf8f2] border border-[#e4ddc9] rounded-2xl p-5 sm:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(58,54,48,0.25)]">
          <div className="flex items-center justify-between mb-3.5">
            <SectionLabel>Pilih bab kanji</SectionLabel>
            <span className="badge border-none bg-[#efe6d2] text-[#8a3a3a] font-normal text-[11px]">
              {selectedBabs.length} dipilih
            </span>
          </div>

          <div
            className="grid gap-1.5 mb-3"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
            }}
          >
            {babNumbers.map((bab) => {
              const active = selectedBabs.includes(bab);
              return (
                <button
                  key={bab}
                  type="button"
                  onClick={() => toggleBab(bab)}
                  aria-pressed={active}
                  className={`h-9 rounded-lg text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a3a3a] focus-visible:ring-offset-1 focus-visible:ring-offset-[#f6f2e9]
                    ${
                      active
                        ? "bg-[#8a3a3a] text-white"
                        : "bg-[#efe6d2]/60 text-[#2b2620] hover:bg-[#efe6d2]"
                    }`}
                >
                  {bab}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 text-xs mb-6">
            <button
              type="button"
              onClick={pilihSemua}
              className="btn btn-xs h-7 rounded-full border border-[#e2d9c3] bg-transparent px-3 text-[#6b6459] hover:border-[#8a3a3a] hover:bg-transparent hover:text-[#8a3a3a] normal-case font-normal"
            >
              Pilih semua
            </button>
            <button
              type="button"
              onClick={kosongkan}
              className="btn btn-xs h-7 rounded-full border border-[#e2d9c3] bg-transparent px-3 text-[#6b6459] hover:border-[#8a3a3a] hover:bg-transparent hover:text-[#8a3a3a] normal-case font-normal"
            >
              Kosongkan
            </button>
          </div>

          <button
            type="button"
            onClick={handleMulai}
            disabled={!bisaMulai}
            className={`btn btn-block h-11 rounded-lg text-sm font-medium normal-case border-none transition-colors ${
              bisaMulai
                ? "bg-[#8a3a3a] text-white hover:bg-[#752f2f]"
                : "bg-[#ebe5d5] text-[#b3ac99] cursor-not-allowed"
            }`}
          >
            Mulai flashcard
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#8a8371]">
      {children}
    </span>
  );
}
