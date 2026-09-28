import { useEffect, useMemo, useState } from "react";
import { getBabNumbers, getKanjiByBabs } from "../data/kanjiData";
import { countDue, dedupeCards, loadProgress, resetProgress } from "../utils/srs";

export default function FlashcardSetupPage({ onStartFlashcard, onBack }) {
  const babNumbers = useMemo(() => getBabNumbers(), []);
  const [selectedBabs, setSelectedBabs] = useState([]);
  const [resetTick, setResetTick] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  // Tutup jendela info dengan tombol Esc + kunci scroll halaman saat terbuka
  useEffect(() => {
    if (!showInfo) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShowInfo(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showInfo]);

  const toggleBab = (bab) => {
    setSelectedBabs((prev) =>
      prev.includes(bab) ? prev.filter((b) => b !== bab) : [...prev, bab]
    );
  };

  const pilihSemua = () => setSelectedBabs(babNumbers);
  const kosongkan = () => setSelectedBabs([]);
  const bisaMulai = selectedBabs.length > 0;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const info = useMemo(() => {
    const cards = getKanjiByBabs(selectedBabs);
    return {
      total: dedupeCards(cards).length,
      due: countDue(cards, loadProgress()),
    };
  }, [selectedBabs, resetTick]);

  const handleMulai = () => {
    if (!bisaMulai || !onStartFlashcard) return;
    onStartFlashcard({ babList: selectedBabs });
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Hapus semua progres flashcard (kartu sulit & jadwal ulang) di perangkat ini?"
      )
    ) {
      resetProgress();
      setResetTick((t) => t + 1);
    }
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
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="font-serif text-2xl sm:text-3xl leading-tight">
              Pilih bab flashcard
            </h1>
            <button
              type="button"
              onClick={() => setShowInfo(true)}
              aria-label="Penjelasan sistem flashcard"
              title="Penjelasan sistem flashcard"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#8a3a3a] text-[13px] font-bold leading-none text-[#8a3a3a] transition-colors hover:bg-[#8a3a3a] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a3a3a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f2e9]"
            >
              !
            </button>
          </div>
          <p className="text-sm text-[#6b6459] max-w-md">
            Pilih bab yang ingin kamu pelajari hari ini. Kartu yang sulit dan
            sudah jatuh tempo akan muncul lebih dulu.
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

          <div className="flex gap-2 text-xs mb-4">
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

          <p className="text-xs text-[#6b6459] mb-5 min-h-[1rem]">
            {bisaMulai
              ? `${info.total} kartu, ${info.due} jatuh tempo untuk diulang`
              : "Pilih minimal satu bab untuk mulai."}
          </p>

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

          <button
            type="button"
            onClick={handleReset}
            className="btn btn-ghost btn-xs mt-4 px-2 text-[#8a8371] hover:bg-transparent hover:text-[#8a3a3a] normal-case font-normal"
          >
            Reset progres
          </button>
        </div>
      </div>

      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </div>
  );
}

function InfoModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b2620]/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fc-info-title"
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[88dvh] w-full max-w-md flex-col rounded-2xl border border-[#e4ddc9] bg-[#faf8f2] shadow-[0_20px_50px_-20px_rgba(58,54,48,0.5)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#e4ddc9] px-5 py-4">
          <div>
            <p className="mb-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8a3a3a]">
              Informasi
            </p>
            <h2 id="fc-info-title" className="font-serif text-xl leading-tight">
              Cara kerja flashcard
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg leading-none text-[#8a8371] transition-colors hover:bg-[#efe6d2] hover:text-[#8a3a3a]"
          >
            ✕
          </button>
        </div>

        {/* Isi (bisa di-scroll di layar kecil) */}
        <div className="overflow-y-auto px-5 py-4 text-sm leading-relaxed text-[#4a443a]">
          <p className="mb-4">
            Setelah membalik kartu, nilai seberapa kamu mengingatnya. Nilaimu
            menentukan <b>kapan kartu itu muncul lagi</b>, di sesi ini dan di hari
            berikutnya.
          </p>

          <div className="space-y-3">
            <RateItem
              color="#8a3a3a"
              title="Tidak hafal"
              desc="Kamu lupa atau salah."
              session="Muncul lagi 3 kartu kemudian."
              later="Jadwal kembali ke awal, muncul lagi besok."
            />
            <RateItem
              color="#b7822f"
              title="Sulit"
              desc="Kamu ingat, tapi lama atau ragu-ragu."
              session="Muncul lagi 8 kartu kemudian."
              later="Jadwal turun satu tingkat, muncul lagi paling cepat besok."
            />
            <RateItem
              color="#3f6b4a"
              title="Normal"
              desc="Kamu ingat dengan lancar."
              session="Kartu selesai, tidak diulang di sesi ini."
              later="Jadwal naik satu tingkat: 1 → 3 → 7 → 14 → 30 hari."
            />
          </div>

          <div className="mt-4 rounded-xl bg-[#efe6d2]/70 px-4 py-3 text-[13px]">
            <p className="mb-1.5 font-medium text-[#2b2620]">Yang perlu diketahui</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                Satu kartu maksimal diulang 3 kali dalam satu sesi, supaya sesi
                tidak berputar terus.
              </li>
              <li>
                Angka <b>Dikuasai X / total</b> hanya bertambah saat kartu selesai.
              </li>
              <li>
                Kartu yang sudah jatuh tempo muncul lebih dulu, lalu kartu baru,
                lalu kartu yang jadwalnya masih jauh.
              </li>
              <li>
                Progres tersimpan di browser perangkat ini. Pindah perangkat atau
                hapus data browser, progres tidak ikut.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e4ddc9] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-block h-10 rounded-lg border-none bg-[#8a3a3a] text-sm font-medium normal-case text-white hover:bg-[#752f2f]"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

function RateItem({ color, title, desc, session, later }) {
  return (
    <div
      className="rounded-xl border border-[#e4ddc9] bg-white/60 py-3 pl-4 pr-3"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <p className="font-semibold" style={{ color }}>
        {title}
      </p>
      <p className="mb-1.5 text-[13px] text-[#6b6459]">{desc}</p>
      <p className="text-[13px]">
        <span className="font-medium text-[#2b2620]">Di sesi ini:</span> {session}
      </p>
      <p className="text-[13px]">
        <span className="font-medium text-[#2b2620]">Jadwal berikutnya:</span> {later}
      </p>
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