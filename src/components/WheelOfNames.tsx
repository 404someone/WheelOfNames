import React, { useRef, useState, useEffect } from "react";
import { X, ClipboardCopy, Plus, Moon, Sun, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

const defaultColors: string[] = [
  "#FF6B6B", // red
  "#FFD93D", // yellow
  "#6BCB77", // green
  "#4D96FF", // blue
  "#845EC2", // purple
  "#FF9671", // orange
  "#00C9A7", // teal
  "#FFC75F", // amber
  "#F9F871", // light yellow
  "#B39CD0", // lavender
  "#0081CF", // sky blue
  "#FF8066"  // coral
];

const WheelOfNames: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [names, setNames] = useState<string[]>([]);
  const [newName, setNewName] = useState<string>("");
  const [angle, setAngle] = useState<number>(0);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showWheel, setShowWheel] = useState<boolean>(false);
  const [hasSpun, setHasSpun] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "light" ? false : true;
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const addName = (): void => {
    if (newName.trim() && !names.includes(newName.trim())) {
      setNames([...names, newName.trim()]);
      setNewName("");
    }
  };

  const removeName = (index: number): void => {
    setNames(names.filter((_, i) => i !== index));
  };

  const startWheel = (): void => {
    if (names.length > 1) {
      setShowWheel(true);
      drawWheel(angle);
    }
  };

  const resetAll = (): void => {
    setNames([]);
    setAngle(0);
    setWinner(null);
    setNewName("");
    setShowWheel(false);
    setSpinning(false);
    setHasSpun(false);
    setHistory([]);
  };

  const spin = (): void => {
    if (spinning || names.length === 0) return;
    setSpinning(true);
    setHasSpun(true);

    const spinTo: number = 360 * 6 + Math.floor(Math.random() * 360);
    const duration: number = 2500;
    const start: number = performance.now();

    const animate = (now: number): void => {
      const elapsed: number = now - start;
      const progress: number = Math.min(elapsed / duration, 1);
      const eased: number = easeOutCubic(progress);
      const currentAngle: number = angle + (spinTo - angle) * eased;
      drawWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const finalAngle: number = currentAngle % 360;
        const index: number = Math.floor(((360 - finalAngle) % 360) / (360 / names.length));
        const picked: string = names[index];
        setWinner(picked);
        setHistory((prev) => [picked, ...prev]);
        setAngle(finalAngle);
        setSpinning(false);

        // 🎉 Trigger confetti!
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }, i * 300);
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const drawWheel = (angle: number): void => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return;

    const size: number = canvas.width;
    const radius: number = size / 2;
    const arc: number = (2 * Math.PI) / names.length;
    const centerX: number = size / 2;
    const centerY: number = size / 2;

    ctx.clearRect(0, 0, size, size);

    names.forEach((name: string, i: number) => {
      const start: number = i * arc + (angle * Math.PI) / 180;
      const end: number = start + arc;
      const color: string = defaultColors[i % defaultColors.length];

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, start, end);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#000";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(name, radius - 10, 5);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = darkMode ? "#000" : "#1f2937";
    ctx.fill();
  };

  const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

  useEffect(() => {
    if (showWheel) drawWheel(angle);
  }, [names, showWheel, darkMode, angle]);

  return (
    <div className={`${darkMode ? "bg-zinc-900 text-white" : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-black"} min-h-screen flex flex-col items-center justify-center p-4`}>
                 <button onClick={() => setDarkMode(!darkMode)} className="absolute top-10 right-10 hover:opacity-80">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
           <button onClick={resetAll} className="absolute top-10 left-10 hover:opacity-80">
              <RotateCcw size={20} />
            </button>
      <div className="w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🎡 Wheel of Names</h2>
        </div>

        {!showWheel ? (
          <>
            <div className="flex mb-3">
              <input
                value={newName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && addName()}
                placeholder="Enter name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none text-black"
              />
              <button
                onClick={addName}
                className="bg-indigo-500 text-white px-3 py-2 rounded-r-lg hover:bg-indigo-600"
              >
                <Plus size={18} />
              </button>
            </div>
            <ul className="space-y-1 max-h-48 overflow-y-auto mb-4 text-sm">
              {names.map((name: string, index: number) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 dark:bg-zinc-700 rounded px-3 py-1 text-black">
                  <span>{index + 1}. {name}</span>
                  <button onClick={() => removeName(index)} className="text-red-500">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={startWheel}
              disabled={names.length < 2}
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-2 rounded-full font-semibold disabled:opacity-50"
            >
              Start Wheel
            </button>
          </>
        ) : (
          <>
<canvas
  ref={canvasRef}
  width={300}
  height={300}
  className="mb-4 rounded-full cursor-pointer mx-auto"
  onClick={spin}
/>

            <button
              onClick={spin}
              disabled={spinning}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-full font-semibold"
            >
              {spinning ? "Spinning..." : hasSpun ? "Spin Again" : "Spin Wheel"}
            </button>

            {winner && (
              <div className="mt-5 bg-indigo-100 dark:bg-zinc-700 rounded-xl p-4 text-center">
                <p className="text-lg font-bold text-black dark:text-white">🎉 Winner: {winner}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(winner || "");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-black mt-2 inline-flex items-center justify-center p-2 rounded-md hover:bg-indigo-200 dark:hover:bg-zinc-600"
                >
                  <ClipboardCopy size={20} />
                  <span className="ml-1 text-sm">{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            )}

            {history.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-2">🎯 Spin History</h4>
                <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                  {history.map((h: string, i: number) => (
                    <li key={i} className="bg-gray-100 dark:bg-zinc-600 rounded px-3 py-1 text-black">
                      {i + 1}. {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WheelOfNames;
