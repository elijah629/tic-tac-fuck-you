"use client";

import { useState } from "react";
import SimpleDropZone from "@/components/drop-zone";

export default function Page() {
  const [cardExists, setCardExists] = useState(true);
  const resetDemo = () => {
    setCardExists(true);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          {!cardExists && (
            <button
              onClick={resetDemo}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Card
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="flex justify-center">
            <div className="relative">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">
                Card
              </h2>
              <div className="relative w-32 h-32 flex items-center justify-center">
                {!cardExists && (
                  <div className="w-24 h-24 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs text-center">
                      Card Removed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Drop Zone Section */}
          <div className="flex justify-center">
            <div className="relative">
              <h2 className="text-xl font-semibold text-white mb-6 text-center">
                Drop Zone
              </h2>
              <SimpleDropZone />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
