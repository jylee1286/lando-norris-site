import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    this.renderer.setSize(400, 400);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
    
    // Create helmet geometry (simplified sphere with details)
    const geometry = new THREE.SphereGeometry(1.2, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xCCFF00,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0xCCFF00,
      emissiveIntensity: 0.2
    });
    
    this.helmet = new THREE.Mesh(geometry, material);
    this.scene.add(this.helmet);
    
    // Add rim detail
    const rimGeometry = new THREE.TorusGeometry(1.3, 0.05, 16, 100);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x0A0A0A,
      metalness: 0.9,
      roughness: 0.1
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.x = Math.PI / 2;
    this.scene.add(rim);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xCCFF00, 1, 100);
    pointLight1.position.set(5, 5, 5);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
    pointLight2.position.set(-5, -5, 5);
    this.scene.add(pointLight2);
    
    // Animation
    this.animate();
    
    // Mouse interaction
    this.setupMouseInteraction();
  }
  
  setupMouseInteraction() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    gsap.ticker.add(() => {
      if (this.helmet) {
        this.helmet.rotation.y += (mouseX * 0.5 - this.helmet.rotation.y) * 0.05;
        this.helmet.rotation.x += (mouseY * 0.3 - this.helmet.rotation.x) * 0.05;
      }
    });
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    if (this.helmet) {
      this.helmet.rotation.y += 0.005;
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
      camera.position.z = 3;
      
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
      });
      const size = 280;
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      
      // Create helmet
      const geometry = new THREE.SphereGeometry(0.8, 32, 32);
      
      // Different colors for each year
      const colors = [
        0xCCFF00, // 2025
        0x4444FF, // 2024
        0xFF6644, // 2023
        0xAA44FF, // 2022
        0xFF4444, // 2021
        0x44FF88, // 2020
        0xFF8844  // 2019
      ];
      
      const material = new THREE.MeshStandardMaterial({
        color: colors[index % colors.length],
        metalness: 0.8,
        roughness: 0.2,
        emissive: colors[index % colors.length],
        emissiveIntensity: 0.3
      });
      
      const helmet = new THREE.Mesh(geometry, material);
      scene.add(helmet);
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const pointLight = new THREE.PointLight(0xffffff, 1, 100);
      pointLight.position.set(3, 3, 3);
      scene.add(pointLight);
      
      this.helmets.push({ scene, camera, renderer, helmet, item });
      
      // Hover animation
      let isHovering = false;
      let rotation = 0;
      
      item.addEventListener('mouseenter', () => {
        isHovering = true;
      });
      
      item.addEventListener('mouseleave', () => {
        isHovering = false;
      });
      
      const animate = () => {
        requestAnimationFrame(animate);
        
        if (isHovering) {
          rotation += 0.03;
          helmet.rotation.y = rotation;
          helmet.rotation.x = Math.sin(rotation) * 0.2;
        } else {
          rotation *= 0.95;
          helmet.rotation.y += 0.01;
        }
        
        renderer.render(scene, camera);
      };
      
      animate();
    });
  }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
  constructor() {
    this.init();
  }
  
  init() {
    // Fade in sections
    gsap.utils.toArray('.section').forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });
    });
    
    // Stats cards animation
    gsap.utils.toArray('.stat-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power2.out'
      });
    });
    
    // Off-track cards
    gsap.utils.toArray('.off-track-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'back.out(1.4)'
      });
    });
    
    // Helmet items
    gsap.utils.toArray('.helmet-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
        },
        opacity: 0,
        y: 40,
        rotation: 5,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out'
      });
    });
    
    // Partner logos
    gsap.utils.toArray('.partner-logo').forEach((logo, i) => {
      gsap.from(logo, {
        scrollTrigger: {
          trigger: logo,
          start: 'top 90%',
        },
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        delay: i * 0.08,
        ease: 'elastic.out(1, 0.5)'
      });
    });
    
    // Social posts
    gsap.utils.toArray('.social-post').forEach((post, i) => {
      gsap.from(post, {
        scrollTrigger: {
          trigger: post,
          start: 'top 90%',
        },
        opacity: 0,
        x: -30,
        duration: 0.7,
        delay: i * 0.1,
        ease: 'power2.out'
      });
    });
    
    // Section titles
    gsap.utils.toArray('.section-title').forEach((title) => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
        },
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power3.out'
      });
    });
    
    // Result items
    gsap.utils.toArray('.result-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
        },
        opacity: 0,
        x: -20,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power2.out'
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
  new Hero3D();
  new HelmetGallery();
  new ScrollAnimations();
  new Menu();
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // Parallax effect on hero
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroImage = document.querySelector('.hero-image-wrapper');
      if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    });
  }
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
