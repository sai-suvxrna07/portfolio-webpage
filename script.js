/* Sai Ram Suvarna — cinematic portfolio interactions */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const progressBar = document.querySelector(".scroll-progress");
  const sectionIds = ["hero", "stats", "mission", "pillars", "story", "builder", "work", "connect"];

  /* ---------- Mobile nav ---------- */
  function closeNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  function openNav() {
    navLinks.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.contains("is-open");
      if (open) closeNav();
      else openNav();
    });

    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeNav());
    });
  }

  /* ---------- Wait for CDN libs ---------- */
  function whenReady(fn) {
    if (window.gsap && window.ScrollTrigger && (!reduceMotion ? window.Lenis : true)) {
      fn();
      return;
    }
    let tries = 0;
    const id = setInterval(() => {
      tries += 1;
      if (window.gsap && window.ScrollTrigger && (reduceMotion || window.Lenis)) {
        clearInterval(id);
        fn();
      } else if (tries > 80) {
        clearInterval(id);
        // Soft fallback without motion libs
        initStaticFallback();
      }
    }, 50);
  }

  function initStaticFallback() {
    document.querySelectorAll(".reveal, .reveal-load").forEach((el) => {
      el.classList.add("is-in");
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    initStats(null);
    initHeaderScroll();
  }

  whenReady(init);

  function init() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    let lenis = null;

    if (!reduceMotion && window.Lenis) {
      lenis = new window.Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
          if (arguments.length) {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });
    }

    // Smooth anchor clicks via Lenis when available
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = -parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"), 10) || -64;
        if (lenis) {
          lenis.scrollTo(target, { offset, duration: 1.15 });
        } else {
          const top = target.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
        }
      });
    });

    initLoadReveals(gsap);
    initScrollReveals(gsap, ScrollTrigger);
    initStats(ScrollTrigger);
    initVideoScrubs(gsap, ScrollTrigger);
    initActiveNav(ScrollTrigger);
    initProgress(ScrollTrigger);
    initHeaderScroll(ScrollTrigger);

    // Refresh after fonts
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
  }

  function initLoadReveals(gsap) {
    if (reduceMotion) {
      document.querySelectorAll(".reveal-load").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }
    gsap.to(".reveal-load", {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.15,
    });
  }

  function initScrollReveals(gsap, ScrollTrigger) {
    if (reduceMotion) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }
    document.querySelectorAll(".reveal").forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => el.classList.add("is-in"),
      });
    });
  }

  function initStats(ScrollTrigger) {
    const nums = document.querySelectorAll(".stat-num[data-count]");
    let done = false;

    function run() {
      if (done) return;
      done = true;
      nums.forEach((el) => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        if (reduceMotion || !window.gsap) {
          el.textContent = `${target}${suffix}`;
          return;
        }
        const obj = { val: 0 };
        window.gsap.to(obj, {
          val: target,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${Math.round(obj.val)}${suffix}`;
          },
        });
      });
    }

    const strip = document.getElementById("stats");
    if (!strip) return;

    if (ScrollTrigger && !reduceMotion) {
      ScrollTrigger.create({
        trigger: strip,
        start: "top 80%",
        once: true,
        onEnter: run,
      });
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            run();
            io.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      io.observe(strip);
    }
  }

  function bindVideoScrub(video, trigger, ScrollTrigger, opts) {
    if (!video) return;

    const ensureReady = (cb) => {
      if (video.readyState >= 1 && video.duration) {
        cb();
        return;
      }
      video.addEventListener("loadedmetadata", () => cb(), { once: true });
      // Kick load if needed
      try {
        video.load();
      } catch (_) {
        /* ignore */
      }
    };

    video.pause();
    video.muted = true;

    if (reduceMotion) {
      ensureReady(() => {
        video.currentTime = 0;
      });
      return;
    }

    ensureReady(() => {
      ScrollTrigger.create({
        trigger,
        start: opts.start || "top top",
        end: opts.end || "+=120%",
        scrub: true,
        pin: opts.pin !== false,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (!video.duration) return;
          const t = video.duration * self.progress;
          if (Math.abs(video.currentTime - t) > 0.04) {
            try {
              video.currentTime = t;
            } catch (_) {
              /* ignore seek errors on short placeholders */
            }
          }
        },
      });
    });
  }

  function initVideoScrubs(gsap, ScrollTrigger) {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    bindVideoScrub(
      document.getElementById("hero-video"),
      "#hero",
      ScrollTrigger,
      {
        // Mobile uses stacked portrait+copy; avoid long pin over type
        end: isMobile ? "bottom top" : "+=120%",
        pin: !isMobile,
        start: isMobile ? "top top" : "top top",
      }
    );

    bindVideoScrub(
      document.getElementById("builder-video"),
      "#builder",
      ScrollTrigger,
      {
        end: isMobile ? "+=70%" : "+=100%",
        pin: true,
      }
    );

    bindVideoScrub(
      document.getElementById("connect-video"),
      "#connect",
      ScrollTrigger,
      {
        end: isMobile ? "+=60%" : "+=80%",
        pin: true,
      }
    );
  }

  function initActiveNav(ScrollTrigger) {
    if (!ScrollTrigger) return;
    const links = document.querySelectorAll(".nav-links a[data-section]");
    links.forEach((link) => {
      const id = link.getAttribute("data-section");
      const section = document.getElementById(id);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            links.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        },
      });
    });
  }

  function initProgress(ScrollTrigger) {
    if (!progressBar || !ScrollTrigger) return;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        progressBar.style.width = `${self.progress * 100}%`;
      },
    });
  }

  function initHeaderScroll(ScrollTrigger) {
    const onScroll = () => {
      if (!header) return;
      const y = window.scrollY || document.documentElement.scrollTop;
      header.classList.toggle("is-scrolled", y > 24);
    };

    if (ScrollTrigger) {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          header?.classList.toggle("is-scrolled", self.scroll() > 24);
        },
      });
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  // Silence unused in lint-free env
  void sectionIds;
})();
