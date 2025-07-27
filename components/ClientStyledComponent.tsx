"use client";
import React from "react";
import jsx from "styled-jsx";

export default function ClientStyledComponent() {
  return (
    <div>
      {/* ...existing JSX... */}
      <style jsx>{`
        /* your styles here */
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
