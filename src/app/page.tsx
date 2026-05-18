"use client";

import { useEffect, useRef, useState } from "react";
// @ts-ignore - howler types are not installed in this project
import { Howl } from "howler";
import { motion } from "framer-motion";
import { Play, Pause, Radio, Volume2 } from "lucide-react";

export default function Home() {
  const soundRef = useRef<Howl | null>(null);

  const [playing, setPlaying] = useState(false);
  const [stars, setStars] = useState<Array<{ top: string; left: string }>>([]);
  const [visualizerBars, setVisualizerBars] = useState<Array<{ heights: [string, string, string]; duration: number }>>([]);

  useEffect(() => {
    // Generate stars positions once on client
    setStars(
      [...Array(120)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }))
    );

    // Generate visualizer bars once on client
    setVisualizerBars(
      [...Array(32)].map(() => ({
        heights: [
          `${20 + Math.random() * 20}%`,
          `${40 + Math.random() * 100}%`,
          `${20 + Math.random() * 20}%`,
        ],
        duration: 1 + Math.random(),
      }))
    );

    soundRef.current = new Howl({
      src: [
        "https://radioatp.angelvelazquez.software/live/radioatp.mp3",
      ],
      html5: true,
      format: ["mp3"],
      volume: 1,
    });

    return () => {
      soundRef.current?.unload();
    };
  }, []);

  const toggleRadio = () => {
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
    <main className="relative flex min-h-screen overflow-hidden bg-black text-white">
      {/* Fondo gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-black to-[#02040f]" />

      {/* Glow */}
      <div className="absolute top-[-200px] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Estrellas */}
      <div className="absolute inset-0 opacity-40">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
            }}
          />
        ))}
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-6">
        {/* Badge LIVE */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="mb-8 flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2"
        >
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-sm tracking-[0.3em] text-red-300">
            LIVE TRANSMISSION
          </span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-10 flex flex-col items-center"
        >
          <div className="mb-5 rounded-full border border-cyan-400/20 bg-cyan-400/10 p-6">
            <Radio className="h-16 w-16 text-cyan-300" />
          </div>

          <h1 className="text-center text-6xl font-black tracking-[0.2em] text-white">
            RADIO ATP
          </h1>

          <p className="mt-4 text-center text-sm tracking-[0.5em] text-zinc-400">
            SIGNALS FROM THE NIGHT
          </p>
        </motion.div>

        {/* Visualizer fake */}
        <div className="mb-14 flex h-20 items-end gap-2">
          {visualizerBars.map((bar, i) => (
            <motion.div
              key={i}
              animate={{
                height: bar.heights,
              }}
              transition={{
                duration: bar.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 rounded-full bg-cyan-300/70"
            />
          ))}
        </div>

        {/* Botón Play */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleRadio}
          className="group relative flex h-28 w-28 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 backdrop-blur-xl transition"
        >
          <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-2xl transition group-hover:bg-cyan-400/20" />

          {playing ? (
            <Pause className="relative z-10 h-10 w-10 text-cyan-200" />
          ) : (
            <Play className="relative z-10 ml-1 h-10 w-10 text-cyan-200" />
          )}
        </motion.button>

        {/* Estado */}
        <motion.p
          key={playing ? "playing" : "paused"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-sm tracking-[0.4em] text-zinc-400"
        >
          {playing ? "NOW TRANSMITTING" : "OFF AIR"}
        </motion.p>

        {/* Footer */}
        <div className="absolute bottom-8 flex items-center gap-2 text-xs tracking-[0.3em] text-zinc-600">
          <Volume2 className="h-4 w-4" />
          <span>radioatp.angelvelazquez.software</span>
        </div>
      </div>
    </main>
  );
}