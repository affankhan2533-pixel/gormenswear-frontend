"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Code, Layers, Server, Terminal, ShieldCheck } from "lucide-react";

export default function DocumentationCenterView({ docs }) {
  const [selectedDoc, setSelectedDoc] = useState(docs[0] || null);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Enterprise Documentation Hub & Knowledge Center
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Architecture diagrams, folder structures, component catalogs, API inventories, and developer onboarding guides.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-3">
          {docs.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => setSelectedDoc(doc)}
              className={`w-full p-4 rounded-[16px] text-left transition-all cursor-pointer border ${
                selectedDoc?.id === doc.id
                  ? "bg-[#151515] border-[#C8A45D] text-[#F8F6F3] shadow-lg"
                  : "bg-[#090909] border-[#2A2A2A] text-[#8E8A85] hover:border-[#2A2A2A] hover:text-[#F8F6F3]"
              }`}
            >
              <span className="text-[10px] font-mono text-[#C8A45D] font-bold uppercase block mb-1">
                {doc.category}
              </span>
              <h4 className="font-bold text-sm text-[#F8F6F3] block">{doc.title}</h4>
              <p className="text-[11px] text-[#8E8A85] mt-1 line-clamp-2">{doc.summary}</p>
            </button>
          ))}
        </div>

        {/* Documentation Content Viewer */}
        <div className="lg:col-span-2 p-6 sm:p-8 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-2xl space-y-4 text-[#F8F6F3]">
          {selectedDoc ? (
            <div>
              <div className="border-b border-[#2A2A2A] pb-4 mb-4">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#090909] text-[#C8A45D] border border-[#2A2A2A] rounded uppercase">
                  {selectedDoc.category}
                </span>
                <h3 className="font-editorial text-3xl text-[#F8F6F3] mt-2">
                  {selectedDoc.title}
                </h3>
              </div>

              <div className="prose prose-invert max-w-none text-xs text-[#8E8A85] space-y-4 font-mono leading-relaxed">
                <pre className="p-4 bg-[#090909] border border-[#2A2A2A] rounded-[14px] text-emerald-400 overflow-x-auto">
                  {selectedDoc.content}
                </pre>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-[#8E8A85]">
              Select a documentation module to view detailed technical specifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
