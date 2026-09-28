import { useState } from "react";
import Home from "./pages/Home";
import QuizSetupPage from "./pages/QuizSetupPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import DaftarKanjiPage from "./pages/DaftarKanjiPage";
import FlashcardSetupPage from "./pages/FlashcardSetupPage";
import FlashcardPage from "./pages/FlashcardPage";

function App() {
  // "home" | "quiz-setup" | "quiz" | "result" | "daftar-kanji" | "flashcard-setup" | "flashcard"
  const [page, setPage] = useState("home");
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [flashcardConfig, setFlashcardConfig] = useState(null);

  const handleStartQuiz = (config) => {
    setQuizConfig(config);
    setPage("quiz");
  };

  const handleFinishQuiz = (result) => {
    setQuizResult(result);
    setPage("result");
  };

  const handleRetry = () => {
    setQuizResult(null);
    setPage("quiz-setup");
  };

  const handleStartFlashcard = (config) => {
    setFlashcardConfig(config);
    setPage("flashcard");
  };

  const handleHome = () => {
    setQuizConfig(null);
    setQuizResult(null);
    setFlashcardConfig(null);
    setPage("home");
  };

  if (page === "quiz-setup") {
    return <QuizSetupPage onStartQuiz={handleStartQuiz} onBack={handleHome} />;
  }

  if (page === "quiz" && quizConfig) {
    return (
      <QuizPage
        config={quizConfig}
        onFinish={handleFinishQuiz}
        onExit={handleHome}
      />
    );
  }

  if (page === "result" && quizResult) {
    return (
      <ResultPage result={quizResult} onRetry={handleRetry} onHome={handleHome} />
    );
  }

  if (page === "daftar-kanji") {
    return <DaftarKanjiPage onBack={handleHome} />;
  }

  if (page === "flashcard-setup") {
    return (
      <FlashcardSetupPage
        onStartFlashcard={handleStartFlashcard}
        onBack={handleHome}
      />
    );
  }

  if (page === "flashcard" && flashcardConfig) {
    return (
      <FlashcardPage
        config={flashcardConfig}
        onExit={handleHome}
        onBack={() => setPage("flashcard-setup")}
      />
    );
  }

  return <Home onNavigate={setPage} />;
}

export default App;