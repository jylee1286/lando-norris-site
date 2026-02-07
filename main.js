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
    this.container.appendChild(this.renderer.domElement);
    
    // Create helmet geometry (more detailed)
    const helmetGroup = new THREE.Group();
    
    // Main helmet body
    const geometry = new THREE.SphereGeometry(1.5, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 0xCCFF00,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xCCFF00,
      emissiveIntensity: 0.4,
      envMapIntensity: 1
    });
    
    this.helmet = new THREE.Mesh(geometry, material);
    helmetGroup.add(this.helmet);
    
    // Add visor (dark band)
    const visorGeometry = new THREE.TorusGeometry(1.5, 0.2, 16, 100);
    const visorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0A0A0A,
      metalness: 1.0,
      roughness: 0.1,
      emissive: 0x0A0A0A,
      emissiveIntensity: 0.1
    });
    const visor = new THREE.Mesh(visorGeometry, visorMaterial);
    visor.rotation.x = Math.PI / 2;
    helmetGroup.add(visor);
    
    // Add detail rings
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(1.6 + i * 0.15, 0.03, 8, 64);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xFFFFFF : 0x0A0A0A,
        metalness: 0.9,
        roughness: 0.2
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.2 - i * 0.3;
      helmetGroup.add(ring);
    }
    
    this.scene.add(helmetGroup);
    this.helmetGroup = helmetGroup;
    
    // Dramatic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xCCFF00, 2, 100);
    pointLight1.position.set(5, 5, 5);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xFFFFFF, 1.5, 100);
    pointLight2.position.set(-5, -5, 5);
    this.scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0xCCFF00, 1, 100);
    pointLight3.position.set(0, 0, -5);
    this.scene.add(pointLight3);
    
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
  
  initHelmets() {
    const helmetItems = document.querySelectorAll('.helmet-item');
    
    helmetItems.forEach((item, index) => {
      const container = item.querySelector('.helmet-3d');
      if (!container) return;
      
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      camera.position.z = 3.5;
      
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
      });
      const size = 300;
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      
      // Create helmet with more detail
      const helmetGroup = new THREE.Group();
      
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      
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
      
      const material = new THREE.MeshStandardMaterial({
        color: colors[index % colors.length],
        metalness: 0.9,
        roughness: 0.15,
        emissive: colors[index % colors.length],
        emissiveIntensity: 0.4
      });
      
      const helmet = new THREE.Mesh(geometry, material);
      helmetGroup.add(helmet);
      
      // Add visor
      const visorGeom = new THREE.TorusGeometry(1.05, 0.08, 16, 100);
      const visorMat = new THREE.MeshStandardMaterial({
        color: 0x0A0A0A,
        metalness: 1.0,
        roughness: 0.05
      });
      const visor = new THREE.Mesh(visorGeom, visorMat);
      visor.rotation.x = Math.PI / 2;
      helmetGroup.add(visor);
      
      scene.add(helmetGroup);
      
      // Dramatic lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const pointLight = new THREE.PointLight(colors[index % colors.length], 2, 100);
      pointLight.position.set(3, 3, 3);
      scene.add(pointLight);
      
      const rimLight = new THREE.PointLight(0xffffff, 1, 100);
      rimLight.position.set(-3, -3, 3);
      scene.add(rimLight);
      
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
        
        helmetGroup.position.y = Math.sin(Date.now() * 0.001 + index) * 0.1;
        
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
