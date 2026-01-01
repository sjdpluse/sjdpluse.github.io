import React, { useState, useEffect, useCallback, memo } from "react";
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import AOS from "aos";
import "aos/dist/aos.css";

/* =========================
   UI COMPONENTS
========================= */

const StatusBadge = memo(() => (
  <div className="inline-block animate-float" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000" />
      <div className="relative px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text text-sm font-medium flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
          Visual Content & Multimedia Specialist
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight">
      <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
        Creative
      </span>
      <span className="block mt-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
        Media Specialist
      </span>
    </h1>
  </div>
));

const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700" />
      <div className="relative h-11 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden">
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium">
            {text}
          </span>
          <Icon className="w-4 h-4 text-gray-200 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="group relative p-3">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300" />
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 border border-white/10 group-hover:border-white/20">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

/* =========================
   CONSTANTS
========================= */

const WORDS = [
  "Graphic Designer & Media Producer",
  "Visual Content Specialist",
  "AI-Enhanced Creative Professional",
  "Academic & Digital Branding Expert",
  "Tech-Driven Storyteller"
];

const TECH_STACK = [
  "Graphic Design (Photoshop, Illustrator)",
  "Photography & Videography",
  "Video Editing (Premiere Pro, After Effects)",
  "Content Production for Digital Media",
  "AI Tools & Automation",
  "Database & Digital Systems",
  "Digital Marketing & Branding"
];

const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/sjdpluse" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/sajad-ali-mohammadi-659028380/" },
  { icon: Instagram, link: "https://www.instagram.com/thedorcci" }
];

/* =========================
   MAIN COMPONENT
========================= */

const Home = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    AOS.init({ once: true, offset: 10 });
  }, []);

  const handleTyping = useCallback(() => {
    const currentWord = WORDS[wordIndex];

    if (isTyping) {
      if (charIndex < currentWord.length) {
        setText(prev => prev + currentWord[charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timer = setTimeout(handleTyping, isTyping ? 90 : 45);
    return () => clearTimeout(timer);
  }, [handleTyping, isTyping]);

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden px-[5%] lg:px-[10%]" id="Home">
      <div className="container mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-center gap-16">
        
        {/* LEFT */}
        <div className="w-full lg:w-1/2 space-y-8 text-left" data-aos="fade-right">
          <StatusBadge />
          <MainTitle />

          <div className="h-8 flex items-center">
            <span className="text-xl md:text-2xl text-gray-300 font-light">{text}</span>
            <span className="w-[3px] h-6 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink" />
          </div>

          <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed">
            I create professional visual content for educational institutions,
            academic events, and digital platforms — combining graphic design,
            photography, videography, and modern technology to deliver impactful
            and user-centered results.
          </p>

          <div className="flex flex-wrap gap-3">
            {TECH_STACK.map((tech, i) => (
              <TechStack key={i} tech={tech} />
            ))}
          </div>

          <div className="flex gap-3">
            <CTAButton href="#Portfolio" text="Projects" icon={ExternalLink} />
            <CTAButton href="#Contact" text="Contact" icon={Mail} />
          </div>

          <div className="hidden sm:flex gap-4">
            {SOCIAL_LINKS.map((s, i) => (
              <SocialLink key={i} {...s} />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 h-[500px] flex items-center justify-center" data-aos="fade-left">
          <DotLottieReact
            src="https://lottie.host/58753882-bb6a-49f5-a2c0-950eda1e135a/NLbpVqGegK.lottie"
            loop
            autoplay
            className="w-full h-full opacity-90"
          />
        </div>

      </div>
    </div>
  );
};

export default memo(Home);
