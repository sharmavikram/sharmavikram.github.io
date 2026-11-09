/**
 * Vikram Sharma - AI Portfolio Engine
 * Neural Canvas, Theme Engine, AI Knowledge Assistant, Interactive Architecture Deck, Command Palette
 */

(function () {
  'use strict';

  /* ==========================================================================
     0. TOAST NOTIFICATION HELPER
     ========================================================================== */
  function showToast(msg) {
    let toast = document.getElementById('ai-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ai-toast';
      toast.className = 'ai-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  /* ==========================================================================
     1. THEME ENGINE: Light (Default) & Dark with LocalStorage
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeMetaTag = document.querySelector('meta[name="theme-color"]');

  function getActiveTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}
    if (themeMetaTag) {
      themeMetaTag.setAttribute('content', theme === 'dark' ? '#06070f' : '#f8fafc');
    }
  }

  function toggleTheme() {
    const current = getActiveTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(`Switched to ${next.toUpperCase()} mode`);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  /* ==========================================================================
     2. NEURAL CANVAS: Synaptic Node Mesh
     ========================================================================== */
  const canvas = document.getElementById('neural-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000, radius: 140 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    });

    let nodes = [];
    let pulses = [];
    const NODE_COUNT = Math.min(65, Math.floor((width * height) / 22000));

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.8 + 1.2;
        this.baseAlpha = Math.random() * 0.4 + 0.25;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle mouse push
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
      draw(isDark) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (isDark) {
          ctx.fillStyle = 'rgba(167, 139, 250, ' + this.baseAlpha + ')';
          ctx.shadowColor = 'rgba(139, 92, 246, 0.6)';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = 'rgba(124, 58, 237, ' + (this.baseAlpha * 0.75) + ')';
          ctx.shadowColor = 'rgba(124, 58, 237, 0.35)';
          ctx.shadowBlur = 4;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class Pulse {
      constructor(from, to) {
        this.from = from;
        this.to = to;
        this.progress = 0;
        this.speed = Math.random() * 0.02 + 0.015;
      }
      update() {
        this.progress += this.speed;
      }
      draw(isDark) {
        const x = this.from.x + (this.to.x - this.from.x) * this.progress;
        const y = this.from.y + (this.to.y - this.from.y) * this.progress;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#22d3ee' : '#0284c7';
        ctx.shadowColor = isDark ? '#22d3ee' : '#0284c7';
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push(new Node());
      }
    }
    initNodes();

    let lastPulse = 0;
    function animate(time) {
      ctx.clearRect(0, 0, width, height);
      const isDark = getActiveTheme() === 'dark';

      // Create random synaptic pulses across nodes
      if (time - lastPulse > 650 && nodes.length > 2) {
        const i1 = Math.floor(Math.random() * nodes.length);
        const i2 = Math.floor(Math.random() * nodes.length);
        const d = Math.hypot(nodes[i1].x - nodes[i2].x, nodes[i1].y - nodes[i2].y);
        if (d > 40 && d < 180) {
          pulses.push(new Pulse(nodes[i1], nodes[i2]));
          lastPulse = time;
        }
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * (isDark ? 0.22 : 0.16);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, ' + alpha + ')' : 'rgba(99, 102, 241, ' + alpha + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update & draw pulses
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k];
        p.update();
        if (p.progress >= 1) {
          pulses.splice(k, 1);
        } else {
          p.draw(isDark);
        }
      }

      // Update & draw nodes
      nodes.forEach((n) => {
        n.update();
        n.draw(isDark);
      });

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  /* ==========================================================================
     3. CARD SPOTLIGHT EFFECT: Cursor follow highlight
     ========================================================================== */
  const spotCards = document.querySelectorAll('.spotlight-card');
  spotCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     3. AI COPILOT KNOWLEDGE BASE & ENGINE
     ========================================================================== */
  const AI_KNOWLEDGE = [
    {
      keywords: ['summary', 'who', 'overview', 'about', 'intro', 'profile', 'experience'],
      title: 'Executive Engineering Profile',
      badge: 'LEAD ENGINEER // 10+ YRS',
      response: `<strong>Vikram Sharma</strong> is a <strong>Lead Software Engineer</strong> with over 10 years of professional experience bridging high-velocity full-stack engineering and distributed cloud platform architecture.

• <strong>Core Competencies:</strong> React.js, Next.js, Node.js, TypeScript, AWS EKS, Terraform, ArgoCD, Microservices.
• <strong>Platform Architecture:</strong> Architect of the <em>Ambit</em> platform on AWS EKS—redesigned a 5-cluster, 6-VPC enterprise environment with full zero-trust namespace isolation.
• <strong>Scale & Traffic:</strong> Engineered dynamic web and real-time market data platforms for <em>CNBC-TV18</em>, scaling to millions of live users across web, mobile-web, and AMP.
• <strong>Leadership:</strong> Experienced in technical mentoring, HLD/LLD architectural designs, and automated GitOps CI/CD delivery pipelines.`
    },
    {
      keywords: ['aws', 'eks', 'cloud', 'terraform', 'kubernetes', 'k8s', 'infra', 'infrastructure', 'vpc', 'argo', 'rollout'],
      title: 'Cloud Architecture & DevOps Capabilities',
      badge: 'AWS EKS // TERRAFORM // GITOPS',
      response: `Vikram has built and operated mission-critical cloud platform infrastructure from bare zero to production scale:

• <strong>AWS EKS Multi-Cluster Topology:</strong> Solved shared-VPC security bottlenecks by designing and implementing a <strong>5-cluster, 6-VPC architecture</strong> across Dev, QA, Staging, UAT, and Production in AWS Mumbai (<code>ap-south-1</code>).
• <strong>GitOps & Zero-Downtime:</strong> Implemented <strong>ArgoCD</strong> (App-of-Apps pattern) and <strong>Argo Rollouts</strong> for automated blue/green canary deployments with instant health checks.
• <strong>Infrastructure as Code:</strong> Managed AWS resources (RDS PostgreSQL/MySQL, ElastiCache Redis, Route 53, S3, IAM Roles for Service Accounts - IRSA) using modular <strong>Terraform</strong> and Helm charts.
• <strong>High Reliability:</strong> Achieved near-zero downtime deployment pipelines integrated directly with GitLab CI/CD.`
    },
    {
      keywords: ['frontend', 'react', 'next', 'nextjs', 'typescript', 'javascript', 'ui', 'css', 'web'],
      title: 'Frontend Engineering & Web Platforms',
      badge: 'NEXT.JS // REACT // TYPESCRIPT',
      response: `With extensive full-stack mastery, Vikram crafts high-performance, accessible, and scalable frontend architectures:

• <strong>React & Next.js:</strong> 8+ years developing SSR, SSG, and ISR applications with optimized Core Web Vitals, dynamic routing, and caching.
• <strong>Real-Time Data:</strong> Developed live stock market tracking interfaces and financial data widgets for CNBC-TV18.
• <strong>Performance & SEO:</strong> Advanced AMP integration, structured Schema.org microdata, and Core Web Vitals optimization yielding top Lighthouse scores.
• <strong>Modern Standards:</strong> Clean TypeScript typing, state management, modular component design, and responsive layout architectures.`
    },
    {
      keywords: ['cnbc', 'cnbctv18', 'news', 'media', 'clevertap', 'ads', 'traffic', 'market'],
      title: 'CNBC-TV18 Media-Tech Case Study',
      badge: 'HIGH SCALE // LIVE MARKETS',
      response: `As client lead for <strong>CNBC-TV18</strong>, Vikram engineered high-traffic digital news ecosystems:

• <strong>Dynamic News Coverage:</strong> Shipped comprehensive web, mobile-web, and AMP portals for Home, Latest News, Binge Watch, Article views, Author Profiles, and Election Coverage in English & Hindi.
• <strong>Real-Time Markets:</strong> Built live stock ticker & financial charts delivering real-time quotes during high-volatility market sessions.
• <strong>Engagement & Monetization:</strong> Integrated CleverTap push notification triggers for breaking news alerts, alongside Google Ads and Taboola revenue optimization.`
    },
    {
      keywords: ['sbi', 'chat', 'canvas', 'tiff', 'igdc', 'banking', 'fintech'],
      title: 'SBI Card FinTech Innovations',
      badge: 'FINTECH // REAL-TIME CHAT',
      response: `At Innodeed Systems, Vikram led critical FinTech solutions for <strong>SBI Card</strong>:

1. <strong>Real-Time Live Chat Platform (RBI-Approved):</strong>
   • Architected a multi-agent customer support chat engine supporting simultaneous high-volume agent-to-customer sessions.
   • Built an intelligent queue routing engine with automatic load distribution, fallback queue messages, and CSAT feedback capture.
2. <strong>Image Guided Data Capture (IGDC) Plugin:</strong>
   • Built an HTML5 Canvas-based TIFF file rendering engine enabling operators to view, zoom, rotate, and extract data coordinates.
   • Implemented form pattern matching to automatically highlight relevant banking fields across digitized documents.`
    },
    {
      keywords: ['observability', 'grafana', 'loki', 'tempo', 'prometheus', 'metrics', 'tracing', 'logs'],
      title: 'Full-Stack Observability & Telemetry',
      badge: 'GRAFANA LOKI TEMPO PROMETHEUS',
      response: `Vikram designed and deployed an end-to-end cloud-native observability stack on Kubernetes:

• <strong>Metrics:</strong> <code>kube-prometheus-stack</code> collecting cluster, pod, and application health metrics with customized alerting rules.
• <strong>Log Aggregation:</strong> <strong>Grafana Loki</strong> with Promtail, backed by AWS S3 via IRSA for cost-effective log storage.
• <strong>Distributed Tracing:</strong> <strong>Grafana Tempo</strong> capturing distributed spans across Java Spring Boot microservices and Next.js frontends.
• <strong>Dashboards:</strong> Unified Grafana dashboards providing instant P95/P99 latency visibility, error rates, and cluster resource quotas.`
    },
    {
      keywords: ['hire', 'why', 'lead', 'leadership', 'salary', 'recruit', 'interview', 'role'],
      title: 'Why Hire Vikram Sharma?',
      badge: 'PROVEN TECH LEADERSHIP',
      response: `Why Vikram is a top-tier Lead Software Engineer for your organization:

1. <strong>Rare Hybrid Breadth:</strong> Deep mastery of modern full-stack application development (React/Next.js/TypeScript/Node.js) coupled with real hands-on cloud platform engineering (AWS EKS, Terraform, ArgoCD).
2. <strong>Production Resilience:</strong> Proven track record architecting platforms serving millions of requests and enterprise banking workloads (SBI Card, CNBC-TV18, Ambit).
3. <strong>Team Multiplier:</strong> Mentors engineers, writes comprehensive HLD/LLD system design documents, optimizes cloud spend, and drives best-in-class DevOps standards.
4. <strong>Immediate Availability:</strong> Open to opportunities with forward-thinking tech companies and engineering leadership teams.`
    },
    {
      keywords: ['contact', 'email', 'linkedin', 'phone', 'reach', 'location', 'where'],
      title: 'Direct Uplink & Contact Coordinates',
      badge: 'CONTACT CHANNELS',
      response: `You can reach Vikram Sharma directly via the following verified coordinates:

• <strong>Email:</strong> <a href="mailto:sharmavikram054@gmail.com" class="ai-link">sharmavikram054@gmail.com</a>
• <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/sharmavikram054/" target="_blank" rel="noopener" class="ai-link">linkedin.com/in/sharmavikram054</a>
• <strong>Personal Portfolio / Platform:</strong> <a href="https://www.vitalsaudit.com/" target="_blank" rel="noopener" class="ai-link">vitalsaudit.com</a>
• <strong>Location:</strong> Raipur, Chhattisgarh, India (Open to Remote & Hybrid Lead Roles)`
    },
    {
      keywords: ['education', 'degree', 'mca', 'bca', 'college', 'university', 'academic'],
      title: 'Academic Credentials',
      badge: 'COMPUTER SCIENCE DEGREES',
      response: `Vikram holds strong formal academic foundations in Computer Science:

• <strong>Master of Computer Applications (M.C.A.):</strong>
  Shri Shankaracharya Technical Campus (C.S.V.T.U) &middot; 2011 &ndash; 2014 &middot; <strong>79.2% (First Class with Distinction)</strong>
• <strong>Bachelor of Computer Application (B.C.A.):</strong>
  Pt. Ravishankar Shukla University &middot; 2008 &ndash; 2011 &middot; <strong>68%</strong>`
    }
  ];

  function queryAI(text) {
    const clean = text.toLowerCase().trim();
    if (!clean) {
      return AI_KNOWLEDGE[0];
    }

    let bestMatch = null;
    let highestScore = 0;

    AI_KNOWLEDGE.forEach((item) => {
      let score = 0;
      item.keywords.forEach((kw) => {
        if (clean.includes(kw)) {
          score += kw.length > 4 ? 3 : 2;
        }
      });
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    });

    if (highestScore > 0 && bestMatch) {
      return bestMatch;
    }

    // Default intelligent fallback synthesis
    return {
      title: `Synthesis for "${escapeHtml(text)}"`,
      badge: 'AI NEURAL SYNTHESIS',
      response: `Vikram Sharma brings <strong>10+ years of software leadership</strong> covering your query topic. 

His engineering trajectory spans:
• Enterprise cloud platform engineering (<strong>AWS EKS, Terraform, ArgoCD, Kubernetes</strong>)
• Production frontend architecture (<strong>React.js, Next.js, TypeScript</strong>)
• High-concurrency backend services (<strong>Node.js, Java Spring Boot microservices, REST APIs</strong>)
• FinTech security (<strong>SBI Card</strong>) and high-scale digital broadcasting (<strong>CNBC-TV18</strong>).

<em>Need a specific technical breakdown? Ask about his <strong>"AWS EKS 5-cluster design"</strong>, <strong>"CNBC live market feeds"</strong>, or contact him directly at <a href="mailto:sharmavikram054@gmail.com" class="ai-link">sharmavikram054@gmail.com</a>.</em>`
    };
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ==========================================================================
     4. AI COPILOT UI CONTROLLER
     ========================================================================== */
  const promptInput = document.getElementById('ai-prompt-input');
  const promptSubmit = document.getElementById('ai-prompt-submit');
  const promptOutput = document.getElementById('ai-output-container');
  const promptTitle = document.getElementById('ai-output-title');
  const promptBadge = document.getElementById('ai-output-badge');
  const promptBody = document.getElementById('ai-output-body');
  const promptChips = document.querySelectorAll('.prompt-chip');

  let typingInterval = null;

  function streamResponse(data) {
    if (!promptOutput) return;

    if (typingInterval) clearInterval(typingInterval);

    promptOutput.classList.remove('hidden');
    promptTitle.textContent = data.title;
    promptBadge.textContent = data.badge;

    // Typewriter effect on rendered HTML
    const fullHtml = data.response;
    promptBody.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'ai-cursor';
    cursor.textContent = '▋';

    // Parse into token chunks
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = fullHtml;
    
    // Smooth reveal
    promptBody.innerHTML = fullHtml;
    promptBody.appendChild(cursor);

    setTimeout(() => {
      cursor.remove();
    }, 900);

    promptOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function handlePromptExecution(query) {
    if (!query || !query.trim()) return;
    const result = queryAI(query);
    streamResponse(result);
  }

  if (promptSubmit && promptInput) {
    promptSubmit.addEventListener('click', () => {
      handlePromptExecution(promptInput.value);
    });

    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handlePromptExecution(promptInput.value);
      }
    });
  }

  promptChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query') || chip.textContent.trim();
      if (promptInput) {
        promptInput.value = query;
      }
      handlePromptExecution(query);
    });
  });

  // Floating AI Copilot Drawer / Modal
  const copilotFab = document.getElementById('copilot-fab');
  const copilotModal = document.getElementById('copilot-modal');
  const copilotClose = document.getElementById('copilot-modal-close');
  const copilotModalInput = document.getElementById('copilot-modal-input');
  const copilotModalSubmit = document.getElementById('copilot-modal-submit');
  const copilotChatLog = document.getElementById('copilot-chat-log');

  function openCopilotModal(initialQuery = '') {
    if (!copilotModal) return;
    copilotModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (initialQuery && copilotModalInput) {
      copilotModalInput.value = initialQuery;
      submitCopilotModalChat(initialQuery);
    } else if (copilotModalInput) {
      setTimeout(() => copilotModalInput.focus(), 150);
    }
  }

  function closeCopilotModal() {
    if (!copilotModal) return;
    copilotModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (copilotFab) {
    copilotFab.addEventListener('click', () => openCopilotModal());
  }
  if (copilotClose) {
    copilotClose.addEventListener('click', closeCopilotModal);
  }
  if (copilotModal) {
    copilotModal.addEventListener('click', (e) => {
      if (e.target === copilotModal) closeCopilotModal();
    });
  }

  function submitCopilotModalChat(query) {
    if (!query || !query.trim() || !copilotChatLog) return;

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-bubble user-bubble';
    userMsg.innerHTML = `<span class="bubble-sender">You</span><p>${escapeHtml(query)}</p>`;
    copilotChatLog.appendChild(userMsg);

    // Append AI response
    const aiResult = queryAI(query);
    const aiMsg = document.createElement('div');
    aiMsg.className = 'chat-bubble ai-bubble';
    aiMsg.innerHTML = `
      <div class="ai-bubble-meta">
        <span class="ai-badge">${escapeHtml(aiResult.badge)}</span>
        <span class="ai-bubble-title">${escapeHtml(aiResult.title)}</span>
      </div>
      <div class="ai-bubble-content">${aiResult.response}</div>
    `;
    copilotChatLog.appendChild(aiMsg);
    copilotChatLog.scrollTop = copilotChatLog.scrollHeight;

    if (copilotModalInput) copilotModalInput.value = '';
  }

  if (copilotModalSubmit && copilotModalInput) {
    copilotModalSubmit.addEventListener('click', () => {
      submitCopilotModalChat(copilotModalInput.value);
    });
    copilotModalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitCopilotModalChat(copilotModalInput.value);
      }
    });
  }

  /* ==========================================================================
     5. INTERACTIVE ARCHITECTURE & CODE DECK (Tabs + Syntax Preview)
     ========================================================================== */
  const ARCH_SNIPPETS = {
    terraform: `// AWS EKS Multi-Cluster Topology (5 Clusters / 6 VPCs)
module "eks_cluster" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "~> 19.16"

  cluster_name    = "ambit-prod-ap-south-1"
  cluster_version = "1.28"

  vpc_id          = module.vpc_prod.vpc_id
  subnet_ids      = module.vpc_prod.private_subnets

  eks_managed_node_groups = {
    platform_core = {
      instance_types = ["m6i.xlarge"]
      min_size       = 3
      max_size       = 12
      desired_size   = 6
      labels = {
        tier = "production"
        role = "microservices"
      }
    }
  }

  # Zero shared-VPC risks: Namespace isolation + IRSA
  enable_irsa = true
}`,

    rollout: `apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: ambit-core-api
  namespace: production
spec:
  replicas: 8
  strategy:
    blueGreen:
      activeService: ambit-core-active
      previewService: ambit-core-preview
      autoPromotionEnabled: false
      antiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchLabels:
                  app: ambit-core-api
      prePromotionAnalysis:
        templates:
          - templateName: http-error-rate-check
        args:
          - name: service-name
            value: ambit-core-preview`,

    observability: `// Distributed Telemetry Pipeline (Grafana + Loki + Tempo)
export interface TelemetryConfig {
  service: "ambit-spring-cloud" | "cnbc-frontend-next";
  environment: "production" | "staging";
  metrics: {
    collector: "kube-prometheus-stack";
    scrapeInterval: "15s";
    targetP99LatencyMs: 45;
  };
  tracing: {
    exporter: "OpenTelemetry-gRPC";
    tempoEndpoint: "tempo-distributor.monitoring:4317";
    samplingRatio: 0.15;
  };
  logging: {
    daemon: "Promtail";
    lokiStream: "app-logs-s3";
    retentionDays: 90;
  };
}`,

    telemetry: `{
  "system_telemetry": {
    "engineer": "Vikram Sharma",
    "status": "HEALTHY",
    "total_experience_years": 10.5,
    "uptime_rate": "99.99%",
    "active_nodes": {
      "frontend": ["React", "Next.js", "TypeScript"],
      "cloud_platform": ["AWS EKS", "Terraform", "ArgoCD", "Kubernetes"],
      "microservices": ["Java Spring Boot", "Node.js", "NestJS"],
      "observability": ["Grafana", "Loki", "Tempo", "Prometheus"]
    },
    "projects_deployed": ["Ambit EKS", "CNBC-TV18", "SBI Card IGDC", "InstaTeam"],
    "verified_domains": ["FinTech (RBI Compliant)", "Media-Tech (Millions MAU)"]
  }
}`
  };

  const archTabs = document.querySelectorAll('.deck-tab');
  const archCodeEl = document.getElementById('arch-code-display');
  const copyCodeBtn = document.getElementById('copy-code-btn');
  let currentSnippetKey = 'terraform';

  archTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      archTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const snippetKey = tab.getAttribute('data-snippet');
      currentSnippetKey = snippetKey;
      if (archCodeEl && ARCH_SNIPPETS[snippetKey]) {
        archCodeEl.textContent = ARCH_SNIPPETS[snippetKey];
      }
    });
  });

  if (copyCodeBtn && archCodeEl) {
    copyCodeBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(archCodeEl.textContent).then(() => {
        const originalText = copyCodeBtn.innerHTML;
        copyCodeBtn.innerHTML = `<span>✓ Copied</span>`;
        setTimeout(() => {
          copyCodeBtn.innerHTML = originalText;
        }, 1800);
      });
    });
  }

  /* ==========================================================================
     6. SKILL MATRIX FILTERING
     ========================================================================== */
  const skillFilters = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-node-card');

  skillFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      skillFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     7. COMMAND PALETTE (Cmd+K / Ctrl+K)
     ========================================================================== */
  const cmdPalette = document.getElementById('cmd-palette-modal');
  const cmdInput = document.getElementById('cmd-palette-input');
  const cmdItems = document.querySelectorAll('.cmd-item');
  const cmdTriggers = document.querySelectorAll('.cmd-trigger');

  function openCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (cmdInput) {
      cmdInput.value = '';
      filterCmdItems('');
      setTimeout(() => cmdInput.focus(), 100);
    }
  }

  function closeCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.remove('active');
    document.body.style.overflow = '';
  }

  function filterCmdItems(val) {
    const q = val.toLowerCase().trim();
    cmdItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  cmdTriggers.forEach((trig) => trig.addEventListener('click', openCmdPalette));

  if (cmdPalette) {
    cmdPalette.addEventListener('click', (e) => {
      if (e.target === cmdPalette) closeCmdPalette();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => filterCmdItems(e.target.value));
  }

  cmdItems.forEach((item) => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      closeCmdPalette();

      if (action === 'ask-ai') {
        const query = item.getAttribute('data-query');
        openCopilotModal(query);
      } else if (action === 'scroll') {
        const target = item.getAttribute('data-target');
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'toggle-theme') {
        toggleTheme();
      } else if (action === 'copy-email') {
        copyEmailToClipboard();
      } else if (action === 'print') {
        window.print();
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPalette && cmdPalette.classList.contains('active')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    } else if (e.key === 'Escape') {
      closeCmdPalette();
      closeCopilotModal();
    } else if (e.key === 't' || e.key === 'T') {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag !== 'input' && activeTag !== 'textarea') {
        toggleTheme();
      }
    }
  });

  /* ==========================================================================
     8. ONE-CLICK EMAIL COPY HELPER
     ========================================================================== */
  function copyEmailToClipboard() {
    const email = 'sharmavikram054@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Email copied to clipboard: ' + email);
    });
  }

  const copyEmailBtns = document.querySelectorAll('.copy-email-trigger');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      copyEmailToClipboard();
    });
  });

  // Pre-load default architecture code
  if (archCodeEl && ARCH_SNIPPETS.terraform) {
    archCodeEl.textContent = ARCH_SNIPPETS.terraform;
  }
})();
