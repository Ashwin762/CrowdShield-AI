import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Demo() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("upload");
  const [file, setFile] = useState(null);
  const [rtsp, setRtsp] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [results, setResults] = useState(null);
  const [streamKey, setStreamKey] = useState(0);

const startAnalysis = async () => {
  const formData = new FormData();
  formData.append("mode", mode);

  if (mode === "upload" && file) {
    formData.append("video", file);
  }

  if (mode === "rtsp" && rtsp) {
    formData.append("rtsp_url", rtsp);
  }

  await fetch("http://127.0.0.1:8000/start", {
    method: "POST",
    body: formData,
  });

  setStreamKey(Date.now());   // 🔥 force stream refresh
  setStreaming(true);
  setResults(null);
};

  const stopAnalysis = async () => {
    await fetch("http://127.0.0.1:8000/stop", {
      method: "POST",
    });

    setStreaming(false);
  };

  useEffect(() => {
    if (!streaming) return;

    const interval = setInterval(async () => {
      const response = await fetch("http://127.0.0.1:8000/results");
      const data = await response.json();
      setResults(data);
    }, 1000);

    return () => clearInterval(interval);
  }, [streaming]);

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black opacity-40 blur-3xl"></div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="relative z-10 text-gray-400 hover:text-white mb-6 transition"
      >
        ← Back
      </button>

      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold text-center mb-12 relative z-10"
      >
        Live Intelligence Dashboard
      </motion.h1>

      <div className="relative z-10 max-w-6xl mx-auto bg-white/5 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/10">

        {/* MODE SELECTOR */}
        <div className="flex gap-6 justify-center mb-8">
          <button
            onClick={() => setMode("upload")}
            className={`px-4 py-2 rounded-lg ${
              mode === "upload" ? "bg-cyan-500 text-black" : "bg-white/10"
            }`}
          >
            Upload Video
          </button>

          <button
            onClick={() => setMode("webcam")}
            className={`px-4 py-2 rounded-lg ${
              mode === "webcam" ? "bg-cyan-500 text-black" : "bg-white/10"
            }`}
          >
            Live Camera
          </button>

          <button
            onClick={() => setMode("rtsp")}
            className={`px-4 py-2 rounded-lg ${
              mode === "rtsp" ? "bg-cyan-500 text-black" : "bg-white/10"
            }`}
          >
            RTSP CCTV
          </button>
        </div>

        {/* INPUTS */}
        {mode === "upload" && (
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />
        )}

        {mode === "rtsp" && (
          <input
            type="text"
            placeholder="rtsp://username:password@ip:port/stream"
            value={rtsp}
            onChange={(e) => setRtsp(e.target.value)}
            className="text-black p-2 rounded-lg w-full mb-4"
          />
        )}

        {/* START / STOP BUTTONS */}
        <div className="flex gap-4 justify-center mt-4">
          <button
            onClick={startAnalysis}
            className="bg-cyan-500 px-6 py-2 rounded-lg text-black font-semibold hover:scale-105 transition"
          >
            Start Analysis
          </button>

          <button
            onClick={stopAnalysis}
            className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Stop
          </button>
        </div>

        {/* ALERT BANNER */}
        {results && results.danger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 text-center bg-red-600 rounded-xl animate-pulse font-bold"
          >
            🚨 CROWD DENSITY ALERT — Threshold Exceeded 🚨
          </motion.div>
        )}

        {/* LIVE METRICS */}
        {results && (
          <div className="mt-8 grid grid-cols-3 gap-8 text-center">
            <div className="bg-black/60 p-6 rounded-2xl">
              <p className="text-gray-400">Current</p>
              <p className="text-4xl font-bold text-cyan-400">
                {results.current_people}
              </p>
            </div>

            <div className="bg-black/60 p-6 rounded-2xl">
              <p className="text-gray-400">Unique</p>
              <p className="text-4xl font-bold text-purple-400">
                {results.unique_people}
              </p>
            </div>

            <div className="bg-black/60 p-6 rounded-2xl">
              <p className="text-gray-400">Frames</p>
              <p className="text-4xl font-bold text-blue-400">
                {results.total_frames}
              </p>
            </div>
          </div>
        )}

        {/* LIVE STREAM */}
        {streaming && (
          <div className="mt-10">
            <img
              src="http://127.0.0.1:8000/stream"
              alt="Live Stream"
              className="w-full rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Demo;