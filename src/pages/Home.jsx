export default function Home({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#f4f0e6] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#faf8f2] border border-[#e4ddc9] rounded-2xl shadow-sm p-8 text-center">
        <h1 className="text-2xl font-semibold text-[#3a3630] mb-1">
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
            label="Daftar Kanji"
            description="Lihat semua kanji per bab"
            onClick={() => onNavigate("daftar-kanji")}
          />
        </div>
      </div>
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