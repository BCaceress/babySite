"use client";

import Image from "next/image";
import { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

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
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };
  
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
      <section className="h-screen w-full flex flex-col items-center justify-center snap-start bg-gradient-to-b from-purple-100 to-purple-200 dark:from-purple-900 dark:to-indigo-900 p-8">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold mb-8 text-purple-600 dark:text-purple-300"
        >
          Ouça meu coração
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <button 
            onClick={toggleHeartbeat}
            className="w-40 h-40 rounded-full bg-pink-500 flex items-center justify-center shadow-lg hover:bg-pink-600 transition-all transform hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-20 h-20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <audio ref={audioRef} src="/sound/batimento.mp3" loop />
          <p className="mt-6 text-center text-purple-700 dark:text-purple-200">
            Toque para ouvir meu batimento cardíaco
          </p>
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
