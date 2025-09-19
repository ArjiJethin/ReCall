import React, { useEffect, useRef } from "react";

export default function DvdShadow({ size = 380, speed = 50 }) {
  const blobRef = useRef(null);
  const rafRef = useRef(null);
  const roRef = useRef(null);

  useEffect(() => {
    const blob = blobRef.current;
    const container = document.querySelector(".recall-app") || document.body;
    if (!blob || !container) return;

    let rect = container.getBoundingClientRect();
    let blobSize = Math.min(size, rect.width * 0.6, rect.height * 0.6);

    function applySize() {
      rect = container.getBoundingClientRect();
      blobSize = Math.min(size, rect.width * 0.6, rect.height * 0.6);
      blob.style.width = `${Math.round(blobSize)}px`;
      blob.style.height = `${Math.round(blobSize)}px`;
    }
    applySize();

    // initial random position
    let x = Math.random() * (rect.width - blobSize);
    let y = Math.random() * (rect.height - blobSize);

    // random diagonal direction
    let angle = Math.random() * Math.PI * 2;
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;

    let last = performance.now();

    function step(now) {
      const dt = (now - last) / 1000;
      last = now;

      // update position
      x += vx * dt;
      y += vy * dt;

      const maxX = rect.width - blobSize;
      const maxY = rect.height - blobSize;

      // bounce horizontally
      if (x <= 0 || x >= maxX) {
        vx = -vx;
        x = Math.max(0, Math.min(x, maxX));
        // small random tweak to avoid repeating exact loops
        angle = Math.atan2(vy, vx) + (Math.random() - 0.5) * 0.2;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      }

      // bounce vertically
      if (y <= 0 || y >= maxY) {
        vy = -vy;
        y = Math.max(0, Math.min(y, maxY));
        // small random tweak
        angle = Math.atan2(vy, vx) + (Math.random() - 0.5) * 0.2;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      }

      // move blob
      blob.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      // 🌊 add trail effect
      const trail = blob.cloneNode(true);
      trail.classList.add("dvd-trail");
      trail.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      container.appendChild(trail);

      // cleanup after animation
      setTimeout(() => trail.remove(), 3000);

      rafRef.current = requestAnimationFrame(step);
    }

    // start loop
    rafRef.current = requestAnimationFrame(step);

    // resize observer
    if ("ResizeObserver" in window) {
      roRef.current = new ResizeObserver(() => {
        rect = container.getBoundingClientRect();
        applySize();
      });
      roRef.current.observe(container);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (roRef.current) roRef.current.disconnect();
    };
  }, [size, speed]);

  return <div className="dvd-shadow" ref={blobRef} aria-hidden="true" />;
}
