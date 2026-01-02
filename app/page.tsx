"use client";

import { CalendarView } from "@/components/calendar/CalendarView";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@/components/icons";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Set dark mode as default on initial load
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen">
      {/* Dark mode toggle */}
      <motion.button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {isDarkMode ? <SunIcon /> : <MoonIcon />}
      </motion.button>

      {/* Main calendar */}
      <CalendarView
        year={2026}
        cycleStartDate={new Date(2026, 0, 1)}
        workWeeks={6}
        restWeeks={1}
        weekStartsOn={1}
      />

      {/* Info section */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              The 6+1 Week Cycle Methodology
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A sustainable approach to productivity that alternates 6 weeks of
              focused work with 1 week of rest and recovery.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-work-50 dark:bg-work-950 p-6 rounded-xl"
            >
              <div className="w-12 h-12 bg-work-500 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">6 Weeks of Work</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Focus on your goals with sustained effort over six consecutive
                weeks. Build momentum and make meaningful progress.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-rest-50 dark:bg-rest-950 p-6 rounded-xl"
            >
              <div className="w-12 h-12 bg-rest-500 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">1 Week of Rest</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Recharge, reflect, and recover. Use this time for creative
                exploration, learning, or simply taking a break.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl"
            >
              <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white dark:text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Repeatable Cycle</h3>
              <p className="text-gray-600 dark:text-gray-400">
                This rhythm continues throughout the year, creating a
                sustainable and predictable work-life balance.
              </p>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <h3 className="text-2xl font-bold mb-6">Features</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4">
                <div className="text-3xl mb-2">🎨</div>
                <h4 className="font-semibold mb-1">Premium Animations</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Smooth transitions and micro-interactions
                </p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">📅</div>
                <h4 className="font-semibold mb-1">Three View Modes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Timeline, Month Grid, and Agenda List
                </p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">🌓</div>
                <h4 className="font-semibold mb-1">Dark Mode</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Beautiful in light and dark themes
                </p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-semibold mb-1">Performance First</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optimized rendering and memoization
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

