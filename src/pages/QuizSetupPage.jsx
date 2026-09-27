import { useMemo, useState } from "react";
import { getBabNumbers } from "../data/kanjiData";

const TAMPILAN_SOAL = [
  { value: "kanji", label: "Kanji" },
  { value: "hiragana", label: "Hiragana" },
  { value: "arti", label: "Arti" },
];

const TAMPILAN_JAWABAN = [
  { value: "hiragana", label: "Hiragana" },
  { value: "arti", label: "Arti" },
  { value: "kanji", label: "Kanji" },
];

const JENIS_JAWABAN = [
  { value: "multiple", label: "Pilihan ganda" },
  { value: "text", label: "Isian" },
];

const WAKTU_OPSI = [
  { value: "10", label: "10 dtk" },
  { value: "20", label: "20 dtk" },
  { value: "30", label: "30 dtk" },
  { value: "custom", label: "Custom" },
  { value: "none", label: "Tanpa waktu" },
];

export default function QuizSetupPage({ onStartQuiz, onBack }) {
  const babNumbers = useMemo(() => getBabNumbers(), []);

  const [selectedBabs, setSelectedBabs] = useState([]);
  const [questionType, setQuestionType] = useState("hiragana");
  const [answerType, setAnswerType] = useState("kanji");
  const [answerMode, setAnswerMode] = useState("multiple");
  const [timeOption, setTimeOption] = useState("30");
  const [customSeconds, setCustomSeconds] = useState("");

  const isArtiAnswerType = answerType === "arti";

  const handleAnswerTypeChange = (nextType) => {
    setAnswerType(nextType);
    if (nextType !== "arti") {
      setAnswerMode("multiple");
    }
  };

  const toggleBab = (bab) => {
    setSelectedBabs((prev) =>
      prev.includes(bab) ? prev.filter((b) => b !== bab) : [...prev, bab]
    );
  };

  const pilihSemua = () => setSelectedBabs(babNumbers);
  const kosongkan = () => setSelectedBabs([]);

  const bisaMulai = selectedBabs.length > 0;

  const handleMulai = () => {
    if (!bisaMulai) return;

    const timeLimitSeconds =
      timeOption === "none"
        ? null
        : timeOption === "custom"
        ? Number(customSeconds) || 0
        : Number(timeOption);

    const config = {
      babList: selectedBabs,
      questionType,
      answerType,
      answerMode: isArtiAnswerType ? answerMode : "multiple",
      timeLimitSeconds,
    };

    if (onStartQuiz) {
      onStartQuiz(config);
    } else {
      console.log("Mulai kuis dengan konfigurasi:", config);
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
            漢字クイズ
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl leading-tight mb-1.5">
            Atur kuis kanji
          </h1>
          <p className="text-sm text-[#6b6459] max-w-md">
            Pilih bab yang ingin dipelajari, bentuk soal, dan batas waktunya.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-14">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3.5">
              <SectionLabel>Pilih bab kanji</SectionLabel>
              <span className="badge border-none bg-[#efe6d2] text-[#8a3a3a] font-normal text-[11px]">
                {selectedBabs.length} dipilih
              </span>
            </div>

            <div
              className="grid gap-1.5 mb-3"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(40px, 1fr))",
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

            <div className="flex gap-2 text-xs">
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
          </div>

          <div className="lg:w-80 shrink-0 pt-5 lg:pt-0 pb-2 border-t border-[#e2d9c3] lg:border-t-0 lg:border-l lg:pl-12">
            <div className="mb-5">
              <SectionLabel>Tampilkan soal sebagai</SectionLabel>
              <TabGroup
                options={TAMPILAN_SOAL}
                value={questionType}
                onChange={setQuestionType}
              />
            </div>

            <div className="mb-5">
              <SectionLabel>Pilihan jawaban berupa</SectionLabel>
              <TabGroup
                options={TAMPILAN_JAWABAN}
                value={answerType}
                onChange={handleAnswerTypeChange}
              />
            </div>

            {isArtiAnswerType && (
              <div className="mb-6">
                <SectionLabel>Mode jawaban</SectionLabel>
                <TabGroup
                  options={JENIS_JAWABAN}
                  value={answerMode}
                  onChange={setAnswerMode}
                />
              </div>
            )}

            <div className="mb-6">
              <SectionLabel>Batas waktu total kuis</SectionLabel>

              <div className="grid grid-cols-3 gap-1 bg-[#efe6d2] p-1 rounded-full mt-3">
                {WAKTU_OPSI.slice(0, 3).map((opt) => (
                  <TimeChip
                    key={opt.value}
                    opt={opt}
                    active={timeOption === opt.value}
                    onClick={() => setTimeOption(opt.value)}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1 bg-[#efe6d2] p-1 rounded-full mt-1.5">
                {WAKTU_OPSI.slice(3).map((opt) => (
                  <TimeChip
                    key={opt.value}
                    opt={opt}
                    active={timeOption === opt.value}
                    onClick={() => setTimeOption(opt.value)}
                  />
                ))}
              </div>

              {timeOption === "custom" && (
                <input
                  type="number"
                  min={1}
                  value={customSeconds}
                  onChange={(e) => setCustomSeconds(e.target.value)}
                  placeholder="Masukkan detik, mis. 45"
                  className="input input-bordered mt-2 w-full h-9 rounded-lg border-[#e2d9c3] bg-transparent px-3 text-sm text-[#2b2620] placeholder:text-[#a39d8a] outline-none focus:border-[#8a3a3a] focus:outline-none"
                />
              )}

              <p className="mt-2.5 text-[11px] leading-relaxed text-[#8a8371]">
                Berlaku untuk seluruh kuis, bukan per soal.
              </p>
            </div>

            <button
              type="button"
              onClick={handleMulai}
              disabled={!bisaMulai}
              className={`btn btn-block h-11 rounded-lg text-sm font-medium normal-case border-none transition-colors
                ${
                  bisaMulai
                    ? "bg-[#211d16] text-white hover:bg-[#332c1f]"
                    : "bg-[#ebe5d5] text-[#b3ac99] hover:bg-[#ebe5d5] cursor-not-allowed"
                }`}
            >
              Mulai kuis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeChip({ opt, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-7 rounded-full text-xs normal-case font-normal whitespace-nowrap transition-colors
        ${
          active
            ? "bg-[#211d16] text-white"
            : "text-[#6b6459] hover:text-[#2b2620]"
        }`}
    >
      {opt.label}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <h2 className="flex items-center gap-2 text-xs font-medium text-[#2b2620] mb-3">
      <span className="inline-block w-2.5 h-[1.5px] bg-[#8a3a3a]" />
      {children}
    </h2>
  );
}

function TabGroup({ options, value, onChange }) {
  return (
    <div
      role="tablist"
      className="tabs tabs-boxed bg-[#efe6d2] p-1 gap-1 rounded-full min-h-0 mt-3"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`tab flex-1 h-8 min-h-0 rounded-full text-xs sm:text-sm normal-case font-normal transition-colors
              ${
                active
                  ? "bg-[#211d16] text-white"
                  : "text-[#6b6459] hover:text-[#2b2620]"
              }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}