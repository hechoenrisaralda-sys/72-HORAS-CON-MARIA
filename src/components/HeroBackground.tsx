export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#1B3A5C] to-[#0F2338]" />
      <svg
        className="absolute -right-20 top-0 h-full w-auto opacity-20"
        viewBox="0 0 400 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M200 40 C260 80, 300 140, 280 220 C270 260, 240 290, 240 330 C240 380, 280 420, 300 480 C330 560, 310 640, 280 720 C260 780, 220 800, 200 800 C180 800, 140 780, 120 720 C90 640, 70 560, 100 480 C120 420, 160 380, 160 330 C160 290, 130 260, 120 220 C100 140, 140 80, 200 40 Z"
          fill="#C9A84C"
        />
        <circle cx="200" cy="120" r="35" fill="#F5F0E6" opacity="0.9" />
        <path
          d="M180 150 Q200 170 220 150 L220 180 Q200 210 180 180 Z"
          fill="#F5F0E6"
          opacity="0.6"
        />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.15),transparent_50%)]" />
    </div>
  );
}
