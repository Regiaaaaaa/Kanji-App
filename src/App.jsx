import { useState } from "react";
import Home from "./pages/Home";
import QuizSetupPage from "./pages/QuizSetupPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import DaftarKanjiPage from "./pages/DaftarKanjiPage";

function App() {
  // "home" | "quiz-setup" | "quiz" | "result" | "daftar-kanji"
  const [page, setPage] = useState("home");
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

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

  const handleHome = () => {
    setQuizConfig(null);
    setQuizResult(null);
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

  return <Home onNavigate={setPage} />;
}

export default App;