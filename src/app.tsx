import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Calculator, Heart, Brain, ShieldAlert, Terminal, Activity, Lock, ArrowLeft } from 'lucide-react';

// --- KOMPONENTY STRON (Tu będą Twoje narzędzia) ---

// Placeholder dla Evil Calculator (zrobimy go w następnym kroku)
const EvilCalculatorPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-black text-red-500">
    <h1 className="text-4xl font-bold mb-4 animate-pulse">EVIL CALCULATOR LOADING...</h1>
    <Link to="/" className="flex items-center gap-2 text-white hover:text-red-400 transition-colors">
      <ArrowLeft /> Wróć do bazy
    </Link>
  </div>
);

// Placeholder dla IQ Test
const IQTestPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-black text-purple-500">
    <h1 className="text-4xl font-bold mb-4">IQ CRUSHER LOADING...</h1>
    <Link to="/" className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors">
      <ArrowLeft /> Wróć do bazy
    </Link>
  </div>
);

// --- KOMPONENT STRONY GŁÓWNEJ (LANDING PAGE) ---

const Home = () => {
  const [activeUsers, setActiveUsers] = useState(124);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden relative">
      
      {/* Tło - Grid Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-white/5 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <Terminal className="w-6 h-6 text-purple-500 group-hover:text-purple-400 transition-colors" />
          <span className="text-xl font-bold tracking-tighter text-white group-hover:tracking-widest transition-all duration-300">
            CHAOS_HUB
          </span>
        </Link>
        <div className="flex gap-4">
          <button className="hidden md:block px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            Ranking Ofiar
          </button>
          <button className="px-5 py-2 text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all rounded-lg text-white">
            Panel Twórcy
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-16 pb-12 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/20 border border-purple-500/20 text-purple-400 text-xs font-mono mb-6 animate-pulse">
          <Activity className="w-3 h-3" />
          <span>LIVE: {activeUsers} OSÓB TROLLUJE ZNAJOMYCH</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
          Narzędzia, których <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            będą żałować.
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Wybierz tryb, wygeneruj link i patrz jak świat płonie. 
          Jedyny hub do bezpiecznego trollowania.
        </p>
      </header>

      {/* Bento Grid - Modes */}
      <main className="relative z-10 px-6 pb-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          
          {/* Card 1: Evil Calculator */}
          <Link to="/calculator" className="group relative md:col-span-2 md:row-span-2 bg-neutral-900/50 border border-white/5 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300 overflow-hidden cursor-pointer block">
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <Calculator className="w-24 h-24 text-red-900/20 group-hover:text-red-500/20 rotate-12 transition-transform" />
            </div>
            <div className="relative h-full flex flex-col justify-end">
              <div className="mb-4 p-3 bg-red-500/10 w-fit rounded-lg border border-red-500/20 group-hover:scale-110 transition-transform origin-bottom-left">
                <Calculator className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">Evil Calculator</h3>
              <p className="text-gray-400 group-hover:text-gray-300">
                Wygląda jak systemowy kalkulator. Działa jak opętany. 
                Szatanskie wyniki, uciekające przyciski i memy przy dzieleniu przez zero.
              </p>
            </div>
          </Link>

          {/* Card 2: Valentine Mode */}
          <div className="group relative bg-neutral-900/50 border border-white/5 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300 cursor-pointer">
            <div className="absolute top-4 right-4">
              <Heart className="w-6 h-6 text-pink-500/50 group-hover:text-pink-500 animate-pulse" />
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-pink-400">Walentynka</h3>
              <p className="text-sm text-gray-500">Przycisk "NIE" nie działa. Idealne na wymuszenie randki.</p>
            </div>
          </div>

          {/* Card 3: IQ Test */}
          <Link to="/iq-test" className="group relative bg-neutral-900/50 border border-white/5 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 cursor-pointer block">
            <div className="absolute top-4 right-4">
              <Brain className="w-6 h-6 text-purple-500/50 group-hover:text-purple-500 group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400">IQ Crusher</h3>
              <p className="text-sm text-gray-500">Test z pytaniami bez odpowiedzi. Wynik zawsze obraża gracza.</p>
            </div>
          </Link>

          {/* Card 4: Password Roast */}
          <div className="group md:col-span-2 relative bg-neutral-900/50 border border-white/5 rounded-2xl p-6 flex items-center justify-between hover:border-green-500/50 transition-all duration-300 cursor-pointer">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-5 h-5 text-green-500" />
                <h3 className="text-xl font-bold text-white group-hover:text-green-400">Password Roast</h3>
              </div>
              <p className="text-sm text-gray-500 max-w-md">
                Sprawdź siłę hasła i zostań wyśmiany przez AI. Bezpieczne (działa lokalnie), ale bolesne.
              </p>
            </div>
            <ShieldAlert className="w-12 h-12 text-green-900/30 group-hover:text-green-500/50 transition-colors" />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center bg-[#050505] relative z-10">
        <h2 className="text-2xl font-bold text-white mb-4">Gotowy siać zamęt?</h2>
        <button className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-purple-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          ZALOGUJ SIĘ I STWÓRZ LINK
        </button>
        <p className="mt-8 text-xs text-gray-600 font-mono">
          PROJECT: CHAOS_HUB v0.1 // SECURE & ANONYMOUS
        </p>
      </footer>
    </div>
  );
};

// --- GŁÓWNA APLIKACJA Z ROUTINGIEM ---

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<EvilCalculatorPage />} />
        <Route path="/iq-test" element={<IQTestPage />} />
      </Routes>
    </Router>
  );
};

export default App;