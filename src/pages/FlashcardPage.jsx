import { useCallback, useMemo, useState } from "react";
import { getKanjiByBabs, shuffleArray } from "../data/kanjiData";

export default function FlashcardPage({ config, onExit, onBack }) {
  const cards = useMemo(() => {
    const pool = getKanjiByBabs(config?.babList ?? []);
    return shuffleArray(pool);
  }, [config?.babList]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentCard = cards[currentIndex];
  const total = cards.length;
  const isLastCard = currentIndex === total - 1;

  const handleReveal = useCallback(() => {
    setShowAnswer(true);
  }, []);

  const handleNext = useCallback(() => {
    if (!showAnswer) return;

    if (currentIndex + 1 < total) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
      return;
    }

    setIsCompleted(true);
  }, [currentIndex, showAnswer, total]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setIsCompleted(false);
  }, []);

  if (!currentCard && !isCompleted) {
    return (
      <div className="min-h-[100dvh] bg-[#f6f2e9] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="alert bg-[#f6e6e3] border border-[#e2c3bd] text-[#5c2a2a] flex-col gap-3 py-6">
            <span className="text-sm">
              Tidak ada kartu untuk bab yang dipilih.
            </span>
            <button
              type="button"
              onClick={onExit}
              className="btn btn-sm bg-[#8a3a3a] hover:bg-[#732f2f] text-[#f6f2e9] border-none"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-[100dvh] bg-[#f6f2e9] text-[#2b2620] flex items-center justify-center px-4 py-10">
        <div className="max-w-lg w-full bg-[#faf8f2] border border-[#e4ddc9] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(58,54,48,0.25)] p-6 sm:p-8 text-center">
          <p className="text-xs tracking-[0.18em] text-[#8a3a3a] uppercase mb-3">Selesai</p>
          <h2 className="font-serif text-2xl sm:text-4xl mb-3">Flashcard selesai</h2>
          <p className="text-sm text-[#6b6459] leading-7 mb-7">
            Kamu telah menyelesaikan semua kartu dari bab yang dipilih. Tetap konsisten dan ulangi sesi ini pada hari berikutnya untuk memperkuat ingatan.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={handleRestart}
              className="btn bg-[#8a3a3a] hover:bg-[#752f2f] text-white border-none normal-case"
            >
              Ulangi sesi
            </button>
            <button
              type="button"
              onClick={onExit}
              className="btn border border-[#e2d9c3] bg-transparent text-[#6b6459] hover:border-[#8a3a3a] hover:text-[#8a3a3a] normal-case"
            >
              Kembali ke Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const charCount = [...(currentCard.kanji ?? "")].length || 1;
  const hiraCount = [...(currentCard.hiragana ?? "")].length || 1;

  return (
    <div className="min-h-[100dvh] bg-[#f6f2e9] text-[#2b2620] flex flex-col">
      <div className="max-w-3xl w-full mx-auto px-4 sm:px-8 py-5 sm:py-8 flex-1 flex flex-col">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4 sm:mb-6">
          <button
            type="button"
            onClick={onBack ?? onExit}
            className="btn btn-ghost btn-sm justify-self-start px-2 text-[#8a3a3a] hover:bg-[#efe6d2] hover:text-[#8a3a3a]"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <span className="badge justify-self-center whitespace-nowrap bg-[#efe6d2] border-[#e2d9c3] text-[#6b6459] font-normal text-[11px] sm:text-xs px-3 py-1.5">
            {currentIndex + 1}
            <span className="text-[#c9c1ac] mx-1">/</span>
            {total}
          </span>

          <span className="badge justify-self-end whitespace-nowrap border-none bg-[#f3e8d9] text-[#8a3a3a] text-[11px] sm:text-xs px-2 py-1.5">
            Self recall
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className="fc-wrap"
            style={{ "--chars": charCount, "--hchars": hiraCount }}
          >
            <div className="fc-scene">
              {/* key={currentIndex}: kartu baru selalu mulai dari sisi depan tanpa animasi balik */}
              <div
                key={currentIndex}
                className={`fc-inner ${showAnswer ? "is-flipped" : ""}`}
                aria-live="polite"
              >
                <div className="fc-face fc-front">
                  <div className="fc-label">Depan</div>
                  <div className="fc-kanji">{currentCard.kanji}</div>
                </div>

                <div className="fc-face fc-back">
                  <div className="fc-label">Belakang</div>
                  <div className="fc-hiragana">{currentCard.hiragana}</div>
                  <div className="fc-meaning">{currentCard.arti}</div>
                </div>
              </div>
            </div>

            {!showAnswer ? (
              <button
                type="button"
                onClick={handleReveal}
                className="fc-btn bg-[#8a3a3a] hover:bg-[#752f2f]"
              >
                Tampilkan Jawaban
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="fc-btn bg-[#211d16] hover:bg-[#332c1f]"
              >
                {isLastCard ? "Selesai" : "Selanjutnya"}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* --w = lebar kartu. Semua ukuran font & padding dihitung dari --w,
           jadi teks selalu pas di dalam kartu di layar apa pun. */
        .fc-wrap {
          --w: max(11rem, min(86vw, 18rem, calc((100dvh - 15rem) * 5 / 6)));
          width: var(--w);
          display: flex;
          flex-direction: column;
          gap: clamp(0.9rem, 3dvh, 1.5rem);
        }

        .fc-scene {
          width: 100%;
          aspect-ratio: 5 / 6;
          perspective: 1400px;
        }

        .fc-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
          transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
          animation: fc-enter 0.25s ease-out;
        }

        .fc-inner.is-flipped {
          transform: rotateY(180deg);
        }

        .fc-face {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: calc(var(--w) * 0.04);
          padding: calc(var(--w) * 0.06);
          overflow: hidden;
          text-align: center;
          border-radius: 1.2rem;
          border: 1px solid #e4ddc9;
          background: linear-gradient(135deg, #faf8f2 0%, #f7f1e6 100%);
          box-shadow: 0 18px 36px -24px rgba(58, 54, 48, 0.38);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .fc-back {
          transform: rotateY(180deg);
        }

        .fc-label {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8a8371;
        }

        /* Kanji mengecil otomatis sesuai jumlah karakter (maks 80% lebar kartu) */
        .fc-kanji {
          font-family: "Hiragino Sans", "Noto Sans JP", "Yu Gothic", "Times New Roman", serif;
          font-size: min(calc(var(--w) * 0.38), calc(var(--w) * 0.8 / var(--chars)));
          line-height: 1.1;
          white-space: nowrap;
          color: #2b2620;
        }

        .fc-hiragana {
          font-family: "Hiragino Sans", "Noto Sans JP", "Yu Gothic", sans-serif;
          font-size: min(calc(var(--w) * 0.15), calc(var(--w) * 0.8 / var(--hchars)));
          line-height: 1.15;
          white-space: nowrap;
          color: #2b2620;
        }

        /* Arti boleh turun baris supaya tidak meluber */
        .fc-meaning {
          max-width: 100%;
          font-size: clamp(0.85rem, calc(var(--w) * 0.065), 1.25rem);
          line-height: 1.3;
          color: #6b6459;
          text-wrap: balance;
          overflow-wrap: anywhere;
        }

        .fc-btn {
          width: 100%;
          height: clamp(2.5rem, 6dvh, 3rem);
          border: none;
          border-radius: 0.6rem;
          color: #fff;
          font-size: clamp(0.85rem, 2.4vw, 1rem);
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }
        .fc-btn:active { transform: scale(0.98); }

        @keyframes fc-enter {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ArrowLeftIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}