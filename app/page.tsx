"use client";

import React, { useState, useEffect, useRef } from "react";
// FIXED: Added useInView to imports
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { Github, Linkedin, ArrowDown, Send, ExternalLink, Code as CodeIcon, BookOpen, Database, Terminal, Instagram, Building2, Snowflake, Library, GraduationCap, Shield, Globe, Award, Cpu, CheckCircle2 } from "lucide-react";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Lenis from 'lenis';
import Image from "next/image";

// --- Fonts ---
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"] });

// --- Data ---
const personalInfo = {
  name: "Sai Ram Suvarna",
  typewriterLoops: [
    "SWE Intern @ Cencora",
    "CS @ University of Toronto",
    "Building Software Projects & Impactful Tech"
  ],
  email: "sairamsuvarna07@gmail.com",
  linkedin: "https://www.linkedin.com/in/sai-ram-suvarna-379073369",
  github: "https://github.com/sai-suvxrna07",
  instagram: "https://instagram.com/sai_suvxrna07",
  shortBio: "Merging academic rigor with real-world software engineering to build scalable, user-centric solutions.",
  longBio: "I am a Computer Science student at the University of Toronto, driven by a relentless curiosity for how complex systems are architected. From optimizing backend infrastructure in enterprise environments at Cencora to fostering innovation by organizing hackathons for hundreds of peers."
};

const experience = [
  {
    company: "Cencora",
    role: "Software Engineer Intern",
    date: "Apr 2025 - Sept 2025",
    brandColor: "bg-blue-600",
    icon: <Globe className="text-white w-6 h-6" />,
    desc: [
      "Partnered closely with a co-intern to co-develop backend features and resolve blockers, utilizing Agile methodologies to meet project deadlines.",
      "Orchestrated code updates within the CI/CD lifecycle using both TFVC and Git, ensuring seamless integration and high-quality version control across backend systems.",
      "Streamlined software delivery by pushing updates through automated DevOps pipelines and performing rigorous smoke testing to validate build stability post-deployment.",
      "Developed ASP.NET applications while managing Salesforce Security and AppOmni configurations; conducted manual penetration testing to identify and resolve security risks.",
      "Engaged in peer code reviews and collaborative troubleshooting to maintain high standards for the .NET Framework codebase."
    ],
  },
  {
    company: "Conservation Halton",
    role: "Snowboarding Instructor",
    date: "Dec 2025 - Present",
    brandColor: "bg-cyan-500",
    icon: <Snowflake className="text-white w-6 h-6" />,
    desc: [
      "Provided personalized instruction for students of all ages, ensuring safety and skill progression.",
      "Managed class logistics and provided ongoing feedback to parents regarding student development."
    ],
  },
  {
    company: "Mill Hacks",
    role: "Event Organizer",
    date: "Nov 2024 - Present",
    brandColor: "bg-purple-600",
    icon: <Terminal className="text-white w-6 h-6" />,
    desc: [
      "Led the Computer Science Club and organized the school's first hackathon, owning end-to-end planning, technical structure, and event execution.",
      "Defined problem statements, schedules, and judging criteria while coordinating students, mentors, and volunteers under real delivery deadlines.",
      "Guided participants in applying OOP, data structures, and algorithms using Python, Java, C++, JavaScript, SQL, and .NET.",
      "Enforced Git-based version control and collaborative workflows, mentoring teams on debugging, architecture decisions, and best practices."
    ],
  },
  {
    company: "Milton Library",
    role: "Student Page",
    date: "Jul 2023 - Apr 2025",
    brandColor: "bg-orange-500",
    icon: <Library className="text-white w-6 h-6" />,
    desc: [
      "Provided high-quality customer service and support to patrons of all ages in a fast-paced setting.",
      "Efficiently organized and shelved returned materials while managing walk-in patron inquiries.",
      "Tracked and organized missing or misplaced items using Excel spreadsheets to maintain accurate records.",
      "Led and coordinated library programs, such as Coding Critters and Programming TED Talks, to strengthen leadership and organizational skills."
    ],
  },
  {
    company: "Kumon",
    role: "Teaching Assistant",
    date: "Oct 2022 - Sept 2023",
    brandColor: "bg-sky-400",
    icon: <BookOpen className="text-white w-6 h-6" />,
    desc: [
      "Tutored students of various ages and ability levels to develop academic skills and confidence in mathematics and reading.",
      "Independently assigned tasks and provided tailored guidance to support individual learning progress.",
      "Communicated effectively with parents and guardians to provide ongoing feedback on student development and progression.",
      "Built strong relationships with co-workers and maintained a welcoming, professional atmosphere for all families."
    ],
  },
];

const projects = [
  {
    title: "IoT Smart Plant Monitor",
    tech: "Android (Java), ESP8266, MQTT",
    desc: "An end-to-end IoT solution bridging physical sensors with cloud infra. Real-time data visualization of soil/light levels.",
    status: "Published on Google Play Store",
    color: "from-emerald-900 to-teal-950"
  },
  {
    title: "High-Performance Portfolio",
    tech: "Next.js 14, TypeScript, Tailwind",
    desc: "Server-side rendered portfolio engineered for max performance. Features advanced scroll-linked animations.",
    status: "Live Deployment",
    color: "from-indigo-900 to-purple-950"
  },
  {
    title: "Project in the Works",
    tech: "Stealth Mode",
    desc: "Something extraordinary is currently being engineered. Stay tuned for a major update coming soon.",
    status: "In Development",
    color: "from-red-600 to-red-950"
  },
];

const skills = {
  languages: ["Python", "Java", "C++", "JavaScript", "TypeScript", "C#", "HTML/CSS", "SQL"],
  Frameworks: ["React", "Next.js", "Node.js", ".NET", "Git", "Docker", "Salesforce Admin"],
  AI_Data: ["Pandas", "NumPy", "PyTorch", "Machine Learning Concepts", "Data Structures"]
};

// --- Custom Hooks ---
const useLooperTypewriter = (phrases: string[], typingSpeed = 50, deletingSpeed = 30, pauseDuration = 2000) => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeedState, setTypingSpeedState] = useState(typingSpeed);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const i = loopNum % phrases.length;
    const fullText = phrases[i];

    const handleTyping = () => {
      setTypingSpeedState(isDeleting ? deletingSpeed : typingSpeed);
      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
      } else {
        setText(fullText.substring(0, text.length + 1));
      }
      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };
    timer = setTimeout(handleTyping, typingSpeedState);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, phrases, typingSpeed, deletingSpeed, pauseDuration, typingSpeedState]);

  return text;
};

// --- COMPONENTS ---

// 1. Floating Nav
const FloatingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToId = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div 
      initial={{ y: -100 }} animate={{ y: 0 }} transition={{ delay: 0.5, type: "spring" }}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center py-4 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}
    >
      <div className={`flex items-center justify-between px-6 py-2.5 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-full shadow-lg transition-all ${scrolled ? "scale-90" : "scale-100"}`}>
        <span 
            onClick={() => scrollToId('hero')}
            className={`text-white font-bold tracking-tight ${spaceGrotesk.className} mr-8 cursor-pointer`}
        >
            SR.
        </span>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-neutral-400">
          <button onClick={() => scrollToId('hero')} className="hover:text-white transition-colors">Home</button>
          {["About", "Skills", "Experience", "Projects"].map((item) => (
            <button key={item} onClick={() => scrollToId(item.toLowerCase())} className="hover:text-white transition-colors">
              {item}
            </button>
          ))}
        </nav>
        <button 
            onClick={() => scrollToId('contact')}
            className="ml-8 px-4 py-1.5 text-sm font-bold bg-white text-black rounded-full hover:bg-purple-200 transition-colors"
        >
          Connect
        </button>
      </div>
    </motion.div>
  );
};

// 2. Fireflies (White & Faster)
const FirefliesBackground = React.memo(() => {
  const fireflies = [...Array(25)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    // Faster: 5s to 10s duration
    duration: Math.random() * 5 + 5, 
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {fireflies.map((ff) => (
        <motion.div
          key={ff.id}
          // Changed to bg-white
          className="absolute bg-white rounded-full blur-[2px] opacity-70"
          style={{
              width: ff.size,
              height: ff.size,
              left: `${ff.left}%`,
              top: `${ff.top}%`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, 0], 
            y: [0, Math.random() * 200 - 100, 0], 
            opacity: [0.3, 0.9, 0.3], // Higher opacity for visibility
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: ff.duration,
            repeat: Infinity,
            delay: ff.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
});
FirefliesBackground.displayName = "FirefliesBackground";

const UofTHeaderLogo = () => (
  <motion.div 
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", delay: 0.3 }}
    className="flex items-center gap-4 mb-12 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl relative z-20 group hover:bg-white/10 transition-colors cursor-default"
  >
    <div className="w-16 h-16 bg-[#002A5C] rounded-xl flex items-center justify-center border border-blue-500/30 shadow-[0_0_30px_rgba(0,42,92,0.4)] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
       <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10" />
       <Shield className="w-8 h-8 text-white z-10" fill="currentColor" strokeWidth={0} />
       <BookOpen className="w-4 h-4 text-[#002A5C] absolute top-[26px] z-20" fill="white" strokeWidth={0} />
    </div>
    <div className={`text-left flex flex-col justify-center ${spaceGrotesk.className}`}>
        <div className="text-xl md:text-2xl font-black text-white leading-none tracking-tight">University of</div>
        <div className="text-xl md:text-2xl font-black text-[#699BF7] leading-none tracking-tight group-hover:text-white transition-colors">Toronto</div>
    </div>
  </motion.div>
);

const HeroSection = () => {
  const typedText = useLooperTypewriter(personalInfo.typewriterLoops);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
        
        {/* Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />
        
        {/* Fireflies Animation */}
        <FirefliesBackground />
        
        <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 flex flex-col items-center">
            
            <UofTHeaderLogo />
            
            <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={`${spaceGrotesk.className} text-6xl md:text-9xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50`}
            >
              {personalInfo.name}
            </motion.h1>

            <div className="w-full h-1.5 md:w-[600px] bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 rounded-full mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 blur-[15px] opacity-60"></div>
            </div>

            <div className="h-8 mb-6 flex justify-center items-center">
                <span className={`text-xl md:text-2xl text-purple-300 font-mono ${jetbrains.className}`}>
                    {typedText}
                    <span className="animate-pulse ml-1">|</span>
                </span>
            </div>

            <p className="text-neutral-400 max-w-lg mx-auto text-lg mb-8 leading-relaxed">{personalInfo.shortBio}</p>
            
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="absolute bottom-10 text-neutral-500">
                <ArrowDown size={24} />
            </motion.div>
        </motion.div>
    </section>
  );
};

const TypewriterEffect = ({ text, progress }: { text: string, progress: any }) => {
    const [currentText, setCurrentText] = useState("");
    useEffect(() => {
       const unsub = progress.on("change", (latest: number) => {
           const val = Math.max(0, Math.min(1, (latest - 0.2) / 0.6));
           setCurrentText(text.substring(0, Math.round(val * text.length)));
       });
       return () => unsub();
    }, [progress, text]);

    return <pre className="text-emerald-400 text-sm md:text-base whitespace-pre-wrap">{currentText}<span className="animate-pulse">_</span></pre>;
};

const KeyboardParallaxDivider = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const keyboardY = useTransform(scrollYProgress, [0, 1], ["20%", "-30%"]);
  const keyboardOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);
  const keyboardScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  const codeSnippet = `class Engineer {
  constructor(name) {
    this.name = "${personalInfo.name}";
    this.stack = ["React", "Node", "AWS"];
  }
  async build() {
    return "Future Shipped.";
  }
}`;

  return (
    <div ref={containerRef} className="h-[250vh] relative z-20 pointer-events-none -mt-[20vh] overflow-hidden">
      <motion.div style={{ y: keyboardY, opacity: keyboardOpacity, scale: keyboardScale }} className="sticky top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full">
        <svg width="800" height="300" viewBox="0 0 800 300" fill="none" className="opacity-50">
          <rect x="10" y="10" width="780" height="280" rx="20" className="fill-neutral-900/80 stroke-neutral-700" strokeWidth="2" />
          {[...Array(30)].map((_, i) => {
             const isLit = (i % 3 === 0) ? 0.8 : 0.2; 
             return <rect key={i} x={40 + (i % 10) * 75} y={40 + Math.floor(i / 10) * 75} width="60" height="60" rx="8" className="fill-purple-500" fillOpacity={isLit} />
          })}
        </svg>
        <div className={`mt-12 p-8 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl ${jetbrains.className}`}>
            <TypewriterEffect text={codeSnippet} progress={scrollYProgress} />
        </div>
      </motion.div>
    </div>
  );
};

// --- BENTO GRID SECTION ---
const BentoGridSection = () => {
    return (
        <section id="about" className="py-24 px-6 relative z-20">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Bio */}
                    <div className="md:col-span-2 p-8 bg-neutral-900/50 border border-white/10 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                        <span className="text-purple-400 font-mono mb-4 block tracking-wider text-sm">01. THE MISSION</span>
                        <h2 className={`${spaceGrotesk.className} text-3xl md:text-4xl font-bold mb-4 text-white`}>Engineering with Purpose.</h2>
                        <p className="text-neutral-400 leading-relaxed text-lg">
                            {personalInfo.longBio}
                        </p>
                    </div>

                    {/* AI/ML Certification */}
                    <div className="p-8 bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/10 rounded-3xl relative overflow-hidden flex flex-col justify-between group">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            {/* Circuit Stream Logo via Google Favicon */}
                            <img 
                                src="https://www.google.com/s2/favicons?domain=circuitstream.com&sz=128" 
                                alt="Circuit Stream" 
                                className="w-16 h-16 opacity-50 grayscale group-hover:grayscale-0 transition-all"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="text-yellow-500" />
                                <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Verified Credential</span>
                            </div>
                            <h3 className={`${spaceGrotesk.className} text-2xl font-bold text-white leading-tight`}>AI/ ML with Python</h3>
                            <p className="text-xs text-neutral-500 mt-1">Run by Circuit Stream</p>
                        </div>
                        <div className="mt-6">
                            <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span>Pandas & PyTorch</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span>TensorFlow</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span>Gemini API Integration</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-500/20 blur-[40px] rounded-full group-hover:bg-yellow-500/30 transition-colors" />
                    </div>

                    {/* Education */}
                    <div className="p-8 bg-neutral-900/50 border border-white/10 rounded-3xl flex flex-col justify-center items-center text-center relative overflow-hidden group">
                         <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"/>
                         <GraduationCap size={40} className="text-blue-400 mb-4" />
                         <div className={`${spaceGrotesk.className} text-4xl font-bold text-white mb-1`}>2029</div>
                         <div className="text-sm text-neutral-500 uppercase tracking-wider">UofT Grad Year</div>
                         <div className="text-xs text-neutral-600 mt-2">BSc Computer Science</div>
                    </div>

                    {/* Stats */}
                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div className="p-6 bg-neutral-900/50 border border-white/10 rounded-3xl flex items-center gap-4 group hover:border-purple-500/30 transition-colors">
                            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-full group-hover:scale-110 transition-transform">
                                <Terminal size={24} />
                            </div>
                            <div>
                                <div className={`${spaceGrotesk.className} text-3xl font-bold text-white`}>2x</div>
                                <div className="text-xs text-neutral-500 uppercase">Hackathon Wins</div>
                            </div>
                        </div>
                        <div className="p-6 bg-neutral-900/50 border border-white/10 rounded-3xl flex items-center gap-4 group hover:border-blue-500/30 transition-colors">
                            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-full group-hover:scale-110 transition-transform">
                                <Database size={24} />
                            </div>
                            <div>
                                <div className={`${spaceGrotesk.className} text-3xl font-bold text-white`}>100+</div>
                                <div className="text-xs text-neutral-500 uppercase">Students Mentored</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

const SkillsSection = () => (
    <section id="skills" className="relative z-30 bg-neutral-950 py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
            <SectionTitle number="02" title="Technical Arsenal" />
            <div className="grid md:grid-cols-3 gap-8 mt-16">
                <SkillCategory title="Languages" skills={skills.languages} icon={<CodeIcon />} />
                <SkillCategory title="Frameworks" skills={skills.Frameworks} icon={<Terminal />} />
                <SkillCategory title="AI & Data" skills={skills.AI_Data} icon={<Database />} />
            </div>
        </div>
    </section>
);

const SkillCategory = ({ title, skills, icon }: any) => (
    <div className="bg-neutral-900/30 p-8 rounded-3xl border border-white/10 hover:bg-neutral-900/50 transition-colors">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-900/30 text-purple-300 rounded-xl">{icon}</div>
            <h3 className={`${spaceGrotesk.className} text-xl font-bold`}>{title}</h3>
        </div>
        <div className="flex flex-wrap gap-3">
            {skills.map((skill: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-white/5 text-sm text-neutral-300 rounded-full border border-white/10 hover:text-white hover:border-white/30 cursor-default transition-all">
                    {skill}
                </span>
            ))}
        </div>
    </div>
);

// --- LARGE APPLE PENCIL ANIMATION ---
const PencilParallaxDivider = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
    const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

    return (
      <div ref={containerRef} className="h-[200vh] relative z-20 pointer-events-none overflow-visible">
        {/* Curved Path */}
        <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-visible max-w-4xl" viewBox="0 0 800 1200" fill="none">
          <motion.path 
            d="M 400 0 Q 600 300, 200 600 T 400 1200" 
            stroke="url(#pencil_gradient)" 
            strokeWidth="6" 
            strokeLinecap="round"
            style={{ pathLength }}
          />
           <defs>
            <linearGradient id="pencil_gradient" x1="400" y1="0" x2="400" y2="1200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A855F7" />
            <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
        </svg>

        {/* Realistic Large Apple Pencil */}
        <motion.div 
            style={{
                offsetPath: "path('M 400 0 Q 600 300, 200 600 T 400 1200')", 
                offsetDistance: useTransform(pathLength, [0,1], ["0%", "100%"]),
                zIndex: 50
            }} 
            className="absolute top-0 left-0 -ml-6 -mt-[16rem] origin-bottom rotate-[20deg]"
        >
             {/* Pencil Body */}
             <div className="w-12 h-[20rem] bg-gradient-to-l from-gray-100 to-white rounded-t-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center relative border border-gray-200">
                {/* Connector Ring */}
                <div className="w-full h-2 bg-gray-300 mt-auto mb-8" />
                
                {/* Tapered Tip */}
                <div className="absolute -bottom-8 w-0 h-0 border-l-[24px] border-r-[24px] border-t-[32px] border-l-transparent border-r-transparent border-t-white" />
                
                {/* Nib */}
                <div className="absolute -bottom-[2.2rem] w-3 h-3 bg-gray-400 rounded-full" />
             </div>
        </motion.div>
      </div>
    );
};

const ExperienceSection = () => (
  <section id="experience" className="relative z-30 bg-neutral-950 pb-32 pt-12 px-6">
    <div className="max-w-4xl mx-auto">
      <SectionTitle number="03" title="Professional Journey" center />
      <div className="mt-24 relative pl-8 md:pl-0">
        <div className="absolute left-8 md:left-12 top-0 bottom-0 w-px bg-neutral-800"></div>
        {experience.map((job, idx) => (
          <div key={idx} className="relative mb-16 pl-24 md:pl-32">
            <div className={`absolute left-0 md:left-4 top-0 w-16 h-16 rounded-full border-4 border-neutral-800 shadow-xl z-10 flex items-center justify-center overflow-hidden p-2 ${job.brandColor}`}>
                 {job.icon}
            </div>
            <div className="flex flex-col items-start">
               <span className={`inline-block px-4 py-2 mb-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neutral-400 ${jetbrains.className}`}>
                  {job.date}
               </span>
               <h3 className={`${spaceGrotesk.className} text-2xl font-bold text-white`}>{job.company}</h3>
               <h4 className="text-purple-300 text-lg font-medium mb-4">{job.role}</h4>
               <ul className="space-y-3">
                  {job.desc.map((item: string, i: number) => (
                  <li key={i} className="text-neutral-400 leading-relaxed text-sm flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                      {item}
                  </li>
                  ))}
               </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProjectsSection = () => (
  <section id="projects" className="relative z-30 bg-neutral-950 py-32 px-6 border-t border-white/5">
    <div className="max-w-6xl mx-auto">
      <SectionTitle number="04" title="Selected Works" />
      <div className="grid md:grid-cols-2 gap-8 mt-16">
        {projects.map((project, idx) => (
          <ProjectCard key={idx} project={project} index={idx} />
        ))}
      </div>
    </div>
  </section>
);

const ProjectCard = ({ project, index }: any) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ y: -10 }}
            className={`group relative h-[500px] rounded-[40px] overflow-hidden bg-gradient-to-br ${project.color} p-8 flex flex-col justify-between border border-white/10`}
        >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-500" />
            <div className="relative z-10">
                <div className="flex flex-col items-start gap-3 mb-6">
                    <span className={`inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-white ${jetbrains.className}`}>
                        {project.tech}
                    </span>
                    {project.status.includes("Google Play") && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                            <ExternalLink size={12} /> {project.status}
                        </span>
                    )}
                </div>
                <h3 className={`${spaceGrotesk.className} text-4xl font-bold text-white mb-4 leading-tight`}>{project.title}</h3>
                <p className="text-white/80 text-base leading-relaxed max-w-md">{project.desc}</p>
            </div>
            <div className="relative h-48 bg-neutral-950 rounded-t-3xl border-t border-x border-white/20 translate-y-24 group-hover:translate-y-12 transition-transform duration-500 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-neutral-900">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                </div>
                <div className="p-6 text-neutral-700 font-mono text-sm">
                    <span className="text-purple-400">System Ready.</span><span className="animate-pulse">_</span>
                </div>
            </div>
        </motion.div>
    )
}

const LiveFeedSection = () => {
    const [comments, setComments] = useState([
        { user: "Alex Chen", text: "Impressive portfolio! The parallax effects are top-notch.", time: "2m ago" },
        { user: "Sarah J.", text: "Love the IoT project realization. Very clean implementation.", time: "1h ago" },
    ]);
    const [input, setInput] = useState("");
    
    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        if(!input.trim()) return;
        setComments([{ user: "Visitor", text: input, time: "Just now" }, ...comments]);
        setInput("");
    };

    return (
        <section className="relative z-30 bg-neutral-950 py-32 px-6 border-t border-white/5">
             <div className="max-w-3xl mx-auto">
                <SectionTitle number="05" title="Live Feed" center />
                <form onSubmit={handlePost} className="relative mb-12">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full bg-neutral-900 rounded-full border border-neutral-800 py-4 pl-8 pr-16 text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-colors disabled:opacity-50" disabled={!input.trim()}>
                        <Send size={18} />
                    </button>
                </form>
                <div className="space-y-6 relative">
                     <div className="absolute left-6 top-0 bottom-0 w-px bg-neutral-800 z-0"></div>
                    <AnimatePresence>
                        {comments.map((comment, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative z-10 flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-lg font-bold border-2 border-neutral-950 shrink-0">
                                    {comment.user.charAt(0)}
                                </div>
                                <div className="bg-neutral-900/50 border border-white/10 p-4 rounded-2xl rounded-tl-none flex-grow">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="font-bold text-white">{comment.user}</h4>
                                        <span className="text-xs text-neutral-500">{comment.time}</span>
                                    </div>
                                    <p className="text-neutral-300 leading-relaxed">{comment.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
             </div>
        </section>
    );
}

const DedicatedFooter = () => (
  <footer id="contact" className="relative z-30 bg-neutral-950 pt-32 pb-8 px-6 overflow-hidden">
    <div className={`absolute bottom-32 left-1/2 -translate-x-1/2 text-[15vw] leading-none font-black text-neutral-900 select-none pointer-events-none whitespace-nowrap ${spaceGrotesk.className}`}>
        EXTRAORDINARY
    </div>

    <div className="max-w-6xl mx-auto relative z-10 mb-24 flex flex-col md:flex-row items-end justify-between gap-16">
        <div>
            <h2 className={`${spaceGrotesk.className} text-6xl md:text-8xl font-black text-white leading-none mb-8`}>
                Let's build the<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-gradient-x">
                    extraordinary.
                </span>
            </h2>
            <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-3 text-2xl hover:text-purple-400 transition-colors group font-medium">
                {personalInfo.email}
                <ExternalLink size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
        </div>
        <div className="flex gap-4">
            <SocialBtn icon={<Linkedin size={24} />} href={personalInfo.linkedin} />
            <SocialBtn icon={<Github size={24} />} href={personalInfo.github} />
            <SocialBtn icon={<Instagram size={24} />} href={personalInfo.instagram} />
        </div>
    </div>

    <div className="max-w-6xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
        <div className="flex gap-6 mb-4 md:mb-0">
            <a href={personalInfo.github} target="_blank" className="hover:text-white transition-colors">GitHub</a>
            <a href={personalInfo.linkedin} target="_blank" className="hover:text-white transition-colors">LinkedIn</a>
            <a href={personalInfo.instagram} target="_blank" className="hover:text-white transition-colors">Instagram</a>
        </div>
        <p>© {new Date().getFullYear()} Sai Ram Suvarna. Crafted with Next.js & Framer Motion.</p>
    </div>
  </footer>
);

const SectionTitle = ({ number, title, center }: any) => (
    <div className={`mb-16 ${center ? 'text-center' : ''}`}>
        <span className="text-purple-400 font-mono mb-4 block tracking-wider">{number}.</span>
        <h2 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold`}>{title}</h2>
    </div>
)

const SocialBtn = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
  <a href={href} target="_blank" className="p-4 bg-white/5 rounded-full hover:bg-white/10 hover:scale-110 hover:border-purple-500/50 transition-all border border-white/10 text-white">
    {icon}
  </a>
);

// --- MAIN EXPORT AT THE BOTTOM ---
export default function Portfolio() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <div className={`bg-neutral-950 text-white overflow-x-hidden ${inter.className} selection:bg-purple-500/30`}>
      <FloatingNav />
      <HeroSection />
      <KeyboardParallaxDivider />
      <BentoGridSection />
      <SkillsSection />
      <PencilParallaxDivider />
      <ExperienceSection />
      <ProjectsSection />
      <LiveFeedSection />
      <DedicatedFooter />
    </div>
  );
}

