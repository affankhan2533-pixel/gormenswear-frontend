"use client";

const STANDARDS = [
  {
    num: "01",
    title: "PREMIUM FABRICS",
    desc: "Selected natural fibers and balanced weaves chosen for natural handfeel, breathability, and enduring drape.",
  },
  {
    num: "02",
    title: "REFINED CONSTRUCTION",
    desc: "Reinforced structural stitching, collar shape retention, and clean seam finishing built for continuous daily rotation.",
  },
  {
    num: "03",
    title: "MODERN FIT",
    desc: "Contemporary silhouettes proportioned to drape naturally—from intentional drop shoulders to effortless breaks.",
  },
  {
    num: "04",
    title: "EVERYDAY COMFORT",
    desc: "Understated wearability engineered for morning-to-night movement while preserving architectural silhouette definition.",
  },
];

export default function WhyGOR() {
  return (
    <section
      id="brand-values"
      className="py-12 sm:py-24 bg-[#EFECE6] text-[#111111] relative selection:bg-[#D8D2C8] selection:text-[#111111] border-t border-[#D8D2C8]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-16 pb-4 border-b border-[#D8D2C8] gap-2">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.35em] text-[#716D66] font-medium block mb-2">
              06 / PRINCIPLES
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#111111] tracking-tight leading-tight">
              THE GOR STANDARD
            </h2>
          </div>
          <span className="font-mono text-xs text-[#716D66]">
            [ FOUR PILLARS ]
          </span>
        </div>

        {/* Tactile Typographic Visual System — Hairline Stone Dividers & Generous Spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STANDARDS.map((std) => (
            <div
              key={std.num}
              className="border-t border-[#D8D2C8] pt-6 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs text-[#716D66] block mb-4">
                  {std.num}
                </span>
                <h3 className="font-editorial text-xl sm:text-2xl font-normal text-[#111111] tracking-tight mb-3">
                  {std.title}
                </h3>
                <p className="font-sans text-xs text-[#716D66] font-normal leading-relaxed">
                  {std.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
