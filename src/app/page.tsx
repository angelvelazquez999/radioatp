"use client";

import { useEffect, useRef, useState } from "react";
// @ts-expect-error - howler types are not installed in this project
import { Howl } from "howler";
import { motion } from "framer-motion";
import { Play, Pause, Radio, Volume2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const soundRef = useRef<Howl | null>(null);
  const [playing, setPlaying] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [timeUntilStream, setTimeUntilStream] = useState("");
  const [shouldReload, setShouldReload] = useState(false);

  const STREAM_HOUR = 23; // 11 PM (23:00)
  const STREAM_MINUTE = 30;

  const phrases = [
    "Wait for it...",
    "Suit up.",
    "One more song before reality.",
    "But sometimes… it does",
    "Some people are just songs in disguise.",
    "Stay weird. Stay soft.",
    "Love is mostly dumb luck.",
    "Nostalgia has an excellent music taste.",
    "Every city looks prettier when you miss someone.",
    "There’s always that one song.",
    "The night is young and emotionally unstable.",
    "There you are.",
    "That duck probably didnt understand anything.",
    "Because when you find someone you want to keep around, you do something about it.",
  ];

  // Verificar si es la hora de transmisión (11:20 PM hoy)
  const checkStreamTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Se habilita solo cuando llega a las 11:20 PM
    const isActive = currentHour === STREAM_HOUR && currentMinute >= STREAM_MINUTE;

    setIsStreamActive(isActive);

    // Si ya pasamos las 11:20 PM y aún no se habilita, marcar para recarga
    if (currentHour === STREAM_HOUR && currentMinute >= STREAM_MINUTE && !isActive) {
      setShouldReload(true);
    }

    if (!isActive) {
      // Calcular tiempo restante hasta las 11:20 PM
      const today = new Date();
      const streamTime = new Date();
      streamTime.setHours(STREAM_HOUR, STREAM_MINUTE, 0, 0);

      if (now >= streamTime) {
        // Ya pasó hoy, siguiente es mañana
        streamTime.setDate(streamTime.getDate() + 1);
      }

      const diffMs = streamTime.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeUntilStream(`${hours}h ${minutes}m`);
    }
  };

  const [visualizerBars] = useState<
    Array<{ heights: [string, string, string]; duration: number }>
  >(() =>
    [...Array(28)].map(() => ({
      heights: [
        `${15 + Math.random() * 15}%`,
        `${45 + Math.random() * 110}%`,
        `${15 + Math.random() * 15}%`,
      ],
      duration: 0.8 + Math.random() * 0.9,
    }))
  );

  useEffect(() => {
    // Precargar y configurar el archivo de audio
    soundRef.current = new Howl({
      src: ["/ATP.mp3"],
      html5: true,
      preload: true,
      format: ["mp3"],
      volume: 1,
      onload: () => {
        console.log("Audio cargado exitosamente");
      },
      onerror: () => {
        console.error("Error cargando audio");
      },
    });

    // Verificar hora inicial
    checkStreamTime();

    // Verificar cada minuto
    const interval = setInterval(() => {
      checkStreamTime();
    }, 60000);

    return () => {
      clearInterval(interval);
      soundRef.current?.unload();
    };
  }, []);

  // Cambiar frase cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [phrases.length]);

  const toggleRadio = () => {
    if (!isStreamActive) {
      return;
    }
    if (!soundRef.current) return;
    if (playing) {
      soundRef.current.pause();
      setPlaying(false);
    } else {
      soundRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#050810] text-white">

      {/* Fondo base */}
      <div className="absolute inset-0 bg-[#050810]" />

      {/* Aurora boreal sutil — glow superior */}
      <div className="absolute top-[-120px] left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-900/20 blur-3xl pointer-events-none" />
      <div className="absolute top-[-60px] left-1/2 h-[200px] w-[300px] -translate-x-1/2 rounded-full bg-violet-900/15 blur-2xl pointer-events-none" />

      {/* Neblina de horizonte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#090e24]/60 to-transparent pointer-events-none" />

      {/* ── Estrellas en CSS puro (sin JS, visibles en móvil desde el primer frame) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 12% 8%,  rgba(255,255,255,0.9) 0%, transparent 100%),
            radial-gradient(1px   1px   at 28% 15%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 45% 6%,  rgba(255,255,255,0.85) 0%, transparent 100%),
            radial-gradient(1px   1px   at 62% 18%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(2px   2px   at 78% 9%,  rgba(255,255,255,0.95) 0%, transparent 100%),
            radial-gradient(1px   1px   at 88% 22%, rgba(255,255,255,0.65) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 5%  30%, rgba(255,255,255,0.75) 0%, transparent 100%),
            radial-gradient(1px   1px   at 20% 42%, rgba(255,255,255,0.55) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 35% 28%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(1px   1px   at 52% 38%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(2px   2px   at 68% 25%, rgba(255,255,255,0.9) 0%, transparent 100%),
            radial-gradient(1px   1px   at 82% 35%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 92% 12%, rgba(255,255,255,0.85) 0%, transparent 100%),
            radial-gradient(1px   1px   at 15% 55%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 40% 48%, rgba(255,255,255,0.75) 0%, transparent 100%),
            radial-gradient(1px   1px   at 72% 52%, rgba(255,255,255,0.6) 0%, transparent 100%), 
            radial-gradient(2px   2px   at 95% 40%, rgba(255,255,255,0.88) 0%, transparent 100%),
            radial-gradient(1px   1px   at 8%  68%, rgba(255,255,255,0.55) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 55% 62%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(1px   1px   at 85% 58%, rgba(255,255,255,0.65) 0%, transparent 100%),
            radial-gradient(1px   1px   at 18% 72%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 32% 78%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px   1px   at 48% 70%, rgba(255,255,255,0.55) 0%, transparent 100%),
            radial-gradient(2px   2px   at 63% 80%, rgba(255,255,255,0.85) 0%, transparent 100%),
            radial-gradient(1px   1px   at 77% 74%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 90% 68%, rgba(255,255,255,0.75) 0%, transparent 100%),
            radial-gradient(1px   1px   at 3%  82%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(2px   2px   at 25% 88%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(1px   1px   at 58% 85%, rgba(255,255,255,0.65) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 70% 90%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px   1px   at 10% 20%, rgba(180,200,255,0.6) 0%, transparent 100%),
            radial-gradient(1px   1px   at 75% 30%, rgba(200,180,255,0.55) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 50% 14%, rgba(180,220,255,0.7) 0%, transparent 100%),
            radial-gradient(1px   1px   at 93% 75%, rgba(255,255,255,0.6) 0%, transparent 100%)
          `,
        }}
      />

      {/* Luna */}
      <div className="absolute top-12 right-12 pointer-events-none">
        <div
          className="relative w-9 h-9 rounded-full bg-[#e8e4d4]"
          style={{ boxShadow: "0 0 18px 4px rgba(230,220,180,0.18), 0 0 40px 8px rgba(200,190,140,0.09)" }}
        >
          {/* Sombra del crescent */}
          <div className="absolute top-[3px] right-[1px] w-6 h-[22px] rounded-full bg-[#050810]" />
        </div>
      </div>

      {/* ── Contenido principal ── */}
      <div className="relative z-10 flex w-full min-h-screen flex-col items-center justify-center px-6 gap-0">

        {/* Badge LIVE */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`mb-7 flex items-center gap-2 rounded-full border px-4 py-2 ${
            isStreamActive
              ? "border-purple-500/35 bg-purple-500/10"
              : "border-orange-500/35 bg-orange-500/10"
          }`}
        >
          <div className={`h-2 w-2 rounded-full ${isStreamActive ? "bg-purple-400" : "bg-orange-400"}`} />
          <span className={`text-[11px] tracking-[0.3em] ${isStreamActive ? "text-purple-300" : "text-orange-300"}`}>
            {isStreamActive ? "LIVE TRANSMISSION" : `EN VIVO A LAS 11:30 PM`}
          </span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-7 flex flex-col items-center"
        >
          {/* <div className="mb-4 rounded-full border border-blue-400/20 bg-blue-400/9 p-5">
            <Radio className="h-12 w-12 text-blue-300" />
          </div> */}

          <div className="mb-4 relative w-48 h-48">
            <Image
              src="/her.png"
              alt="Radio ATP"
              fill
              className="object-contain"
              loading="lazy"
            />
          </div>

          <h1 className="text-center text-5xl font-black tracking-[0.22em] text-white">
            RADIO ATP
          </h1>

          <motion.p
            key={phraseIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.5 }}
            className="mt-3 text-center text-[11px] tracking-[0.5em] text-zinc-400/70"
          >
            {phrases[phraseIndex]}
          </motion.p>
        </motion.div>

        {/* Visualizer */}
        <div className="mb-9 flex h-14 items-end gap-[3px]">
          {visualizerBars.map((bar, i) => (
            <motion.div
              key={i}
              animate={{ height: bar.heights }}
              transition={{
                duration: bar.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-[5px] rounded-full bg-blue-400/65"
            />
          ))}
        </div>

        {/* Botón Play */}
        <motion.button
          whileTap={{ scale: isStreamActive ? 0.93 : 1 }}
          whileHover={{ scale: isStreamActive ? 1.05 : 1 }}
          onClick={toggleRadio}
          disabled={!isStreamActive}
          className={`relative flex h-24 w-24 items-center justify-center rounded-full backdrop-blur-xl mb-5 transition ${
            isStreamActive
              ? "border border-blue-300/25 bg-blue-300/9 cursor-pointer"
              : "border border-zinc-600/25 bg-zinc-600/9 cursor-not-allowed opacity-50"
          }`}
        >
          {/* Anillo exterior decorativo */}
          <div className={`absolute inset-[-10px] rounded-full ${isStreamActive ? "border border-blue-400/10" : "border border-zinc-600/10"}`} />

          {!isStreamActive ? (
            <span className="relative z-10 text-xs text-zinc-400 text-center px-4">NOT YET</span>
          ) : playing ? (
            <Pause className="relative z-10 h-9 w-9 text-blue-200" />
          ) : (
            <Play className="relative z-10 ml-1 h-9 w-9 text-blue-200" />
          )}
        </motion.button>

        {/* Estado */}
        <motion.p
          key={playing ? "playing" : isStreamActive ? "paused" : "offline"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-[11px] tracking-[0.4em] mb-10 transition-colors duration-500 ${
            !isStreamActive
              ? "text-orange-400/70"
              : playing
              ? "text-blue-300/70"
              : "text-zinc-500"
          }`}
        >
          {shouldReload ? (
            <span className="text-red-400/70">Recarga la página / Reload page</span>
          ) : !isStreamActive ? (
            `DISPONIBLE EN ${timeUntilStream}`
          ) : playing ? (
            "NOW TRANSMITTING"
          ) : (
            "DALE PLAY"
          )}
        </motion.p>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] tracking-[0.25em] text-zinc-600">
          <Volume2 className="h-3.5 w-3.5 flex-shrink-0" />
          <span>radioatp.angelvelazquez.software</span>
        </div>
      </div>
    </main>
  );
}