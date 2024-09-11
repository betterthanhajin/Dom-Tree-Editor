"use client";
import DomTree from "@/components/DomTree";
import mermaid from "mermaid";
import { useEffect } from "react";

export default function Home() {
  const initialHtml = "<div><h1>Hello</h1><p>World</p></div>";

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
      },
    });
  }, []);

  return (
    <div>
      <DomTree initialHtml={initialHtml} />
    </div>
  );
}
