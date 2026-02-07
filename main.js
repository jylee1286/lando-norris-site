import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===== HERO 3D HELMET =====
class Hero3D {
  constructor() {
    this.container = document.getElementById('hero-3d');
    if (!this.container) return;
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.position.z = 5;
    
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    this.renderer.setSize(500, 500);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);
    
    // Create realistic F1 helmet
    const helmetGroup = new THREE.Group();
    
    // ===== MAIN SHELL - LatheGeometry with F1 profile =====
    const shellPoints = [];
    
    // Create smooth F1 helmet profile (Arai GP-7 style)
    // Bottom to top, starting from neck
    shellPoints.push(new THREE.Vector2(0.15, -1.2));    // Neck opening
    shellPoints.push(new THREE.Vector2(0.35, -1.0));    // Neck curve
    shellPoints.push(new THREE.Vector2(0.55, -0.7));    // Chin guard start
    shellPoints.push(new THREE.Vector2(0.65, -0.4));    // Chin guard curve
    shellPoints.push(new THREE.Vector2(0.68, -0.1));    // Jaw area
    shellPoints.push(new THREE.Vector2(0.70, 0.15));    // Visor opening bottom
    shellPoints.push(new THREE.Vector2(0.72, 0.35));    // Visor opening mid
    shellPoints.push(new THREE.Vector2(0.70, 0.55));    // Visor opening top
    shellPoints.push(new THREE.Vector2(0.68, 0.75));    // Forehead curve
    shellPoints.push(new THREE.Vector2(0.65, 0.95));    // Crown start
    shellPoints.push(new THREE.Vector2(0.58, 1.15));    // Top of helmet
    shellPoints.push(new THREE.Vector2(0.50, 1.25));    // Peak
    shellPoints.push(new THREE.Vector2(0.40, 1.28));    // Back slope start
    shellPoints.push(new THREE.Vector2(0.30, 1.20));    // Back slope
    shellPoints.push(new THREE.Vector2(0.20, 1.05));    // Back curve
    shellPoints.push(new THREE.Vector2(0.10, 0.85));    // Back lower
    shellPoints.push(new THREE.Vector2(0.05, 0.60));    // Back neck
    shellPoints.push(new THREE.Vector2(0, 0.30));       // Close at neck
    
    const shellGeometry = new THREE.LatheGeometry(shellPoints, 64);
    shellGeometry.computeVertexNormals();
    
    // Environment map for reflections
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter
    });
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);
    this.scene.add(cubeCamera);
    
    // Premium shell material - McLaren neon yellow/green
    const shellMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xCCFF00,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 2.0,
      reflectivity: 1.0,
      envMap: cubeRenderTarget.texture
    });
    
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    shell.castShadow = true;
    shell.receiveShadow = true;
    helmetGroup.add(shell);
    
    // ===== VISOR - Curved with transmission =====
    const visorCurve = new THREE.EllipseCurve(
      0, 0,           // center x, y
      0.72, 0.25,     // xRadius, yRadius
      0, Math.PI,     // start angle, end angle
      false,          // clockwise
      0               // rotation
    );
    
    const visorPoints = visorCurve.getPoints(50);
    const visorShape = new THREE.Shape(visorPoints);
    
    const visorGeometry = new THREE.ExtrudeGeometry(visorShape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3
    });
    
    const visorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0A0A0A,
      metalness: 0.5,
      roughness: 0.05,
      transmission: 0.6,
      transparent: true,
      opacity: 0.8,
      thickness: 0.5,
      ior: 1.5,
      iridescence: 0.7,
      iridescenceIOR: 1.3,
      clearcoat: 1.0
    });
    
    const visor = new THREE.Mesh(visorGeometry, visorMaterial);
    visor.position.set(-0.36, 0.35, 0.68);
    visor.rotation.y = Math.PI / 2;
    helmetGroup.add(visor);
    
    // ===== AIR VENTS - Top of helmet =====
    const ventGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.3);
    const ventMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0A0A0A,
      metalness: 0.8,
      roughness: 0.3
    });
    
    // Front vents
    for (let i = 0; i < 3; i++) {
      const vent = new THREE.Mesh(ventGeometry, ventMaterial);
      const angle = (i - 1) * 0.3;
      const radius = 0.52;
      vent.position.set(
        Math.sin(angle) * radius,
        1.15,
        Math.cos(angle) * radius
      );
      vent.rotation.y = angle;
      helmetGroup.add(vent);
    }
    
    // ===== AERODYNAMIC SPOILER - Back fin =====
    const spoilerShape = new THREE.Shape();
    spoilerShape.moveTo(0, 0);
    spoilerShape.lineTo(0.25, 0);
    spoilerShape.lineTo(0.20, 0.15);
    spoilerShape.lineTo(0.05, 0.15);
    spoilerShape.closePath();
    
    const spoilerGeometry = new THREE.ExtrudeGeometry(spoilerShape, {
      depth: 0.02,
      bevelEnabled: false
    });
    
    const spoilerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xCCFF00,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0
    });
    
    const spoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
    spoiler.position.set(-0.01, 1.05, -0.50);
    spoiler.rotation.x = -Math.PI / 6;
    helmetGroup.add(spoiler);
    
    // ===== CHIN GUARD DETAILS =====
    const chinBarGeometry = new THREE.BoxGeometry(0.5, 0.08, 0.12);
    const chinBarMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0A0A0A,
      metalness: 0.9,
      roughness: 0.2
    });
    
    const chinBar = new THREE.Mesh(chinBarGeometry, chinBarMaterial);
    chinBar.position.set(0, -0.4, 0.60);
    chinBar.rotation.x = Math.PI / 8;
    helmetGroup.add(chinBar);
    
    // ===== PANEL LINES - Subtle details =====
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x0A0A0A });
    
    for (let i = 0; i < 2; i++) {
      const lineGeometry = new THREE.TorusGeometry(0.72 + i * 0.15, 0.005, 8, 64);
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.rotation.x = Math.PI / 2;
      line.position.y = 0.5 - i * 0.4;
      helmetGroup.add(line);
    }
    
    // Add to scene
    this.scene.add(helmetGroup);
    this.helmetGroup = helmetGroup;
    
    // ===== 3-POINT LIGHTING SYSTEM =====
    // Key light (main)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    this.scene.add(keyLight);
    
    // Fill light (soften shadows)
    const fillLight = new THREE.DirectionalLight(0xCCFF00, 0.8);
    fillLight.position.set(-5, 3, 3);
    this.scene.add(fillLight);
    
    // Rim light (edge highlight)
    const rimLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
    rimLight.position.set(0, 2, -8);
    this.scene.add(rimLight);
    
    // Ambient base
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    // Accent point lights for glow
    const accentLight1 = new THREE.PointLight(0xCCFF00, 1.5, 50);
    accentLight1.position.set(3, 1, 4);
    this.scene.add(accentLight1);
    
    const accentLight2 = new THREE.PointLight(0xFFFFFF, 1.0, 50);
    accentLight2.position.set(-3, -1, 3);
    this.scene.add(accentLight2);
    
    // Animation
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotationY = 0;
    this.targetRotationX = 0;
    
    this.animate();
    this.setupMouseInteraction();
  }
  
  setupMouseInteraction() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      
      this.targetRotationY = this.mouseX * Math.PI * 0.5;
      this.targetRotationX = this.mouseY * Math.PI * 0.3;
    });
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    if (this.helmetGroup) {
      // Smooth mouse-following rotation
      this.helmetGroup.rotation.y += (this.targetRotationY - this.helmetGroup.rotation.y) * 0.05;
      this.helmetGroup.rotation.x += (this.targetRotationX - this.helmetGroup.rotation.x) * 0.05;
      
      // Continuous slow rotation
      this.helmetGroup.rotation.y += 0.005;
      
      // Floating animation
      this.helmetGroup.position.y = Math.sin(Date.now() * 0.001) * 0.2;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
}

// ===== HELMET GALLERY 3D =====
class HelmetGallery {
  constructor() {
    this.helmets = [];
    this.initHelmets();
  }
  
  createHelmetGeometry() {
    // Simplified but realistic F1 helmet profile for gallery
    const points = [];
    points.push(new THREE.Vector2(0.10, -0.80));    // Neck
    points.push(new THREE.Vector2(0.30, -0.65));    // Chin
    points.push(new THREE.Vector2(0.45, -0.30));    // Jaw
    points.push(new THREE.Vector2(0.48, 0.10));     // Visor bottom
    points.push(new THREE.Vector2(0.47, 0.40));     // Visor top
    points.push(new THREE.Vector2(0.45, 0.65));     // Forehead
    points.push(new THREE.Vector2(0.38, 0.85));     // Crown
    points.push(new THREE.Vector2(0.28, 0.90));     // Top
    points.push(new THREE.Vector2(0.18, 0.85));     // Back
    points.push(new THREE.Vector2(0.08, 0.60));     // Back lower
    points.push(new THREE.Vector2(0, 0.30));        // Close
    
    const geometry = new THREE.LatheGeometry(points, 48);
    geometry.computeVertexNormals();
    return geometry;
  }
  
  initHelmets() {
    const helmetItems = document.querySelectorAll('.helmet-item');
    
    helmetItems.forEach((item, index) => {
      const container = item.querySelector('.helmet-3d');
      if (!container) return;
      
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      camera.position.z = 2.8;
      
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
      });
      const size = 300;
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);
      
      // Create helmet with realistic geometry
      const helmetGroup = new THREE.Group();
      
      const geometry = this.createHelmetGeometry();
      
      // Different colors for each year with metallic variations
      const colors = [
        0xCCFF00, // 2025 - Neon yellow
        0x4466FF, // 2024 - Electric blue
        0xFF6644, // 2023 - Orange glow
        0xAA44FF, // 2022 - Purple metallic
        0xFF4488, // 2021 - Pink chrome
        0x44FFAA, // 2020 - Cyan holographic
        0xFF8844  // 2019 - Gold sunset
      ];
      
      const material = new THREE.MeshPhysicalMaterial({
        color: colors[index % colors.length],
        metalness: 0.9,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        emissive: colors[index % colors.length],
        emissiveIntensity: 0.3,
        reflectivity: 1.0
      });
      
      const helmet = new THREE.Mesh(geometry, material);
      helmetGroup.add(helmet);
      
      // Add visor with iridescence
      const visorCurve = new THREE.EllipseCurve(
        0, 0,
        0.48, 0.15,
        0, Math.PI,
        false, 0
      );
      
      const visorPoints = visorCurve.getPoints(30);
      const visorShape = new THREE.Shape(visorPoints);
      const visorGeometry = new THREE.ExtrudeGeometry(visorShape, {
        depth: 0.015,
        bevelEnabled: true,
        bevelThickness: 0.005,
        bevelSize: 0.005
      });
      
      const visorMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0A0A0A,
        metalness: 0.5,
        roughness: 0.05,
        transmission: 0.5,
        transparent: true,
        opacity: 0.85,
        iridescence: 0.6,
        iridescenceIOR: 1.3,
        clearcoat: 1.0
      });
      
      const visor = new THREE.Mesh(visorGeometry, visorMaterial);
      visor.position.set(-0.24, 0.25, 0.45);
      visor.rotation.y = Math.PI / 2;
      helmetGroup.add(visor);
      
      // Small detail vents
      const ventGeometry = new THREE.BoxGeometry(0.08, 0.03, 0.15);
      const ventMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0A0A0A,
        metalness: 0.8,
        roughness: 0.3
      });
      
      const vent = new THREE.Mesh(ventGeometry, ventMaterial);
      vent.position.set(0, 0.75, 0.32);
      helmetGroup.add(vent);
      
      scene.add(helmetGroup);
      
      // 3-point lighting
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
      keyLight.position.set(3, 5, 3);
      scene.add(keyLight);
      
      const fillLight = new THREE.DirectionalLight(colors[index % colors.length], 0.6);
      fillLight.position.set(-3, 2, 2);
      scene.add(fillLight);
      
      const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
      rimLight.position.set(0, 1, -5);
      scene.add(rimLight);
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const accentLight = new THREE.PointLight(colors[index % colors.length], 1.2, 30);
      accentLight.position.set(2, 1, 3);
      scene.add(accentLight);
      
      this.helmets.push({ scene, camera, renderer, helmetGroup, item, index });
      
      // Enhanced hover animation
      let isHovering = false;
      let rotation = 0;
      let hoverIntensity = 0;
      
      item.addEventListener('mouseenter', () => {
        isHovering = true;
        gsap.to(item, {
          scale: 1.05,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      
      item.addEventListener('mouseleave', () => {
        isHovering = false;
        gsap.to(item, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      
      const animate = () => {
        requestAnimationFrame(animate);
        
        if (isHovering) {
          hoverIntensity = Math.min(hoverIntensity + 0.05, 1);
          rotation += 0.05;
          helmetGroup.rotation.y = rotation;
          helmetGroup.rotation.x = Math.sin(rotation) * 0.3;
          helmetGroup.rotation.z = Math.cos(rotation * 0.5) * 0.15;
        } else {
          hoverIntensity = Math.max(hoverIntensity - 0.05, 0);
          rotation *= 0.95;
          helmetGroup.rotation.y += 0.008;
          helmetGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
        }
        
        helmetGroup.position.y = Math.sin(Date.now() * 0.001 + index) * 0.08;
        
        renderer.render(scene, camera);
      };
      
      animate();
    });
  }
}

// ===== ENHANCED SCROLL ANIMATIONS =====
class ScrollAnimations {
  constructor() {
    this.init();
    this.initParallax();
    this.initCountUps();
  }
  
  init() {
    // Dramatic section reveals with blur
    gsap.utils.toArray('.section').forEach((section, index) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'top 30%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 100,
        scale: 0.95,
        filter: 'blur(10px)',
        ease: 'power3.out'
      });
    });
    
    // Stats cards with staggered dramatic entrance
    gsap.utils.toArray('.stat-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 1
        },
        opacity: 0,
        y: 80,
        scale: 0.8,
        rotation: -5,
        delay: i * 0.1,
        ease: 'back.out(2)'
      });
    });
    
    // Off-track cards with rotation and scale
    gsap.utils.toArray('.off-track-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          end: 'top 50%',
          scrub: 1.5
        },
        opacity: 0,
        scale: 0.7,
        rotationY: 45,
        z: -200,
        delay: i * 0.15,
        ease: 'power4.out'
      });
    });
    
    // Helmet items with dramatic 3D entrance
    gsap.utils.toArray('.helmet-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 92%',
          end: 'top 60%',
          scrub: 1.2
        },
        opacity: 0,
        y: 100,
        rotationX: 90,
        scale: 0.6,
        delay: i * 0.08,
        ease: 'power3.out'
      });
    });
    
    // Partner logos with elastic bounce
    gsap.utils.toArray('.partner-logo').forEach((logo, i) => {
      gsap.from(logo, {
        scrollTrigger: {
          trigger: logo,
          start: 'top 92%',
          end: 'top 70%',
          scrub: 0.8
        },
        opacity: 0,
        scale: 0.3,
        rotation: 360,
        delay: i * 0.05,
        ease: 'elastic.out(1, 0.6)'
      });
    });
    
    // Social posts slide in from left with blur
    gsap.utils.toArray('.social-post').forEach((post, i) => {
      gsap.from(post, {
        scrollTrigger: {
          trigger: post,
          start: 'top 90%',
          end: 'top 65%',
          scrub: 1
        },
        opacity: 0,
        x: -100,
        filter: 'blur(5px)',
        delay: i * 0.08,
        ease: 'power2.out'
      });
    });
    
    // Section titles with dramatic entrance
    gsap.utils.toArray('.section-title').forEach((title) => {
      const chars = title.textContent.split('');
      title.innerHTML = chars.map(char => 
        `<span style="display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');
      
      gsap.from(title.querySelectorAll('span'), {
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          end: 'top 60%',
          scrub: 0.5
        },
        opacity: 0,
        y: 50,
        rotationX: -90,
        stagger: 0.02,
        ease: 'back.out(1.7)'
      });
    });
    
    // Result items
    gsap.utils.toArray('.result-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 92%',
          end: 'top 75%',
          scrub: 1
        },
        opacity: 0,
        x: -60,
        scale: 0.9,
        delay: i * 0.08,
        ease: 'power2.out'
      });
    });
    
    // Action image with scale and fade
    const actionImage = document.querySelector('.action-image-container');
    if (actionImage) {
      gsap.from(actionImage, {
        scrollTrigger: {
          trigger: actionImage,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.5
        },
        opacity: 0,
        scale: 1.2,
        filter: 'blur(20px)',
        ease: 'power2.out'
      });
    }
  }
  
  initParallax() {
    // Hero image parallax
    const heroImage = document.querySelector('.hero-image-wrapper');
    if (heroImage) {
      gsap.to(heroImage, {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        y: 150,
        scale: 1.1,
        ease: 'none'
      });
    }
    
    // Action image parallax
    const actionImg = document.querySelector('.action-image');
    if (actionImg) {
      gsap.to(actionImg, {
        scrollTrigger: {
          trigger: '.action-image-container',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        },
        y: -50,
        scale: 1.05,
        ease: 'none'
      });
    }
    
    // Off-track images parallax
    gsap.utils.toArray('.off-track-image').forEach(img => {
      gsap.to(img, {
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: -30,
        ease: 'none'
      });
    });
  }
  
  initCountUps() {
    // Animate stat numbers counting up
    gsap.utils.toArray('.stat-value').forEach(stat => {
      const text = stat.textContent;
      const match = text.match(/\d+/);
      
      if (match) {
        const target = parseInt(match[0]);
        const obj = { val: 0 };
        
        gsap.to(obj, {
          val: target,
          scrollTrigger: {
            trigger: stat,
            start: 'top 85%',
            toggleActions: 'play none none reset'
          },
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            stat.textContent = text.replace(/\d+/, Math.ceil(obj.val));
          }
        });
      }
    });
  }
}

// ===== SIGNATURE TRANSITIONS =====
class SignatureTransitions {
  constructor() {
    this.init();
  }
  
  init() {
    // Add transition overlays between major sections
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, i) => {
      if (i === 0) return; // Skip first section
      
      const transition = document.createElement('div');
      transition.className = 'section-transition';
      transition.style.cssText = `
        position: absolute;
        top: -100px;
        left: 0;
        right: 0;
        height: 200px;
        background: linear-gradient(to bottom, transparent, ${section.classList.contains('helmets') || section.classList.contains('footer') ? '#0A0A0A' : '#FFFFFF'}, transparent);
        opacity: 0;
        pointer-events: none;
        z-index: 5;
      `;
      section.style.position = 'relative';
      section.insertBefore(transition, section.firstChild);
      
      gsap.to(transition, {
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1
        },
        opacity: 0.3,
        ease: 'none'
      });
    });
  }
}

// ===== HAMBURGER MENU =====
class Menu {
  constructor() {
    this.hamburger = document.querySelector('.hamburger');
    this.isOpen = false;
    
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggle());
    }
  }
  
  toggle() {
    this.isOpen = !this.isOpen;
    
    const spans = this.hamburger.querySelectorAll('span');
    
    if (this.isOpen) {
      gsap.to(spans[0], { rotation: 45, y: 7, duration: 0.3 });
      gsap.to(spans[1], { opacity: 0, duration: 0.3 });
      gsap.to(spans[2], { rotation: -45, y: -7, duration: 0.3 });
    } else {
      gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
      gsap.to(spans[1], { opacity: 1, duration: 0.3 });
      gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
    }
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('🏎️ Initializing Lando Norris site...');
  
  new Hero3D();
  new HelmetGallery();
  new ScrollAnimations();
  new SignatureTransitions();
  new Menu();
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: { y: target, offsetY: 80 },
          ease: 'power3.inOut'
        });
      }
    });
  });
  
  console.log('✅ Site initialized!');
});

// ===== PERFORMANCE OPTIMIZATION =====
// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.timeScale(0);
}

// Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
  });
}
