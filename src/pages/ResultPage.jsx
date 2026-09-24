export default function ResultPage({ result, onHome }) {
  const { questions, answers } = result;
  const total = questions.length;
  const answered = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const wrong = answered - correct;
  const unanswered = total - answered;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  const detail = questions.map((q, i) => {
    const a = answers[i];
    if (!a) {
      return {
        status: "unanswered",
        kanji: q.kanji,
        hiragana: q.hiragana,
        arti: q.arti,
        correctAnswer: q.correctAnswer,
      };
    }
    return {
      status: a.isCorrect ? "correct" : "wrong",
      kanji: a.kanji,
      hiragana: a.hiragana,
      arti: a.arti,
      correctAnswer: a.correctAnswer,
      selected: a.selected,
    };
  });

  return (
    <div className="min-h-screen bg-[#f6f2e9] text-[#2b2620]">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12">
        <button
          type="button"
          onClick={onHome}
          className="btn btn-ghost btn-sm -ml-2 mb-4 px-2 text-[#8a3a3a] hover:bg-[#efe6d2] hover:text-[#8a3a3a] normal-case"
        >
          ← Kembali
        </button>

        <p className="text-xs tracking-wide text-[#8a3a3a] mb-1.5">
          漢字クイズ
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl mb-8">Hasil kuis</h1>

        <div className="flex flex-col items-center gap-5 border-y border-[#e2d9c3] py-10 mb-8 text-center">
          <div
            className="radial-progress text-[#8a3a3a]"
            style={{
              "--value": percentage,
              "--size": "7.5rem",
              "--thickness": "6px",
            }}
            role="progressbar"
            aria-label={`${percentage}% jawaban benar`}
          >
            <span className="font-serif text-3xl text-[#2b2620]">
              {percentage}%
            </span>
          </div>

          <div>
            <p className="font-serif text-2xl">
              {correct}
              <span className="text-base text-[#8a8371]"> / {total} benar</span>
            </p>
            <p className="text-xs text-[#8a8371] mt-1.5">
              {answered} dari {total} soal dijawab
              {unanswered > 0 ? ` · ${unanswered} tidak terjawab` : ""}
            </p>
          </div>
        </div>

        <div className="stats stats-vertical sm:stats-horizontal w-full border border-[#e2d9c3] bg-transparent rounded-md mb-10">
          <div className="stat place-items-center py-4">
            <div className="stat-title text-[#8a8371] text-xs">Dijawab</div>
            <div className="stat-value text-2xl text-[#2b2620]">
              {answered}
              <span className="text-sm text-[#8a8371]">/{total}</span>
            </div>
          </div>
          <div className="stat place-items-center py-4">
            <div className="stat-title text-[#8a8371] text-xs">Benar</div>
            <div className="stat-value text-2xl text-[#4a7a4f]">{correct}</div>
          </div>
          <div className="stat place-items-center py-4">
            <div className="stat-title text-[#8a8371] text-xs">Salah</div>
            <div className="stat-value text-2xl text-[#8a3a3a]">{wrong}</div>
          </div>
          <div className="stat place-items-center py-4">
            <div className="stat-title text-[#8a8371] text-xs">
              Tidak terjawab
            </div>
            <div className="stat-value text-2xl text-[#8a8371]">
              {unanswered}
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xs font-medium text-[#8a8371] mb-4">
            RINCIAN JAWABAN
          </h2>
          <div className="flex flex-col gap-2">
            {detail.map((d, i) => (
              <DetailRow key={i} d={d} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const STATUS = {
  correct: {
    label: "Benar",
    border: "#4a7a4f",
    badgeBg: "#e9f2e7",
    badgeText: "#3f6b43",
    badgeBorder: "#c9ddc5",
  },
  wrong: {
    label: "Salah",
    border: "#8a3a3a",
    badgeBg: "#f6e6e3",
    badgeText: "#8a3a3a",
    badgeBorder: "#e6c9c3",
  },
  unanswered: {
    label: "Tidak terjawab",
    border: "#c9c1ac",
    badgeBg: "#efe6d2",
    badgeText: "#8a8371",
    badgeBorder: "#e2d9c3",
  },
};

function DetailRow({ d }) {
  const s = STATUS[d.status];

  return (
    <div
      className="flex items-start justify-between gap-3 rounded-md border border-[#e2d9c3] bg-white/50 pl-3 pr-4 py-3 border-l-4"
      style={{ borderLeftColor: s.border }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-serif text-lg text-[#2b2620] shrink-0">
          {d.kanji}
        </span>
        <div className="min-w-0">
          <p className="text-sm text-[#2b2620] truncate">
            {d.hiragana} — {d.arti}
          </p>
          {d.status === "unanswered" ? (
            <p className="text-xs text-[#8a8371] mt-0.5">
              Waktu habis sebelum sempat dijawab · jawaban: {d.correctAnswer}
            </p>
          ) : (
            <p className="text-xs text-[#8a8371] mt-0.5 truncate">
              Jawabanmu:{" "}
              <span
                className="font-medium"
                style={{ color: d.status === "correct" ? "#4a7a4f" : "#8a3a3a" }}
              >
                {d.selected}
              </span>
              {d.status === "wrong" && (
                <span> · benar: {d.correctAnswer}</span>
              )}
            </p>
          )}
        </div>
      </div>

      <span
        className="badge shrink-0 border font-normal text-[11px] gap-1"
        style={{
          backgroundColor: s.badgeBg,
          color: s.badgeText,
          borderColor: s.badgeBorder,
        }}
      >
        {d.status === "correct" && <CheckIcon className="w-3 h-3" />}
        {d.status === "wrong" && <CrossIcon className="w-3 h-3" />}
        {d.status === "unanswered" && <MinusIcon className="w-3 h-3" />}
        {s.label}
      </span>
    </div>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

function CrossIcon({ className = "" }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

function MinusIcon({ className = "" }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M5 10h10" />
    </svg>
  );
}