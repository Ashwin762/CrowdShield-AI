import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import crowd from "../assets/crowd1.jpg";
import control from "../assets/controlroom.jpg";
import ai from "../assets/ai-vision.jpg";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white overflow-x-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6">

        {/* Animated Gradient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-500 opacity-20 blur-3xl animate-pulse"></div>

        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-7xl md:text-8xl font-extrabold tracking-tight relative z-10"
        >
          CrowdShield
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-2xl text-gray-400 max-w-3xl relative z-10"
        >
          Real-time crowd intelligence.  
          Powered by deep learning.
        </motion.p>

        
          
          
          
        
          
        

      </section>

      {/* ================= SECTION 1 ================= */}
      <section className="min-h-screen flex items-center justify-center px-8 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-20 items-center max-w-7xl mx-auto"
        >
          <img
            src={crowd}
            alt="Crowd"
            className="rounded-3xl shadow-2xl"
          />

          <div>
            <h2 className="text-5xl font-bold mb-8 tracking-tight">
              Crowds Escalate in Seconds.
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              High-density gatherings can shift from stable to dangerous within moments.
              Surveillance must evolve beyond human limitations.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ================= SECTION 2 ================= */}
      <section className="min-h-screen flex items-center justify-center px-8 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-20 items-center max-w-7xl mx-auto"
        >
          <div>
            <h2 className="text-5xl font-bold mb-8 tracking-tight">
              Human Monitoring Fails.
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Operators cannot process thousands of moving individuals simultaneously.
              AI provides continuous situational awareness.
            </p>
          </div>

          <img
            src={control}
            alt="Control Room"
            className="rounded-3xl shadow-2xl"
          />
        </motion.div>
      </section>

      {/* ================= SECTION 3 ================= */}
      <section className="min-h-screen flex items-center justify-center px-8 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-20 items-center max-w-7xl mx-auto"
        >
          <img
            src={ai}
            alt="AI Vision"
            className="rounded-3xl shadow-2xl"
          />

          <div>
            <h2 className="text-5xl font-bold mb-8 tracking-tight">
              AI Sees the Pattern.
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Real-time detection, tracking, and predictive intelligence.
              CrowdShield transforms video streams into actionable insight.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="min-h-screen flex items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl font-bold mb-10 tracking-tight">
            Experience the Future of Crowd Intelligence.
          </h2>

          <button
            onClick={() => navigate("/demo")}
            className="bg-cyan-500 px-12 py-5 rounded-full text-black font-semibold text-lg hover:scale-105 transition"
          >
            Launch Live Demo
          </button>
        </motion.div>
      </section>

    </div>
  );
}

export default Landing;