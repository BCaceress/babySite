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
  const babyGender = "boy" as "girl" | "boy" | "reveal"; // "girl" para menina, "boy" para menino ou "reveal" para chá revelação
  const dueDate = useMemo(() => new Date("January 14, 2026"), []); // Data estimada de nascimento

  // Calcula o número de dias desde uma data de referência (dia 82 = 30 de junho de 2025)
  const dayCounter = useMemo(() => {
    const referenceDate = new Date("June 30, 2025"); // Data de referência quando era "dia 82"
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - referenceDate.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    return 82 + dayDiff; // Adiciona a diferença em dias ao valor inicial (82)
  }, []);

  // Configurações de tema baseadas no gênero
  const themeConfig = useMemo(() => {
    if (babyGender === "reveal") {
      return {
        colors: {
          primary: "pink-500",
          primaryDark: "pink-300",
          secondary: "sky-600",
          secondaryDark: "sky-300",
          gradient: "from-pink-400 to-sky-400",
          gradientDark: "from-pink-600 to-sky-600",
          accent: "purple-500",
          accentDark: "purple-200"
        },
        message: "Chá revelação! 💖💙",
        emoji: "🎉"
      };
    }
    if (babyGender === "girl") {
      return {
        colors: {
          primary: "pink-600",
          primaryDark: "pink-300",
          secondary: "pink-700",
          secondaryDark: "pink-200",
          gradient: "from-pink-400 to-pink-600",
          gradientDark: "from-pink-700 to-pink-500",
          accent: "pink-800",
          accentDark: "pink-100"
        },
        message: "Uma princesinha está a caminho! 👑",
        emoji: "🩷"
      };
    } else if (babyGender === "boy") {
      return {
        colors: {
          primary: "sky-600",
          primaryDark: "sky-300",
          secondary: "sky-700",
          secondaryDark: "sky-200",
          gradient: "from-sky-400 to-sky-600",
          gradientDark: "from-sky-800 to-sky-700",
          accent: "sky-800",
          accentDark: "sky-100"
        },
        message: "Um pequeno príncipe está a caminho! 🤴",
        emoji: "💙"
      };
    } else {
      return {
        colors: {
          primary: "purple-600",
          primaryDark: "purple-300",
          secondary: "purple-700",
          secondaryDark: "purple-200",
          gradient: "from-purple-400 to-purple-600",
          gradientDark: "from-purple-700 to-purple-500",
          accent: "purple-800",
          accentDark: "purple-100"
        },
        message: "Surpresa! O bebê é uma caixinha de mistério! 🎁",
        emoji: "🟣"
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

  // Estados para o efeito de raspadinha na ecografia
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Estado para controlar o vídeo
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Função para controlar play/pause do vídeo
  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play()
        .then(() => setIsVideoPlaying(true))
        .catch(() => setIsVideoPlaying(false));
    } else {
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  // Função para criar corações flutuantes
  const createFloatingHearts = (clickX: number, clickY: number) => {
    const heartEmojis = babyGender === 'girl'
      ? ['💕', '💖', '🩰', '🧸', '👧🏼', '💘', '🌸', '🎀', '🥰', '👗']
      : ['💙', '🍼', '🤍', '⚽', '🦖', '⭐', '🤴', '👶', '🚗', '🚀', '❤️'];

    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i + Math.random() * 1000,
      x: clickX + (Math.random() - 0.5) * 460, // Maior espalhamento
      y: clickY + (Math.random() - 0.5) * 100, // Pequena variação vertical
      emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)]
    }));

    setFloatingHearts(prev => [...prev, ...newHearts]);

    // Remove os corações após a animação
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => !newHearts.find(newHeart => newHeart.id === heart.id)));
    }, 4000);
  };

  // Funções para o efeito de raspadinha
  const initializeScratchCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Preenche o canvas com uma camada prateada/cinza que simula a raspadinha
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#c0c0c0');
    gradient.addColorStop(0.5, '#e6e6e6');
    gradient.addColorStop(1, '#a8a8a8');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Adiciona um padrão de textura
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    // Adiciona texto de instrução mais visível com melhor contraste
    const fontSize = Math.max(18, canvas.width * 0.05);
    const smallFontSize = Math.max(14, canvas.width * 0.04);

    // Sombra do texto para melhor legibilidade
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('👆 Raspe aqui para revelar', canvas.width / 2 + 2, canvas.height / 2 - 6);

    // Texto principal em branco
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.font = `bold ${fontSize}px Arial`;


    // Sombra do subtexto
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.font = `${smallFontSize}px Arial`;
    ctx.fillText('Minha primeira foto!', canvas.width / 2 + 1, canvas.height / 2 + 17);

    // Subtexto em branco
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = `${smallFontSize}px Arial`;

  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Converte coordenadas da tela para coordenadas do canvas
    const canvasX = ((x - rect.left) / rect.width) * canvas.width;
    const canvasY = ((y - rect.top) / rect.height) * canvas.height;

    // Configuração do "arranhão" - área maior e mais suave
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();

    // Área de raspagem maior para facilitar alcançar 100%
    const brushSize = Math.min(canvas.width, canvas.height) * 0.12; // 12% do menor lado
    ctx.arc(canvasX, canvasY, brushSize, 0, 2 * Math.PI);
    ctx.fill();

    // Adiciona efeito de borda suave para transição mais natural
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, brushSize * 0.7, 0, 2 * Math.PI);
    ctx.fill();

    // Adiciona pontos extras ao redor para facilitar a raspagem
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const offsetX = Math.cos(angle) * brushSize * 0.3;
      const offsetY = Math.sin(angle) * brushSize * 0.3;

      ctx.beginPath();
      ctx.arc(canvasX + offsetX, canvasY + offsetY, brushSize * 0.4, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Calcula o progresso de forma mais precisa
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    const totalPixels = canvas.width * canvas.height;

    // Conta apenas pixels totalmente transparentes
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const progress = Math.min(100, (transparentPixels / totalPixels) * 100);
    setScratchProgress(progress);

    // Remove a camada quando 80% for raspado (mais realista para 100%)
    if (progress > 80) {
      // Animação suave de remoção
      canvas.style.transition = 'opacity 0.5s ease-out';
      canvas.style.opacity = '0';

      // Define progresso como 100% quando remove completamente
      setTimeout(() => {
        canvas.style.display = 'none';
        setScratchProgress(100);
      }, 500);
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsScratching(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    scratch(clientX, clientY);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching) return;
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Adiciona múltiplos pontos de raspagem para movimento mais suave
    scratch(clientX, clientY);

    // Adiciona pontos intermediários para movimentos rápidos
    if ('touches' in e && e.touches[0]) {
      setTimeout(() => {
        scratch(clientX + 5, clientY + 5);
        scratch(clientX - 5, clientY - 5);
      }, 10);
    }
  };

  const handleEnd = () => {
    setIsScratching(false);
  };

  // Inicializa o canvas quando o componente é montado
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeScratchCanvas();
    }, 100);

    const handleResize = () => {
      setTimeout(initializeScratchCanvas, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      <section className={`h-screen w-full flex flex-col items-center justify-center snap-start ${babyGender === 'reveal' ? `bg-gradient-to-br ${themeConfig.colors.gradient} dark:bg-gradient-to-br dark:${themeConfig.colors.gradientDark}` : `bg-${themeConfig.colors.primary} dark:bg-${themeConfig.colors.primaryDark}`} p-8 relative`}>
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-7xl font-extrabold text-white drop-shadow-lg text-center"
          >
            {babyName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-lg mt-4 text-center text-white/90 max-w-md leading-relaxed"
          >
            {themeConfig.message}
          </motion.p>

          {/* Contador de dias - realocado da seção final */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="mt-6 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              <motion.div
                className="w-5 h-5 text-base"
                animate={{
                  y: [0, -3, 0],
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                👶🏻
              </motion.div>
              <p className="text-center text-white text-sm font-medium">
                Estou completando <span className="font-extrabold">{dayCounter} dias</span> hoje!
              </p>
            </div>
          </motion.div>



          {/* Badge com emoji temático - Interativo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-25 px-6 py-3 bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm rounded-full border border-white/40 dark:border-gray-300/20 cursor-pointer hover:bg-white/30 dark:hover:bg-gray-800/40 transition-all duration-300 group"
            onClick={(e: React.MouseEvent) => {
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
      </section>        {/* Segunda seção - Ecografia com efeito de raspadinha */}
      <section className="h-screen w-full flex flex-col items-center justify-center snap-start bg-gradient-to-br from-pink-400 to-sky-400 dark:bg-gradient-to-br dark:from-pink-600 dark:to-sky-600 p-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className={`text-4xl font-bold mb-4 text-${themeConfig.colors.secondary} dark:text-${themeConfig.colors.secondaryDark} text-center`}
        >
          Minha primeira foto
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`text-center text-${themeConfig.colors.secondaryDark} dark:text-${themeConfig.colors.accentDark} mb-8 px-4`}
        >
          Raspe a tela para revelar minha primeira pose na barriga da mamãe! {themeConfig.emoji}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-sm mx-auto"
        >
          <div
            ref={containerRef}
            className={`scratch-container relative aspect-square rounded-2xl overflow-hidden bg-white/10 backdrop-blur-lg border-4 border-${themeConfig.colors.primary}-300/30 dark:border-${themeConfig.colors.primaryDark}-300/30 shadow-2xl ${isScratching ? 'scratching' : ''}`}
            style={{ touchAction: 'none' }}
          >
            <div className="absolute inset-0 z-10">
              <Image
                src="/images/ecografia1.jpg"
                alt="Ecografia do bebê"
                fill
                style={{ objectFit: 'cover' }}
                priority
                className="rounded-xl"
              />
            </div>

            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/10 to-transparent rounded-xl" />

            <canvas
              ref={canvasRef}
              className="scratch-canvas absolute inset-0 z-30 rounded-xl transition-opacity duration-300"
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
              style={{ touchAction: 'none' }}
            />

            {scratchProgress > 80 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 pointer-events-none"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        {scratchProgress >= 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mt-6 px-6 py-3 bg-white/20 dark:bg-purple-800/30 backdrop-blur-sm rounded-full border border-white/40 dark:border-purple-300/20"
          >
            <p className="text-center text-purple-700 dark:text-purple-200 font-medium">
              Tcharam! Essa é a minha primeira fotinho direto do forninho! 💙
            </p>
          </motion.div>
        )}
      </section>

      {/* Nova seção - Vídeo da ecografia */}
      <section className="h-screen w-full flex flex-col items-center justify-center snap-start bg-gradient-to-br from-pink-400 to-sky-400 dark:bg-gradient-to-br dark:from-pink-600 dark:to-sky-600 p-8 relative overflow-hidden">
        {/* Elementos decorativos flutuantes - substituídos por ícones de bebê/vídeo */}
        <div className="absolute top-20 left-10 floating-baby opacity-15 pointer-events-none">
          <span className="text-4xl">🍼</span>
        </div>
        <div className="absolute top-32 right-16 floating-baby opacity-10 pointer-events-none" style={{ animationDelay: '1s' }}>
          <span className="text-3xl">👶</span>
        </div>
        <div className="absolute bottom-32 left-20 floating-baby opacity-10 pointer-events-none" style={{ animationDelay: '2s' }}>
          <span className="text-4xl">📹</span>
        </div>

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className={`text-4xl font-bold mb-6 text-white dark:text-white text-center drop-shadow-lg`}
        >
          Veja como me mexo!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`text-center text-white/80 dark:text-sky-100 mb-10 px-4 text-lg`}
        >
          Aqui você pode me ver mexendo dentro da barriga da mamãe! {themeConfig.emoji}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-xl mx-auto flex flex-col items-center"
        >
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-white/20 dark:bg-gray-900/40 border-4 border-white/40 dark:border-sky-400/20 shadow-2xl flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-2xl shadow-xl"
              preload="metadata"
              poster="/images/ecografia1.jpg"
              style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(14,165,233,0.08) 100%)' }}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              onEnded={() => setIsVideoPlaying(false)}
              controlsList="nofullscreen nodownload"
              disablePictureInPicture
              disableRemotePlayback
              playsInline
            >
              <source src="/video/eco.mp4" type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
            
            {/* Botão de Play/Pause personalizado */}
            <div 
              className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300 ${isVideoPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100 bg-black/30'}`}
              onClick={toggleVideo}
            >
              {!isVideoPlaying && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/40"
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.div>
              )}
            </div>
            
            {/* Controles personalizados simples */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 flex justify-center items-center transition-opacity ${isVideoPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
              <button
                onClick={toggleVideo}
                className="px-4 py-1 bg-white/30 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/40 transition-colors text-white text-sm font-medium"
              >
                {isVideoPlaying ? 'Pausar' : 'Reproduzir'}
              </button>
            </div>
            
            {/* Overlay com brilho sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl pointer-events-none" />
            
            {/* Efeito de brilho ao passar o mouse */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
              whileHover={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </section>

      {/* Quarta seção - Batimento cardíaco */}
      <section className="h-screen w-full flex flex-col items-center justify-center snap-start bg-gradient-to-br from-pink-400 to-sky-400 dark:bg-gradient-to-br dark:from-pink-600 dark:to-sky-600 p-8 mb-25 relative overflow-hidden">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-14 text-white dark:text-white"
        >
          Ouça meu coração
        </motion.h2>

        {/* Coração flutuante delicado no fundo */}
        <div className="absolute top-20 left-10 floating-heart opacity-20">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-pink-100">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <div className="absolute top-32 right-16 floating-heart opacity-15" style={{ animationDelay: '1s' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="text-pink-100">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <div className="absolute bottom-32 left-20 floating-heart opacity-10" style={{ animationDelay: '2s' }}>
          <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor" className="text-pink-100">
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

      {/* Quinta seção - Contagem regressiva */}
      <section className="h-screen w-full flex flex-col items-center justify-center snap-start bg-gradient-to-br from-pink-400 to-sky-400 dark:bg-gradient-to-br dark:from-pink-600 dark:to-sky-600 p-8 relative overflow-hidden">
        {/* Partículas animadas flutuantes */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute opacity-20 backdrop-blur-3xl"
              initial={{
                x: Math.random() * 100 - 50 + "%",
                y: Math.random() * 100 - 50 + "%",
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                x: [
                  Math.random() * 100 - 50 + "%",
                  Math.random() * 100 - 50 + "%",
                  Math.random() * 100 - 50 + "%",
                ],
                y: [
                  Math.random() * 100 - 50 + "%",
                  Math.random() * 100 - 50 + "%",
                  Math.random() * 100 - 50 + "%",
                ],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 15 + Math.random() * 15,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                width: 100 + Math.random() * 100,
                height: 100 + Math.random() * 100,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${i % 2 === 0 ? "rgba(244, 114, 182, 0.15)" : "rgba(125, 211, 252, 0.15)"
                  } 0%, transparent 70%)`,
              }}
            />
          ))}
        </div>

        {/* Elementos decorativos temáticos */}
        <motion.div
          className="absolute top-16 right-20 w-12 h-12 opacity-30"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {/* Relógio moderno */}
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <motion.path
              d="M12 6v6l4 2"
              animate={{
                pathLength: [0, 1],
                opacity: [0.6, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-24 left-16 w-14 h-14 opacity-20"
          animate={{
            y: [0, -12, 0],
            scale: [1, 1.05, 1],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        >
          {/* Calendário estilizado */}
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <motion.line
              x1="3"
              y1="10"
              x2="21"
              y2="10"
              animate={{
                pathLength: [0, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
            <motion.path
              d="M9 15h2m2 0h2m-6 3h2m2 0h2"
              strokeDasharray="0.9 2"
              animate={{
                pathLength: [0, 1],
                opacity: [0.5, 1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 2
              }}
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-24 w-16 h-16 opacity-25"
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 3, 0],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 7,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 2,
          }}
        >
          {/* Símbolo de bebê */}
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2">
            <circle cx="12" cy="6" r="3.5" />
            <path d="M8 14l-1 8h10l-1-8" />
            <path d="M8 14c0-2.2 1.8-4 4-4s4 1.8 4 4" />
            <motion.path
              d="M6 18h12"
              animate={{
                pathLength: [0, 1],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-5xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-100 dark:from-white dark:to-sky-200"
        >
          Estou chegando em
        </motion.h2>

        {/* Container do countdown principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-lg"
        >
          {/* Brilho de fundo para o contador */}
          <div className="absolute -inset-6 bg-gradient-to-r from-pink-500/20 to-sky-500/20 rounded-3xl blur-xl">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-sky-500/10 rounded-3xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <motion.div
            animate={{
              boxShadow: [
                "0 15px 30px -5px rgba(236, 72, 153, 0.2), 0 8px 10px -6px rgba(14, 165, 233, 0.1)",
                "0 15px 30px -5px rgba(14, 165, 233, 0.2), 0 8px 10px -6px rgba(236, 72, 153, 0.1)",
                "0 15px 30px -5px rgba(236, 72, 153, 0.2), 0 8px 10px -6px rgba(14, 165, 233, 0.1)",
              ]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 dark:border-sky-500/10"
          >
            {/* Componentes de contagem animados */}
            {[
              { value: timeLeft.days, label: "Dias", delay: 0 },
              { value: timeLeft.hours, label: "Horas", delay: 0.2 },
              { value: timeLeft.minutes, label: "Minutos", delay: 0.4 },
              { value: timeLeft.seconds, label: "Segundos", delay: 0.6 },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  backgroundColor: "rgba(255, 255, 255, 0.95)"
                }}
                transition={{ type: "spring", stiffness: 400 }}
                className="flex flex-col items-center p-4 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/90 dark:to-gray-900/80 rounded-xl shadow-lg border border-white/50 dark:border-sky-500/10 backdrop-blur-sm"
              >
                <div className="relative w-full">
                  <motion.div
                    animate={{
                      scale: [1, 1.06, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: item.delay,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative z-10 text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-sky-500 dark:from-pink-400 dark:to-sky-400 text-center"
                  >
                    {item.value}
                  </motion.div>

                  {/* Reflexo sutil */}
                  <div className="absolute top-[55%] left-0 w-full h-[45%] bg-gradient-to-b from-transparent to-white/10 dark:to-white/5 -scale-y-100 blur-[1px] opacity-50 rounded-xl"></div>
                </div>
                <span className="mt-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 bg-clip-text">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Detalhes de data de nascimento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="relative z-10 mt-8 px-8 py-4 bg-white/30 dark:bg-gray-900/40 backdrop-blur-md rounded-full border border-white/40 dark:border-sky-500/20 shadow-lg"
        >
          {/* Efeito de brilho dinâmico */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/10 via-transparent to-sky-500/10"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              backgroundSize: "200% 100%",
            }}
          />

          <div className="flex items-center justify-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-6 text-lg"
            >
              🗓️
            </motion.div>
            <p className="text-center font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-sky-600 dark:from-pink-300 dark:to-sky-300">
              Vou nascer em: <span className="font-extrabold tracking-wide">{dueDate.toLocaleDateString('pt-BR')}</span>
            </p>
          </div>
        </motion.div>
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
