import { useEffect, useRef } from "react";
import * as THREE from "three";

export type BackgroundAnimationType = "dna" | "neural" | "waves" | "vortex";

interface DnaBackgroundProps {
  type?: BackgroundAnimationType;
  isAbsolute?: boolean;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  /** Width of the background as a percentage of its parent (default 100) */
  widthPercent?: number;
  /** If true, anchor to the right side instead of left */
  alignRight?: boolean;
  /** Dynamic accent color (hex, rgb, etc.) to harmonize 3D particles with active theme */
  accentColor?: string | undefined;
}

export function DnaBackground({
  type = "dna",
  isAbsolute = false,
  scrollContainerRef,
  widthPercent = 100,
  alignRight = false,
  accentColor = "#c8ff00",
}: DnaBackgroundProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getWidth = () =>
      isAbsolute && container.parentElement?.clientWidth
        ? container.parentElement.clientWidth
        : container.clientWidth || window.innerWidth;

    const getHeight = () => {
      if (isAbsolute && container.parentElement) {
        return container.parentElement.clientHeight || window.innerHeight;
      }
      return container.clientHeight || window.innerHeight;
    };

    // Scene & Camera
    const scene = new THREE.Scene();
    if (!isAbsolute) {
      scene.background = new THREE.Color("#040404");
    }

    const camera = new THREE.PerspectiveCamera(45, getWidth() / getHeight(), 0.1, 100);
    camera.position.set(0, 0, 22);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
      alpha: isAbsolute,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(getWidth(), getHeight(), false);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    // Extract base hue from dynamic accent color
    let baseHue = 0.22;
    try {
      const baseCol = new THREE.Color(accentColor || "#c8ff00");
      const hsl = { h: 0.22, s: 1, l: 0.5 };
      baseCol.getHSL(hsl);
      baseHue = hsl.h;
    } catch {
      baseHue = 0.22;
    }

    // Create soft glowing radial particle sprite harmonized with accentColor
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      const c1 = new THREE.Color().setHSL(baseHue, 0.95, 0.65);
      const c2 = new THREE.Color().setHSL((baseHue + 0.08) % 1, 0.85, 0.5);
      gradient.addColorStop(
        0.35,
        `rgba(${Math.round(c1.r * 255)}, ${Math.round(c1.g * 255)}, ${Math.round(c1.b * 255)}, 0.85)`,
      );
      gradient.addColorStop(
        0.7,
        `rgba(${Math.round(c2.r * 255)}, ${Math.round(c2.g * 255)}, ${Math.round(c2.b * 255)}, 0.35)`,
      );
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    // Group to hold mesh objects for animation
    const animationGroup = new THREE.Group();
    scene.add(animationGroup);

    // Track objects for disposal
    const disposables: { dispose: () => void }[] = [particleTexture, renderer];

    // Variables specific to animation types
    let updateAnimation: (
      elapsedTime: number,
      scrollRatio: number,
      mouse: { x: number; y: number },
    ) => void;

    // --- ANIMATION 1: DNA HELIX ---
    if (type === "dna") {
      const count = 12000;
      const origins = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const tempColor = new THREE.Color();

      for (let i = 0; i < count; i++) {
        let r = 0;
        let a = 0;
        let s = 0;
        const o = 3 * i;
        const l = Math.random();
        let u = 0;
        let c = false;
        let h = 0;

        if (l < 0.4) {
          u = 0;
        } else if (l < 0.8) {
          u = 1;
        } else {
          c = true;
          h = Math.random();
        }

        let d = Math.random();
        if (c) {
          d = Math.floor(60 * d) / 60;
        }

        const p = d * Math.PI * 10;
        const f = u === 1 ? Math.PI : 0;

        if (c) {
          const e = p + Math.PI;
          const t = 3.5 * Math.cos(p);
          const n = 3.5 * Math.sin(p);
          const i2 = 3.5 * Math.cos(e);
          const a2 = 3.5 * Math.sin(e);
          r = t + (i2 - t) * h;
          s = n + (a2 - n) * h;
          r += (Math.random() - 0.5) * 0.4;
          s += (Math.random() - 0.5) * 0.4;
        } else {
          r = 3.5 * Math.cos(p + f);
          s = 3.5 * Math.sin(p + f);
          r += (Math.random() - 0.5) * 0.8;
          s += (Math.random() - 0.5) * 0.8;
        }

        a = (d - 0.5) * (isAbsolute ? 65 : 40);
        r += (Math.random() - 0.5) * 0.3;
        a += (Math.random() - 0.5) * 0.3;
        s += (Math.random() - 0.5) * 0.3;

        origins[o] = r;
        origins[o + 1] = a;
        origins[o + 2] = s;

        const m = (baseHue + d * 0.22) % 1;
        const sat = 0.8 + 0.2 * Math.random();
        const light = c ? 0.45 + 0.3 * Math.random() : 0.6 + 0.35 * Math.random();
        tempColor.setHSL(m, sat, light);
        colors[o] = tempColor.r;
        colors[o + 1] = tempColor.g;
        colors[o + 2] = tempColor.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(origins, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      disposables.push(geometry);

      const material = new THREE.PointsMaterial({
        size: 0.16,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.88,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposables.push(material);

      const points = new THREE.Points(geometry, material);
      animationGroup.add(points);

      updateAnimation = (elapsedTime, scrollRatio, mouse) => {
        points.rotation.y = 0.15 * elapsedTime + scrollRatio * Math.PI * 1.5;
        points.position.y = 0.5 * Math.sin(0.5 * elapsedTime) - (scrollRatio - 0.2) * 6;
      };
    }

    // --- ANIMATION 2: NEURAL SYNAPSE NETWORK ---
    else if (type === "neural") {
      const nodeCount = 7000;
      const clusterCount = 18;
      const clusterCenters: THREE.Vector3[] = [];

      for (let c = 0; c < clusterCount; c++) {
        clusterCenters.push(
          new THREE.Vector3(
            (Math.random() - 0.5) * 14,
            (Math.random() - 0.5) * (isAbsolute ? 55 : 35),
            (Math.random() - 0.5) * 12,
          ),
        );
      }

      const positions = new Float32Array(nodeCount * 3);
      const colors = new Float32Array(nodeCount * 3);
      const tempColor = new THREE.Color();

      for (let i = 0; i < nodeCount; i++) {
        const cluster = clusterCenters[i % clusterCount]!;
        const spread = 2.5 + Math.random() * 2.0;
        const x = cluster.x + (Math.random() - 0.5) * spread;
        const y = cluster.y + (Math.random() - 0.5) * spread;
        const z = cluster.z + (Math.random() - 0.5) * spread;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Colors: gradient around baseHue
        const hue = i % 2 === 0 ? baseHue : (baseHue + 0.12) % 1;
        tempColor.setHSL(hue, 0.9, 0.55 + Math.random() * 0.35);
        colors[i * 3] = tempColor.r;
        colors[i * 3 + 1] = tempColor.g;
        colors[i * 3 + 2] = tempColor.b;
      }

      const pointsGeo = new THREE.BufferGeometry();
      pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      pointsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      disposables.push(pointsGeo);

      const pointsMat = new THREE.PointsMaterial({
        size: 0.18,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposables.push(pointsMat);

      const points = new THREE.Points(pointsGeo, pointsMat);
      animationGroup.add(points);

      // Synapse line segments connecting nearby cluster nodes
      const linePositions: number[] = [];
      const lineColors: number[] = [];
      const cLineA = new THREE.Color().setHSL(baseHue, 0.95, 0.6);
      const cLineB = new THREE.Color().setHSL((baseHue + 0.12) % 1, 0.95, 0.6);

      for (let i = 0; i < clusterCount; i++) {
        for (let j = i + 1; j < clusterCount; j++) {
          const cA = clusterCenters[i]!;
          const cB = clusterCenters[j]!;
          const dist = cA.distanceTo(cB);
          if (dist < 14) {
            linePositions.push(cA.x, cA.y, cA.z, cB.x, cB.y, cB.z);
            lineColors.push(cLineA.r, cLineA.g, cLineA.b, cLineB.r, cLineB.g, cLineB.b);
          }
        }
      }

      const linesGeo = new THREE.BufferGeometry();
      linesGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      linesGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));
      disposables.push(linesGeo);

      const linesMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposables.push(linesMat);

      const lines = new THREE.LineSegments(linesGeo, linesMat);
      animationGroup.add(lines);

      updateAnimation = (elapsedTime, scrollRatio) => {
        animationGroup.rotation.y = 0.08 * elapsedTime + scrollRatio * Math.PI * 0.7;
        animationGroup.rotation.x = 0.04 * Math.sin(0.3 * elapsedTime);
        animationGroup.position.y = -(scrollRatio - 0.2) * 8;
        linesMat.opacity = 0.22 + 0.15 * Math.sin(elapsedTime * 2);
      };
    }

    // --- ANIMATION 3: CYBER WAVE FIELD ---
    else if (type === "waves") {
      const cols = 110;
      const rows = 110;
      const count = cols * rows;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const baseCoords = new Float32Array(count * 2);
      const tempColor = new THREE.Color();

      const spreadX = 26;
      const spreadZ = 26;
      let idx = 0;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i / (cols - 1) - 0.5) * spreadX;
          const z = (j / (rows - 1) - 0.5) * spreadZ;
          baseCoords[idx * 2] = x;
          baseCoords[idx * 2 + 1] = z;

          positions[idx * 3] = x;
          positions[idx * 3 + 1] = 0;
          positions[idx * 3 + 2] = z;

          tempColor.setHSL((baseHue + 0.18 * (i / cols)) % 1, 0.95, 0.65);
          colors[idx * 3] = tempColor.r;
          colors[idx * 3 + 1] = tempColor.g;
          colors[idx * 3 + 2] = tempColor.b;
          idx++;
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      disposables.push(geometry);

      const material = new THREE.PointsMaterial({
        size: 0.16,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposables.push(material);

      const points = new THREE.Points(geometry, material);
      points.rotation.x = -Math.PI * 0.3;
      animationGroup.add(points);

      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

      updateAnimation = (elapsedTime, scrollRatio) => {
        const time = elapsedTime * 1.3;
        const pArray = posAttr.array as Float32Array;

        for (let k = 0; k < count; k++) {
          const x = baseCoords[k * 2]!;
          const z = baseCoords[k * 2 + 1]!;
          // Fluid dual harmonics equation
          const y =
            Math.sin(x * 0.35 + time) * Math.cos(z * 0.35 + time * 0.8) * 2.2 +
            Math.sin((x + z) * 0.22 + time * 0.6) * 1.1;
          pArray[k * 3 + 1] = y;
        }
        posAttr.needsUpdate = true;

        points.rotation.z = 0.05 * Math.sin(0.4 * elapsedTime) + (scrollRatio - 0.2) * 0.5;
        animationGroup.position.y = 2 - (scrollRatio - 0.2) * 7;
      };
    }

    // --- ANIMATION 4: QUANTUM VORTEX / COSMIC CYBER TUNNEL ---
    else {
      const count = 12000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const tempColor = new THREE.Color();

      for (let i = 0; i < count; i++) {
        // 4 logarithmic spiral arms + galactic dust
        const armIndex = i % 4;
        const armAngle = (armIndex * Math.PI * 2) / 4;
        const radius = Math.pow(Math.random(), 0.55) * 12 + 0.3;
        const spin = radius * 0.85;

        const angle = armAngle + spin + (Math.random() - 0.5) * 0.6;
        const spread = (Math.random() - 0.5) * (0.8 + radius * 0.15);

        const x = Math.cos(angle) * radius + spread;
        const z = Math.sin(angle) * radius + spread;
        // Funnel vortex depth: center descends inward
        const y = -(12 - radius) * 0.6 + (Math.random() - 0.5) * (isAbsolute ? 20 : 12);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Core is bright white/cyan, outer arms transition toward accent color
        const normR = Math.min(radius / 12, 1);
        const hue = (baseHue + (1 - normR) * 0.18) % 1;
        const light = 0.85 - normR * 0.35;
        tempColor.setHSL(hue, 0.95, light);

        colors[i * 3] = tempColor.r;
        colors[i * 3 + 1] = tempColor.g;
        colors[i * 3 + 2] = tempColor.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      disposables.push(geometry);

      const material = new THREE.PointsMaterial({
        size: 0.17,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposables.push(material);

      const points = new THREE.Points(geometry, material);
      points.rotation.x = 0.85;
      animationGroup.add(points);

      updateAnimation = (elapsedTime, scrollRatio) => {
        // Accelerating vortex spin with scroll
        points.rotation.z = 0.22 * elapsedTime + scrollRatio * Math.PI * 2.0;
        animationGroup.position.y = -(scrollRatio - 0.2) * 9;
        const pulse = 1 + 0.04 * Math.sin(elapsedTime * 1.5);
        points.scale.set(pulse, pulse, pulse);
      };
    }

    // Mouse Tracking
    const mouse = { x: 0, y: 0 };
    const targetRot = { x: 0, z: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Scroll Tracking
    const scrollTarget = scrollContainerRef?.current || window;

    const getScrollY = () => {
      if (scrollTarget === window || scrollTarget instanceof Window) return window.scrollY;
      return (scrollTarget as HTMLElement).scrollTop;
    };

    const getMaxScroll = () => {
      if (scrollTarget === window || scrollTarget instanceof Window) {
        return Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      }
      return Math.max(
        (scrollTarget as HTMLElement).scrollHeight - (scrollTarget as HTMLElement).clientHeight,
        1,
      );
    };

    let targetScroll = getScrollY();
    let currentScroll = getScrollY();

    const handleScroll = () => {
      targetScroll = getScrollY();
      if (isAbsolute && container) {
        container.style.transform = `translate3d(0, ${targetScroll}px, 0)`;
      }
    };
    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });

    // Initial position & height sync
    if (isAbsolute && container) {
      container.style.transform = `translate3d(0, ${getScrollY()}px, 0)`;
      if (container.parentElement) {
        container.style.height = `${container.parentElement.clientHeight}px`;
      }
    }

    // Resize
    const handleResize = () => {
      const w = getWidth();
      const h = getHeight();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (isAbsolute && container && container.parentElement) {
        container.style.height = `${container.parentElement.clientHeight}px`;
      }
    };
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    const observeTarget =
      isAbsolute && container.parentElement ? container.parentElement : container;
    resizeObserver.observe(observeTarget);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll interpolation
      currentScroll += (targetScroll - currentScroll) * 0.05;
      const scrollRatio = currentScroll / getMaxScroll();

      // Pin background inside scroll container
      if (isAbsolute && container) {
        const sy = getScrollY();
        container.style.transform = `translate3d(0, ${sy}px, 0)`;
      }

      // Run specific animation step
      if (updateAnimation) {
        updateAnimation(elapsedTime, scrollRatio, mouse);
      }

      targetRot.x = 0.08 * mouse.y;
      targetRot.z = -0.08 * mouse.x;

      animationGroup.rotation.x += (targetRot.x - animationGroup.rotation.x) * 0.05;
      animationGroup.rotation.z += (targetRot.z - animationGroup.rotation.z) * 0.05;

      camera.position.x += (1.8 * mouse.x - camera.position.x) * 0.02;
      camera.position.y += (1.8 * mouse.y - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      scrollTarget.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      disposables.forEach((d) => d.dispose());
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [type, isAbsolute, scrollContainerRef, accentColor]);

  // Sync container height with parent clientHeight (visible viewport in preview)
  useEffect(() => {
    if (!isAbsolute) return;
    const container = containerRef.current;
    const parent = container?.parentElement;
    if (!container || !parent) return;

    const syncHeight = () => {
      const h = parent.clientHeight;
      if (h > 0) container.style.height = `${h}px`;
    };

    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [isAbsolute]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none"
      style={{
        position: isAbsolute ? "absolute" : "fixed",
        top: 0,
        left: alignRight ? "auto" : 0,
        right: alignRight ? 0 : "auto",
        width: `${widthPercent}%`,
        height: isAbsolute ? "100%" : "100vh",
        willChange: isAbsolute ? "transform" : "auto",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
