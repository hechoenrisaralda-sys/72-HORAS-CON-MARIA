export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#1B3A5C] to-[#0F2338]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.15),transparent_50%)]" />
    </div>
  );
}
