"use client";

/*
  ================================================
  🍼 BABY WEBSITE - CONFIGURAÇÃO FÁCIL 🍼
  ================================================
  
  Para trocar entre LÍVIA e NOAH, altere apenas estas 3 linhas:
  
  Linha ~12: babyName = "Lívia" ou "Noah"
  Linha ~13: babyGender = "girl" ou "boy"  
  Linha ~14: dueDate = new Date("January 14, 2026")
  
  🎨 TEMAS AUTOMÁTICOS:
  - "girl" = Rosa/Pink (tons femininos)
  - "boy" = Azul/Blue (tons masculinos)
  
  ✨ O design se adapta automaticamente!
  ================================================
*/

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  // ====== CONFIGURAÇÕES DO BEBÊ - ALTERE AQUI ======
  const babyName = "Noah"; // Altere para "Lívia" ou "Noah"
  const babyGender = "boy" as "girl" | "boy"; // "girl" para menina ou "boy" para menino
  const dueDate = useMemo(() => new Date("January 14, 2026"), []); // Data estimada de nascimento

  // Configurações de tema baseadas no gênero
  const themeConfig = useMemo(() => {
    if (babyGender === "girl") {
      return {
        colors: {
          primary: "pink-600",
          primaryDark: "pink-300",
          secondary: "pink-700",
          secondaryDark: "pink-200",
          gradient: "from-pink-100 to-pink-200",
          gradientDark: "from-pink-500 to-pink-300",
          accent: "pink-800",
          accentDark: "pink-100"
        },
        message: "Uma princesinha está a caminho! 👑",
        emoji: "🩷"
      };
    } else {
      return {
        colors: {
          primary: "blue-600",
          primaryDark: "blue-300",
          secondary: "blue-700",
          secondaryDark: "blue-200",
          gradient: "from-blue-100 to-blue-200",
          gradientDark: "from-blue-900 to-indigo-900",
          accent: "blue-800",
          accentDark: "blue-100"
        },
        message: "Um pequeno príncipe está a caminho! 🤴",
        emoji: "💙"
      };
    }
  }, [babyGender]);

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

  // Estado para controlar os corações flutuantes
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number, x: number, y: number, emoji: string }>>([]);

  // Função para criar corações flutuantes
  const createFloatingHearts = (clickX: number, clickY: number) => {
    const heartEmojis = babyGender === 'girl'
      ? ['💕', '💖', '🩰', '🧸', '👧🏼', '💘', '🌸', '🎀', '🥰']
      : ['💙', '🍼', '🤍', '⚽', '🦖', '⭐', '🤴', '👶', '🚗'];

    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i + Math.random() * 1000,
      x: clickX + (Math.random() - 0.5) * 450, // Maior espalhamento
      y: clickY + (Math.random() - 0.5) * 100, // Pequena variação vertical
      emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)]
    }));

    setFloatingHearts(prev => [...prev, ...newHearts]);

    // Remove os corações após a animação
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => !newHearts.find(newHeart => newHeart.id === heart.id)));
    }, 4000);
  };

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
      <section className={`h-screen w-full flex flex-col items-center justify-center snap-start bg-gradient-to-b ${themeConfig.colors.gradient} dark:${themeConfig.colors.gradientDark} p-8 relative`}>
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className={`text-6xl font-bold text-center text-${themeConfig.colors.primary} dark:text-${themeConfig.colors.primaryDark}`}
          >
            {babyName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className={`text-xl mt-4 text-center text-${themeConfig.colors.secondary} dark:text-${themeConfig.colors.secondaryDark}`}
          >
            {themeConfig.message}
          </motion.p>

          {/* Badge com emoji temático - Interativo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-3 bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm rounded-full border border-white/40 dark:border-gray-300/20 cursor-pointer hover:bg-white/30 dark:hover:bg-gray-800/40 transition-all duration-300 group"
            onClick={(e) => {
              // Pega as coordenadas do clique
              const clickX = e.clientX;
              const clickY = e.clientY;

              // Cria corações flutuantes
              createFloatingHearts(clickX, clickY);

              // Efeito de bounce no clique
              const element = document.querySelector('.heart-emoji') as HTMLElement;
              if (element) {
                element.classList.add('heart-bounce');
                setTimeout(() => {
                  element.classList.remove('heart-bounce');
                }, 600);
              }

              // Adiciona efeito de ripple
              const ripple = document.createElement('div');
              ripple.className = 'absolute inset-0 rounded-full bg-white/30 animate-ping';
              const parent = element?.parentElement;
              if (parent) {
                parent.appendChild(ripple);
                setTimeout(() => {
                  ripple.remove();
                }, 600);
              }
            }}
          >
            <motion.span
              className="text-2xl heart-emoji inline-block relative"
              whileHover={{
                rotate: [0, -5, 5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.4 }}
              animate={{
                y: [0, -2, 0]
              }}
              style={{
                animationDuration: '3s',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out'
              }}
            >
              {themeConfig.emoji}
            </motion.span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 2,
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="mb-6 text-center w-full"
        >
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              className="group cursor-pointer"
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className={`flex items-center space-x-3 px-8 py-4 bg-white/25 dark:bg-gray-800/40 backdrop-blur-md rounded-full border border-white/30 dark:border-${themeConfig.colors.primary}-300/25 shadow-xl hover:shadow-${themeConfig.colors.primary}-200/30 dark:hover:shadow-${themeConfig.colors.primary}-400/20 transition-all duration-500`}>
                <span className={`text-[10px] font-medium text-${themeConfig.colors.accent} dark:text-${themeConfig.colors.accentDark} tracking-wide`}>
                  Arraste para cima para conhecer nosso bebê
                </span>
                <motion.div
                  className={`w-6 h-6 rounded-full bg-gradient-to-br from-${themeConfig.colors.primary}-400/30 to-${themeConfig.colors.primary}-600/30 dark:from-${themeConfig.colors.primary}-300/30 dark:to-${themeConfig.colors.primary}-500/30 flex items-center justify-center`}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                >
                  <motion.svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-${themeConfig.colors.secondary} dark:text-${themeConfig.colors.secondaryDark}`}
                    animate={{
                      y: [-1, 1, -1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <path d="m18 15-6-6-6 6" />
                  </motion.svg>
                </motion.div>
              </div>
            </motion.div>

            {/* Indicador visual melhorado */}
            <div className="flex flex-col items-center space-y-2">
              <motion.div
                className={`w-0.5 h-6 bg-gradient-to-b from-${themeConfig.colors.primary}-400/80 to-transparent rounded-full`}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scaleY: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className={`w-1.5 h-1.5 rounded-full bg-${themeConfig.colors.primary}-400/60`}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </div>
          </div>
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
          <div className={`heart-waves ${isPlaying ? 'heart-waves-active' : ''}`}>
            <motion.button
              onClick={toggleHeartbeat}
              className={`w-48 h-48 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 dark:from-pink-500 dark:to-pink-700 flex items-center justify-center shadow-2xl hover:shadow-pink-300/50 transition-all transform hover:scale-105 active:scale-95 heart-glow relative cursor-pointer ${isPlaying ? 'heart-beating' : 'heart-gentle'}`}
              type="button"
              animate={isPlaying ? {
                boxShadow: [
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(236, 72, 153, 0.3)",
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 60px rgba(236, 72, 153, 0.7)",
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(236, 72, 153, 0.3)"
                ]
              } : {}}
              transition={isPlaying ? {
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
            >
              {/* Coração principal */}
              <motion.svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="white"
                className="relative z-10"
                animate={isPlaying ? {
                  scale: [1, 1.15, 1, 1.08, 1],
                } : {
                  scale: [1, 1.02, 1]
                }}
                transition={isPlaying ? {
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.14, 0.28, 0.42, 1]
                } : {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </motion.svg>

              {/* Efeito de brilho interno pulsante */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-4 rounded-full bg-gradient-to-br from-white/20 to-transparent"
                  animate={{
                    opacity: [0.2, 0.6, 0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.14, 0.28, 0.42, 1]
                  }}
                />
              )}
            </motion.button>
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

      {/* Corações flutuantes */}
      {floatingHearts.length > 0 && (
        <div className="floating-hearts">
          {floatingHearts.map((heart) => (
            <div
              key={heart.id}
              className="floating-heart-particle"
              style={{
                left: heart.x - 10, // Centraliza o emoji
                top: heart.y - 10, // Posição inicial do clique
              }}
            >
              {heart.emoji}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
