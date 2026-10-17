import { useCallback, useEffect, useRef, useState } from "react";
import { generateQuiz, getAnswerVariants } from "../data/kanjiData";

export default function QuizPage({ config, onFinish, onExit }) {
  const [questions] = useState(() =>
    generateQuiz({
      babList: config.babList,
      questionType: config.questionType,
      answerType: config.answerType,
    })
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimitSeconds);
  const [isFinished, setIsFinished] = useState(false);

  const answersRef = useRef([]);
  const startTimeRef = useRef(null);
  const textInputRef = useRef(null);
  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const isTextMode = config.answerMode === "text";

  useEffect(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
  }, []);

  useEffect(() => {
    if (!isTextMode || submitted) return;
    if (textInputRef.current) {
      textInputRef.current.focus();
      textInputRef.current.setSelectionRange(
        textInputRef.current.value.length,
        textInputRef.current.value.length
      );
    }
  }, [currentIndex, isTextMode, submitted]);

  const finishQuiz = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);
    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    onFinish({
      questions,
      answers: answersRef.current,
      config,
      elapsedSeconds,
    });
  }, [config, isFinished, onFinish, questions]);

  const isAnswerCorrect = useCallback(
    (answer) => {
      const expectedVariants = new Set(
        getAnswerVariants(currentQuestion.correctAnswer)
      );
      const actualVariants = new Set(getAnswerVariants(answer));

      return [...actualVariants].some((variant) => expectedVariants.has(variant));
    },
    [currentQuestion]
  );

  const handleSelect = useCallback(
    (option) => {
      if (selected !== null || !currentQuestion) return;

      setSelected(option);
      const isCorrect = isAnswerCorrect(option);
      const newAnswer = {
        question: currentQuestion.question,
        correctAnswer: currentQuestion.correctAnswer,
        selected: option,
        isCorrect,
        kanji: currentQuestion.kanji,
        hiragana: currentQuestion.hiragana,
        arti: currentQuestion.arti,
      };

      setTimeout(() => {
        answersRef.current = [...answersRef.current, newAnswer];
        setSelected(null);
        setTypedAnswer("");
        setSubmitted(false);

        if (currentIndex + 1 < total) {
          setCurrentIndex((i) => i + 1);
        } else {
          finishQuiz();
        }
      }, 550);
    },
    [currentIndex, currentQuestion, finishQuiz, isAnswerCorrect, selected, total]
  );

  const handleSubmitTextAnswer = useCallback(() => {
    if (!typedAnswer.trim() || !currentQuestion || submitted) return;

    const normalizedInput = typedAnswer.trim();
    const isCorrect = isAnswerCorrect(normalizedInput);
    const newAnswer = {
      question: currentQuestion.question,
      correctAnswer: currentQuestion.correctAnswer,
      selected: normalizedInput,
      isCorrect,
      kanji: currentQuestion.kanji,
      hiragana: currentQuestion.hiragana,
      arti: currentQuestion.arti,
    };

    answersRef.current = [...answersRef.current, newAnswer];
    setSubmitted(true);

    if (isCorrect) {
      setTimeout(() => {
        setSubmitted(false);
        setTypedAnswer("");

        if (currentIndex + 1 < total) {
          setCurrentIndex((i) => i + 1);
        } else {
          finishQuiz();
        }
      }, 700);
    }
  }, [currentIndex, currentQuestion, finishQuiz, isAnswerCorrect, submitted, total, typedAnswer]);

  const goToNextQuestion = useCallback(() => {
    setSubmitted(false);
    setTypedAnswer("");

    if (currentIndex + 1 < total) {
      setCurrentIndex((i) => i + 1);
    } else {
      finishQuiz();
    }
  }, [currentIndex, finishQuiz, total]);

  useEffect(() => {
    if (config.timeLimitSeconds == null) return;
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, config.timeLimitSeconds]);

  useEffect(() => {
    if (config.timeLimitSeconds == null) return;
    if (timeLeft !== 0) return;

    const timer = setTimeout(() => { finishQuiz(); }, 0);
    return () => clearTimeout(timer);
  }, [config.timeLimitSeconds, finishQuiz, timeLeft]);

  useEffect(() => {
    if (!currentQuestion) return;

    const onKeyDown = (e) => {
      if (isTextMode) return;
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < currentQuestion.options.length) {
        handleSelect(currentQuestion.options[idx]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentQuestion, handleSelect, isTextMode]);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#f6f2e9] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="alert bg-[#f6e6e3] border border-[#e2c3bd] text-[#5c2a2a] flex-col gap-3 py-6">
            <span className="text-sm">
              Tidak ada soal untuk bab yang dipilih.
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

  const minutes = timeLeft != null ? Math.floor(timeLeft / 60) : null;
  const seconds = timeLeft != null ? timeLeft % 60 : null;
  const timePercent =
    timeLeft != null && config.timeLimitSeconds
      ? Math.round((timeLeft / config.timeLimitSeconds) * 100)
      : 0;
  const isLowTime = timeLeft != null && timeLeft <= 10;
  const responseIsCorrect = submitted && isAnswerCorrect(typedAnswer);
  const currentCorrectAnswer = currentQuestion?.correctAnswer || "";

  return (
    <div className="min-h-screen bg-[#f6f2e9] text-[#2b2620] flex flex-col">
      <div className="max-w-2xl w-full mx-auto px-5 sm:px-8 py-8 flex-1 flex flex-col">
        <div className="grid grid-cols-3 items-center gap-2 mb-6">
          <button
            type="button"
            onClick={onExit}
            className="btn btn-ghost btn-sm justify-self-start px-2 text-[#8a3a3a] hover:bg-[#efe6d2] hover:text-[#8a3a3a]"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>

          <span className="badge justify-self-center whitespace-nowrap bg-[#efe6d2] border-[#e2d9c3] text-[#6b6459] font-normal text-[11px] sm:text-xs px-2 sm:px-3">
            <span className="hidden sm:inline">Soal&nbsp;</span>
            {currentIndex + 1}
            <span className="text-[#c9c1ac] mx-0.5">/</span>
            {total}
          </span>

          {timeLeft != null ? (
            <div
              className={`radial-progress justify-self-end text-[10px] sm:text-[11px] font-medium tabular-nums ${
                isLowTime ? "text-[#a5402f]" : "text-[#8a3a3a]"
              }`}
              style={{
                "--value": timePercent,
                "--size": "2.5rem",
                "--thickness": "3px",
              }}
              role="progressbar"
              aria-label="Sisa waktu"
            >
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </div>
          ) : (
            <span className="badge badge-ghost justify-self-end text-[#c9c1ac] border-none text-[11px] sm:text-xs">
              Tanpa waktu
            </span>
          )}
        </div>

        <div className="h-0.75 w-full bg-[#e2d9c3] rounded-full mb-14 overflow-hidden">
          <div
            className="h-full bg-[#8a3a3a] rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p
            className={`font-serif mb-14 ${
              config.questionType === "kanji"
                ? "text-6xl sm:text-7xl"
                : "text-3xl sm:text-4xl"
            }`}
          >
            {currentQuestion.question}
          </p>

          {isTextMode ? (
            <div className="w-full max-w-md">
              <div className="relative">
                <input
                  ref={textInputRef}
                  type="text"
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (submitted && !responseIsCorrect) {
                        goToNextQuestion();
                        return;
                      }

                      handleSubmitTextAnswer();
                    }
                  }}
                  placeholder="Ketik jawabanmu..."
                  className="input input-bordered w-full h-14 rounded-xl border-[#e2d9c3] bg-white/80 px-4 text-base text-[#2b2620] shadow-sm shadow-[#f0e8dc] placeholder:text-[#a39d8a] focus:border-[#8a3a3a] focus:shadow-md focus:shadow-[#ecd7d1] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                  autoFocus
                  disabled={submitted}
                />
              </div>

              <div className={`mt-4 rounded-xl border px-3 py-2.5 text-left shadow-sm ${
                  submitted
                    ? responseIsCorrect
                      ? "border-[#dfeadf] bg-[#f4faf4] text-[#355a3d]"
                      : "border-[#ead7d4] bg-[#fff8f6] text-[#6d3b3b]"
                    : "border-[#eee5d7] bg-[#faf7f1] text-[#5d564b]"
                }`}>
                {submitted ? (
                  responseIsCorrect ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#dfeadf] text-[11px] font-bold text-[#355a3d]">✓</span>
                      <span className="font-medium">Jawaban benar</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f2d7d5] text-[11px] font-bold text-[#7c3b3b]">✕</span>
                        <span className="font-medium">Jawaban salah</span>
                      </div>
                      <p className="text-xs text-[#7c3b3b]">
                        Jawaban yang benar: <span className="font-semibold">{currentCorrectAnswer}</span>
                      </p>
                    </div>
                  )
                ) : (
                  <p className="text-xs leading-relaxed">
                    Jawaban bisa ditulis dengan atau tanpa tanda strip
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (submitted && !responseIsCorrect) {
                      goToNextQuestion();
                      return;
                    }

                    handleSubmitTextAnswer();
                  }}
                  disabled={!typedAnswer.trim() || (submitted && responseIsCorrect)}
                  className="btn h-11 rounded-xl border-none bg-[#211d16] text-white hover:bg-[#332c1f] disabled:bg-[#ebe5d5] disabled:text-[#b3ac99]"
                >
                  {submitted ? (responseIsCorrect ? "Lanjut..." : "Lanjut") : "Jawab"}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((opt, i) => {
                const isSelected = selected === opt;
                const isCorrectOpt = opt === currentQuestion.correctAnswer;
                const showFeedback = selected !== null;

                let stateClass =
                  "bg-transparent border-[#e2d9c3] text-[#2b2620] hover:border-[#8a3a3a] hover:bg-[#efe6d2]";
                if (showFeedback && isCorrectOpt) {
                  stateClass =
                    "bg-[#e9f2e7] border-[#4a7a4f] text-[#2b2620] hover:bg-[#e9f2e7]";
                } else if (showFeedback && isSelected && !isCorrectOpt) {
                  stateClass =
                    "bg-[#f6e6e3] border-[#8a3a3a] text-[#2b2620] hover:bg-[#f6e6e3]";
                } else if (showFeedback) {
                  stateClass =
                    "bg-transparent border-[#e2d9c3] text-[#2b2620]/40";
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    disabled={selected !== null}
                    className={`btn btn-block h-14 justify-between normal-case rounded-md border text-base font-normal transition-colors px-4 ${stateClass}`}
                  >
                    <span className="flex items-center gap-3">
                      <kbd className="kbd kbd-sm bg-[#f6f2e9] border-[#e2d9c3] text-[#8a8371]">
                        {i + 1}
                      </kbd>
                      {opt}
                    </span>

                    {showFeedback && isCorrectOpt && (
                      <CheckIcon className="text-[#4a7a4f]" />
                    )}
                    {showFeedback && isSelected && !isCorrectOpt && (
                      <CrossIcon className="text-[#8a3a3a]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon({ className = "" }) {
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
      <path d="M12 15l-5-5 5-5M7.5 10H17" />
    </svg>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg
      className={`w-5 h-5 shrink-0 ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
      className={`w-5 h-5 shrink-0 ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}