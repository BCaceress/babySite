"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  // Nome do bebê (você pode alterar conforme necessário)
  const babyName = "Lívia";

  // Data estimada de nascimento (altere para a data correta) - moved outside to prevent recreation
  const dueDate = useMemo(() => new Date("January 14, 2026"), []);

  // Estado para armazenar o tempo restante
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Referência para o elemento de áudio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Estado para controlar se o áudio está tocando
  const [isPlaying, setIsPlaying] = useState(false);

  // Estado para controlar se houve erro no áudio
  const [audioError, setAudioError] = useState(false);

  // Estado para controlar quantas vezes o áudio tocou
  const [playCount, setPlayCount] = useState(0);

  // Função para calcular o tempo restante até o nascimento
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = dueDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    // Atualiza a cada segundo
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [dueDate]);

  // Função para reproduzir/pausar o áudio do batimento cardíaco
  const toggleHeartbeat = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      // Reset do contador e posição do áudio
      if (playCount > 0) setPlayCount(0); // Usa playCount para resolver warning
      audio.currentTime = 0;

      if (audio.readyState < 2) {
        audio.load();
      }

      audio.play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch(() => {
          // Tenta novamente com volume baixo primeiro
          audio.volume = 0.1;
          audio.play()
            .then(() => {
              audio.volume = 1.0;
              setIsPlaying(true);
              setAudioError(false);
            })
            .catch(() => {
              setAudioError(true);
              setIsPlaying(false);
            });
        });
    } else {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setPlayCount(0);
    }
  };

  // Efeito para sincronizar o estado com eventos do áudio
  useEffect(() => {
    // Cria um novo elemento de áudio programaticamente
    const audio = new Audio('/sound/batimento.mp3');
    audio.loop = false; // Remove o loop para controlar manualmente
    audio.preload = 'auto';
    audio.volume = 1.0;

    // Atribui ao ref
    audioRef.current = audio;

    const handlePlay = () => {
      setIsPlaying(true);
      setAudioError(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    const handleLoadedData = () => {
      setAudioError(false);
    };

    const handleEnded = () => {
      setPlayCount(prev => {
        const newCount = prev + 1;
        if (newCount < 2) {
          // Toca novamente se ainda não tocou 2 vezes
          audio.currentTime = 0;
          audio.play().catch(() => {
            setAudioError(true);
            setIsPlaying(false);
          });
          return newCount;
        } else {
          // Para após 2 reproduções
          setIsPlaying(false);
          return 0; // Reset do contador
        }
      });
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    // Força o carregamento
    audio.load();

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);

      // Limpa o ref
      audioRef.current = null;
    };
  }, []);

  return (
    <div className="font-[family-name:var(--font-geist-sans)] overflow-y-auto snap-y snap-mandatory h-screen">
      {/* Primeira seção - Nome do bebê */}
      <section className="h-screen w-full flex flex-col items-center justify-center snap-start bg-gradient-to-b from-pink-100 to-pink-200 dark:from-pink-900 dark:to-purple-900 p-8">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold text-center text-pink-600 dark:text-pink-300"
        >
          {babyName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xl mt-4 text-center text-pink-700 dark:text-pink-200"
        >
          Uma vida incrível está a caminho!
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 text-center"
        >
          <p className="text-sm text-pink-600 dark:text-pink-300">Deslize para cima para conhecer nosso bebê</p>
          <div className="animate-bounce mt-2">⬆️</div>
        </motion.div>
      </section>

      {/* Segunda seção - Ecografia */}
      <section className="h-screen w-full flex flex-col items-center justify-center snap-start bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-purple-900 p-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-8 text-blue-600 dark:text-blue-300"
        >
          Nossa primeira foto
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden shadow-xl"
        >
          <Image
            src="/images/ecografia1.jpg"
            alt="Ecografia do bebê"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </motion.div>
        <p className="mt-6 text-center text-blue-700 dark:text-blue-200">
          Nossa primeira visualização do bebê durante o ultrassom
        </p>
      </section>

      {/* Terceira seção - Batimento cardíaco */}
      <section className="h-screen w-full flex flex-col items-center justify-center snap-start bg-gradient-to-b from-purple-100 to-purple-200 dark:from-purple-900 dark:to-indigo-900 p-8 relative overflow-hidden">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-8 text-purple-600 dark:text-purple-300"
        >
          Ouça meu coração
        </motion.h2>

        {/* Coração flutuante delicado no fundo */}
        <div className="absolute top-20 left-10 floating-heart opacity-20">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-pink-400">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <div className="absolute top-32 right-16 floating-heart opacity-15" style={{ animationDelay: '1s' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="text-pink-300">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <div className="absolute bottom-32 left-20 floating-heart opacity-10" style={{ animationDelay: '2s' }}>
          <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center relative z-10"
        >
          {/* Botão principal com coração pulsante */}
          <div className="heart-waves">
            <button
              onClick={toggleHeartbeat}
              className={`w-48 h-48 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 dark:from-pink-500 dark:to-pink-700 flex items-center justify-center shadow-2xl hover:shadow-pink-300/50 transition-all transform hover:scale-105 active:scale-95 heart-glow relative cursor-pointer ${isPlaying ? 'heart-pulse' : 'heart-gentle'}`}
              type="button"
            >
              {/* Coração principal */}
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="white"
                className={`relative z-10 ${isPlaying ? 'heart-pulse' : 'heart-gentle'}`}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          <motion.p
            className="mt-8 text-center text-purple-700 dark:text-purple-200 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {audioError
              ? 'Ops! Não consegui carregar o áudio do coração 💔'
              : isPlaying
                ? 'Você está ouvindo meu coraçãozinho bater... 💕'
                : 'Toque no coração para escutar meus batimentos 💓'
            }
          </motion.p>

          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <p className="text-sm text-purple-600 dark:text-purple-300 italic">
              ♡ Tum tum... tum tum... ♡
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Quarta seção - Contagem regressiva */}
      <section className="h-screen w-full flex flex-col items-center justify-center snap-start bg-gradient-to-b from-green-100 to-green-200 dark:from-green-900 dark:to-teal-900 p-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-8 text-green-600 dark:text-green-300"
        >
          Estou chegando em
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-lg"
        >
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <span className="text-4xl font-bold text-green-600 dark:text-green-400">{timeLeft.days}</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Dias</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <span className="text-4xl font-bold text-green-600 dark:text-green-400">{timeLeft.hours}</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Horas</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <span className="text-4xl font-bold text-green-600 dark:text-green-400">{timeLeft.minutes}</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Minutos</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <span className="text-4xl font-bold text-green-600 dark:text-green-400">{timeLeft.seconds}</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">Segundos</span>
          </div>
        </motion.div>
        <p className="mt-8 text-center text-green-700 dark:text-green-200">
          Previsão de nascimento: {dueDate.toLocaleDateString('pt-BR')}
        </p>
      </section>
    </div>
  );
}
