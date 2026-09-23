import { useEffect, useRef } from "react";

interface TileCanvasProps {
  id: string;
  type: "dna" | "neural" | "mandala" | "network" | "atom" | "spectrum";
  className?: string;
}

export function TileCanvas({ id, type, className }: TileCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let r = 0;

    const render = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (!w || !h) {
        animId = requestAnimationFrame(render);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.fillStyle = "#040404";
      ctx.fillRect(0, 0, w, h);
      r += 0.016;

      if (type === "dna") {
        const a = 0.16 * w;
        const t = w / 2;
        const grad = (a0: number, c0: string, c1: string) => {
          const g = ctx.createLinearGradient(0, 0, w, h);
          g.addColorStop(0, c0);
          g.addColorStop(1, c1);
          return g;
        };

        for (let e = 0; e < 2; e++) {
          ctx.beginPath();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle =
            e === 0
              ? grad(0, "rgba(200,255,0,0.9)", "rgba(0,255,180,0.5)")
              : grad(1, "rgba(0,255,180,0.9)", "rgba(200,255,0,0.5)");
          for (let l = 0; l <= 70; l++) {
            const s = l / 70;
            const n =
              t +
              Math.cos(s * Math.PI * 4 + 0.6 * r + e * Math.PI) *
                a *
                (1 / (1.15 + 0.6 * (s - 0.5)));
            const c = 0.1 * h + s * h * 0.8;
            if (l === 0) ctx.moveTo(n, c);
            else ctx.lineTo(n, c);
          }
          ctx.stroke();
        }

        for (let e = 2; e < 70; e += 5) {
          const l = e / 70;
          const s = l * Math.PI * 4 + 0.6 * r;
          const n = s + Math.PI;
          const c = 1 / (1.15 + 0.6 * (l - 0.5));
          const d = 0.1 * h + l * h * 0.8;
          const px1 = t + Math.cos(s) * a * c;
          const px2 = t + Math.cos(n) * a * c;
          const u = ctx.createLinearGradient(px1, d, px2, d);
          u.addColorStop(0, "rgba(200,255,0,0.5)");
          u.addColorStop(1, "rgba(0,255,180,0.5)");
          ctx.strokeStyle = u;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px1, d);
          ctx.lineTo(px2, d);
          ctx.stroke();

          [px1, px2].forEach((px, idx) => {
            ctx.beginPath();
            ctx.arc(px, d, 2, 0, 2 * Math.PI);
            ctx.fillStyle = idx === 0 ? "rgba(200,255,0,0.8)" : "rgba(0,255,180,0.8)";
            ctx.fill();
          });
        }
      }

      if (type === "neural") {
        const layers = [
          [
            { x: 0.12 * w, y: 0.2 * h },
            { x: 0.12 * w, y: 0.4 * h },
            { x: 0.12 * w, y: 0.6 * h },
            { x: 0.12 * w, y: 0.8 * h },
          ],
          [
            { x: 0.35 * w, y: 0.15 * h },
            { x: 0.35 * w, y: 0.38 * h },
            { x: 0.35 * w, y: 0.62 * h },
            { x: 0.35 * w, y: 0.85 * h },
          ],
          [
            { x: 0.58 * w, y: 0.2 * h },
            { x: 0.58 * w, y: 0.4 * h },
            { x: 0.58 * w, y: 0.6 * h },
            { x: 0.58 * w, y: 0.8 * h },
          ],
          [
            { x: 0.82 * w, y: 0.35 * h },
            { x: 0.82 * w, y: 0.65 * h },
          ],
        ];

        const conns: [{ x: number; y: number }, { x: number; y: number }, number][] = [];
        for (let e = 0; e < layers.length - 1; e++) {
          const lCurr = layers[e];
          const lNext = layers[e + 1];
          if (!lCurr || !lNext) continue;
          lCurr.forEach((l1, r1) =>
            lNext.forEach((l2, s1) => {
              conns.push([l1, l2, 10 * e + 3 * r1 + s1]);
            }),
          );
        }

        conns.forEach(([p1, p2, t]) => {
          const l = (0.7 * r + 0.07 * t) % 1;
          const s = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          s.addColorStop(0, "rgba(0,255,180,0.04)");
          s.addColorStop(1, "rgba(150,100,255,0.04)");
          ctx.strokeStyle = s;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          const ix = p1.x + (p2.x - p1.x) * l;
          const iy = p1.y + (p2.y - p1.y) * l;
          const c = ctx.createRadialGradient(ix, iy, 0, ix, iy, 8);
          c.addColorStop(0, "rgba(0,255,180,0.9)");
          c.addColorStop(1, "transparent");
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.arc(ix, iy, 8, 0, 2 * Math.PI);
          ctx.fill();
        });

        layers.forEach((layer, a) =>
          layer.forEach((node, t) => {
            const l = (Math.sin(3.5 * r + 1.4 * a + 0.9 * t) + 1) / 2;
            const s = 5 + 5 * l;
            const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 3 * s);
            grad.addColorStop(0, `rgba(${a < 2 ? "0,255,180" : "150,100,255"},${0.5 + 0.5 * l})`);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 3 * s, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle =
              a < 2 ? `rgba(0,255,180,${0.7 + 0.3 * l})` : `rgba(150,100,255,${0.7 + 0.3 * l})`;
            ctx.beginPath();
            ctx.arc(node.x, node.y, s, 0, 2 * Math.PI);
            ctx.fill();
          }),
        );
      }

      if (type === "mandala") {
        const cx = w / 2;
        const cy = h / 2;
        const rings = [
          { r: 0.08 * Math.min(w, h), n: 12, spd: 0.5, color: "rgba(200,255,0," },
          { r: 0.16 * Math.min(w, h), n: 20, spd: -0.3, color: "rgba(0,255,180," },
          { r: 0.24 * Math.min(w, h), n: 30, spd: 0.2, color: "rgba(100,180,255," },
          { r: 0.32 * Math.min(w, h), n: 40, spd: -0.15, color: "rgba(150,100,255," },
          { r: 0.4 * Math.min(w, h), n: 50, spd: 0.1, color: "rgba(200,255,0," },
        ];

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 0.08 * Math.min(w, h));
        grad.addColorStop(0, "rgba(200,255,0,0.4)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 0.08 * Math.min(w, h), 0, 2 * Math.PI);
        ctx.fill();

        rings.forEach((ring) => {
          for (let l = 0; l < ring.n; l++) {
            const s = (l / ring.n) * Math.PI * 2 + r * ring.spd;
            const px = cx + Math.cos(s) * ring.r;
            const py = cy + Math.sin(s) * ring.r;
            const c = 0.4 + 0.6 * Math.abs(Math.sin(2 * r + 0.4 * l + ring.r));
            const d = ctx.createRadialGradient(px, py, 0, px, py, 5);
            d.addColorStop(0, ring.color + c + ")");
            d.addColorStop(1, "transparent");
            ctx.fillStyle = d;
            ctx.beginPath();
            ctx.arc(px, py, 5, 0, 2 * Math.PI);
            ctx.fill();

            if (l % 3 === 0) {
              ctx.strokeStyle = ring.color + "0.06)";
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              ctx.lineTo(px, py);
              ctx.stroke();
            }
          }
        });
      }

      if (type === "network") {
        const nodes = [
          { x: 0.5 * w, y: 0.5 * h, r: 8, label: "HUB" },
          { x: 0.15 * w, y: 0.2 * h, r: 5, label: "S3" },
          { x: 0.85 * w, y: 0.2 * h, r: 5, label: "EC2" },
          { x: 0.15 * w, y: 0.8 * h, r: 5, label: "DB" },
          { x: 0.85 * w, y: 0.8 * h, r: 5, label: "ECS" },
          { x: 0.5 * w, y: 0.12 * h, r: 5, label: "CDN" },
          { x: 0.5 * w, y: 0.88 * h, r: 5, label: "API" },
        ];

        const edges: [number, number][] = [
          [0, 1],
          [0, 2],
          [0, 3],
          [0, 4],
          [0, 5],
          [0, 6],
          [1, 5],
          [2, 4],
          [3, 6],
        ];

        edges.forEach(([u, v]) => {
          const n1 = nodes[u];
          const n2 = nodes[v];
          if (!n1 || !n2) return;
          ctx.strokeStyle = "rgba(200,255,0,0.08)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();

          const i = (0.5 * r + 0.2 * u + 0.15 * v) % 1;
          const nx = n1.x + (n2.x - n1.x) * i;
          const ny = n1.y + (n2.y - n1.y) * i;
          const d = ctx.createRadialGradient(nx, ny, 0, nx, ny, 6);
          d.addColorStop(0, "rgba(200,255,0,0.9)");
          d.addColorStop(1, "transparent");
          ctx.fillStyle = d;
          ctx.beginPath();
          ctx.arc(nx, ny, 6, 0, 2 * Math.PI);
          ctx.fill();
        });

        nodes.forEach((node) => {
          const t = 0.5 + 0.5 * Math.sin(2 * r + 0.02 * node.x);
          const l = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 3 * node.r);
          l.addColorStop(0, `rgba(200,255,0,${0.5 * t})`);
          l.addColorStop(1, "transparent");
          ctx.fillStyle = l;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3 * node.r, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = `rgba(200,255,0,${0.6 + 0.4 * t})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = "rgba(200,255,0,0.6)";
          ctx.font = `bold ${0.045 * w}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText(node.label, node.x, node.y - node.r - 4);
        });
      }

      if (type === "atom") {
        const cx = w / 2;
        const cy = h / 2;
        const orbits = [
          { rx: 0.35 * w, ry: 0.2 * h, angle: 0, spd: 0.7, color: "97,218,251" },
          {
            rx: 0.35 * w,
            ry: 0.2 * h,
            angle: Math.PI / 3,
            spd: -0.5,
            color: "0,255,180",
          },
          {
            rx: 0.35 * w,
            ry: 0.2 * h,
            angle: -Math.PI / 3,
            spd: 0.6,
            color: "200,255,0",
          },
        ];

        orbits.forEach((orb) => {
          const cosA = Math.cos(orb.angle);
          const sinA = Math.sin(orb.angle);
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(orb.angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, orb.rx, orb.ry, 0, 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(${orb.color},0.15)`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();

          const i = r * orb.spd;
          const nx = cx + (Math.cos(i) * orb.rx * cosA - Math.sin(i) * orb.ry * sinA);
          const ny = cy + (Math.cos(i) * orb.rx * sinA + Math.sin(i) * orb.ry * cosA);
          const d = ctx.createRadialGradient(nx, ny, 0, nx, ny, 12);
          d.addColorStop(0, `rgba(${orb.color},1)`);
          d.addColorStop(1, "transparent");
          ctx.fillStyle = d;
          ctx.beginPath();
          ctx.arc(nx, ny, 12, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = `rgba(${orb.color},1)`;
          ctx.beginPath();
          ctx.arc(nx, ny, 3, 0, 2 * Math.PI);
          ctx.fill();
        });

        const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
        centerGrad.addColorStop(0, "rgba(97,218,251,0.9)");
        centerGrad.addColorStop(1, "transparent");
        ctx.fillStyle = centerGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, 2 * Math.PI);
        ctx.fill();
      }

      if (type === "spectrum") {
        const barW = (0.85 * w) / 28;
        const startX = 0.075 * w;
        for (let e = 0; e < 28; e++) {
          const barH =
            0.15 * h +
            0.65 *
              h *
              Math.abs(
                0.5 * Math.sin(0.4 * e + 1.8 * r) +
                  0.3 * Math.sin(0.7 * e - 1.2 * r) +
                  0.2 * Math.sin(0.2 * e + 0.9 * r),
              );
          const x = startX + e * (barW + 2);
          const y = h - barH - 0.05 * h;
          const grad = ctx.createLinearGradient(x, y + barH, x, y);
          const hue = 80 + (e / 28) * 100;
          grad.addColorStop(0, `hsla(${hue},100%,55%,0.9)`);
          grad.addColorStop(1, `hsla(${hue},100%,75%,0.4)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, 0.75 * barW, barH, 2);
          ctx.fill();

          const tipGrad = ctx.createRadialGradient(
            x + 0.375 * barW,
            y,
            0,
            x + 0.375 * barW,
            y,
            barW,
          );
          tipGrad.addColorStop(0, `hsla(${hue},100%,80%,0.6)`);
          tipGrad.addColorStop(1, "transparent");
          ctx.fillStyle = tipGrad;
          ctx.beginPath();
          ctx.arc(x + 0.375 * barW, y, barW, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [type]);

  return <canvas id={id} ref={canvasRef} className={className || "tile-canvas"} />;
}
