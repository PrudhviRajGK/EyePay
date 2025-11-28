import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "EyePay",
    subtitle: "Payments in a New Dimension",
  },
  {
    title: "Fast • Secure • Reliable",
    subtitle: "Powered by Hedera",
  },
  {
    title: "Next-Gen Web3 UPI",
    subtitle: "Smooth • Instant • Global",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[160px] md:h-[180px] rounded-2xl overflow-hidden border shadow-sm bg-white">

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-600 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-[28px] md:text-[32px] font-semibold text-[#0A1A33]">
            {slide.title}
          </h2>
          <p className="text-[15px] md:text-[17px] text-gray-600 tracking-wide">
            {slide.subtitle}
          </p>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full 
                   bg-gray-200/70 hover:bg-gray-300 transition flex items-center justify-center shadow"
      >
        <ChevronLeft className="w-4 text-gray-700" />
      </button>

      <button
        onClick={() => setCurrent((p) => (p + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full 
                   bg-gray-200/70 hover:bg-gray-300 transition flex items-center justify-center shadow"
      >
        <ChevronRight className="w-4 text-gray-700" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full cursor-pointer 
              ${index === current ? "bg-[#0070F3]" : "bg-gray-400/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
