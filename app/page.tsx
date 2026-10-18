'use client';

import React, { useState } from 'react';
import ANXCinematicBackground from '@/components/ANXCinematicBackground';
import { motion } from 'framer-motion';

export default function Home() {
  const [selectedService, setSelectedService] = useState<'website' | 'meta_ads'>('website');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSelectService = (service: 'website' | 'meta_ads') => {
    setSelectedService(service);
    const enquiryEl = document.getElementById('contact-enquiry');
    if (enquiryEl) {
      enquiryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <main className="relative min-h-screen bg-[#08090B] text-white selection:bg-white/20 selection:text-white overflow-x-hidden">
      {/* =========================================================================
          1. THE 3D CANVAS BACKGROUND (FIXED FOR THE ENTIRE WEBSITE)
          The 3D exploded frame sequence stays permanently in the background as you
          scroll from top to bottom. It never goes away or leaves a blank gap.
          ========================================================================= */}
      <ANXCinematicBackground
        totalFrames={96}
        imageDirectory="/frames/"
        framePrefix="anx_frame_"
        bgColor="#08090B"
      />

      {/* =========================================================================
          2. MINIMALIST NAVIGATION (Fixed Top)
          ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-12 py-5 backdrop-blur-xl bg-[#08090B]/60 border-b border-white/[0.06] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/90 to-white/10 flex items-center justify-center p-[1px] shadow-sm">
            <div className="w-full h-full bg-[#08090B] rounded-[7px] flex items-center justify-center">
              <span className="font-mono text-xs font-black tracking-tighter text-white">
                ANX
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-white/90 uppercase font-sans">
              ANX VENTURE
            </span>
            <span className="text-[9px] font-mono tracking-[0.25em] text-white/40 uppercase -mt-0.5">
              TECHNOLOGY
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-white/60">
          <a href="#hero" className="hover:text-white transition-colors">Vision</a>
          <a href="#web-architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#meta-engine" className="hover:text-white transition-colors">Meta Ads</a>
          <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
          <a href="#contact-enquiry" className="hover:text-white transition-colors">Enquiry</a>
        </nav>

        <button
          type="button"
          onClick={() => handleSelectService('website')}
          className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-mono uppercase tracking-widest text-white/90 transition-all active:scale-95 cursor-pointer backdrop-blur-md"
        >
          Initiate Project
        </button>
      </header>

      {/* =========================================================================
          3. FOREGROUND CONTENT & STORY BEATS
          All content scrolls naturally over the 3D exploding/reassembling canvas background
          ========================================================================= */}
      <div className="relative z-10 w-full">

        {/* --- SCROLL SECTION 1: 0% SCROLL HERO (Centered) --- */}
        <section id="hero" className="min-h-screen w-full flex items-center justify-center px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-6 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/70">
                FRAME-ENHANCED 3D SCROLLYTELLING
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white/90 leading-[1.04] drop-shadow-2xl">
              BUILD YOUR <br />
              <span className="bg-gradient-to-b from-white via-silver-light to-silver-dark bg-clip-text text-transparent">
                DIGITAL ADVANTAGE.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-white/60 max-w-2xl font-light tracking-wide leading-relaxed">
              ANX Venture Technology — Websites that work for your business.
            </p>

            <div className="mt-12 flex flex-col items-center gap-2 text-white/30 text-xs font-mono uppercase tracking-widest">
              <span>Scroll down to deconstruct</span>
              <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
                <div className="w-1 h-2 rounded-full bg-white/70 animate-bounce" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- SCROLL SECTION 2: 30% SCROLL (Left Aligned) --- */}
        <section id="web-architecture" className="min-h-screen w-full flex items-center justify-start px-6 md:px-16 lg:px-24 py-20">
          <div className="max-w-2xl text-left backdrop-blur-md bg-[#08090B]/40 p-8 sm:p-12 rounded-3xl border border-white/[0.08]">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-accent-cyan">
                01 // SEPARATING 3D INTERFACES
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white/90 leading-[1.08]">
              YOUR VISION. <br />
              <span className="text-white/40">OUR DEVELOPMENT.</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-white/60 font-light leading-relaxed">
              High-performance responsive interfaces separating into precision-crafted 3D
              components. Built on Next.js 14, engineered for sub-second TTFB, and tailored
              to scale without friction across mobile and desktop.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold font-mono text-white/90">0.38s</p>
                <p className="text-xs text-white/40 uppercase tracking-wider mt-0.5">
                  Avg. Interaction Speed
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-white/90">99.8%</p>
                <p className="text-xs text-white/40 uppercase tracking-wider mt-0.5">
                  Lighthouse Benchmark
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SCROLL SECTION 3: 60% SCROLL (Right Aligned) --- */}
        <section id="meta-engine" className="min-h-screen w-full flex items-center justify-end px-6 md:px-16 lg:px-24 py-20">
          <div className="max-w-2xl text-right flex flex-col items-end backdrop-blur-md bg-[#08090B]/40 p-8 sm:p-12 rounded-3xl border border-white/[0.08]">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#0081FB]">
                02 // META ADS ENGINE EXPLODED
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white/90 leading-[1.08]">
              TURN ATTENTION <br />
              <span className="text-white/40">INTO OPPORTUNITY.</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-white/60 font-light leading-relaxed">
              Website development. Meta Ads. Digital growth. An exploded digital composition
              dissecting creative velocity, Conversions API attribution, and algorithmic scaling
              to turn cold impressions into enterprise revenue.
            </p>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-left">
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 block">
                  Target ROAS
                </span>
                <span className="text-xl font-bold font-mono text-emerald-400">4.8x+</span>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-left">
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 block">
                  Media Managed
                </span>
                <span className="text-xl font-bold font-mono text-white/90">$12M+</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- SCROLL SECTION 4: 90% SCROLL FINAL REASSEMBLY (Centered) --- */}
        <section className="min-h-screen w-full flex items-center justify-center px-6 py-20">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center backdrop-blur-md bg-[#08090B]/40 p-8 sm:p-14 rounded-3xl border border-white/[0.08]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-6 rounded-full bg-white/[0.05] border border-white/15 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/80">
                Components Smoothly Reassembled
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white/90 leading-[1.04]">
              LET&apos;S BUILD <br />
              <span className="bg-gradient-to-r from-white via-silver-light to-accent-cyan bg-clip-text text-transparent">
                WHAT&apos;S NEXT.
              </span>
            </h2>

            <p className="mt-6 text-base sm:text-lg text-white/60 max-w-xl font-light tracking-wide leading-relaxed">
              Equip your brand with modern web architectures and proven Meta advertising funnels
              engineered for exponential performance.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleSelectService('website')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-[#08090B] font-bold text-sm tracking-wider uppercase transition-all hover:bg-silver-light cursor-pointer"
              >
                GET YOUR WEBSITE
              </button>

              <button
                type="button"
                onClick={() => handleSelectService('meta_ads')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.05] text-white/90 border border-white/20 font-bold text-sm tracking-wider uppercase transition-all hover:bg-white/10 cursor-pointer backdrop-blur-md"
              >
                DISCUSS META ADS
              </button>
            </div>
          </div>
        </section>

        {/* --- DETAILED CAPABILITIES GRID (Over the continuous 3D background) --- */}
        <section id="capabilities" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono uppercase tracking-[0.2em] text-accent-cyan">
              Two Pillars of Dominance
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white/90">
              Engineered For Direct Business ROI.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 p-8 sm:p-12 backdrop-blur-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan block mb-4">
                Pillar 01 // Headless Engineering
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white/90 tracking-tight mb-4">
                High-Performance Website Development
              </h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6 font-light">
                Architectured with Next.js 14 App Router, sub-second TTFB, edge-rendered pages,
                and tactile micro-interactions that elevate brand trust and turn visitors into buyers.
              </p>
              <ul className="space-y-3 text-xs font-mono text-white/70 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-accent-cyan">&bull;</span> Responsive across mobile, ultra-wide, and foldable screens
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-cyan">&bull;</span> Modern headless CMS with instant publishing pipelines
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-cyan">&bull;</span> 95+ Google Core Web Vitals guarantees
                </li>
              </ul>
              <button
                type="button"
                onClick={() => handleSelectService('website')}
                className="text-xs font-mono uppercase tracking-wider text-white hover:text-accent-cyan transition-colors"
              >
                Configure Website Build &rarr;
              </button>
            </div>

            <div className="rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 p-8 sm:p-12 backdrop-blur-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#0081FB] block mb-4">
                Pillar 02 // Performance Media
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white/90 tracking-tight mb-4">
                Meta Ads Campaign Management
              </h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6 font-light">
                Scientific performance marketing across Instagram & Facebook. We build predictive
                creative pipelines, Conversions API tracking, and high-converting landers to lower CAC.
              </p>
              <ul className="space-y-3 text-xs font-mono text-white/70 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-[#0081FB]">&bull;</span> Conversions API (CAPI) server-side attribution
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0081FB]">&bull;</span> High-cadence creative velocity & hook testing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0081FB]">&bull;</span> Full-funnel budget scaling & retargeting matrices
                </li>
              </ul>
              <button
                type="button"
                onClick={() => handleSelectService('meta_ads')}
                className="text-xs font-mono uppercase tracking-wider text-white hover:text-accent-cyan transition-colors"
              >
                Scale Meta Ad Spend &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* --- TECHNICAL BENCHMARK COUNTERS --- */}
        <section id="architecture" className="py-20 border-y border-white/[0.08] bg-[#08090B]/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 sm:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-white/90">0.38s</p>
                <p className="text-xs uppercase font-mono tracking-widest text-white/40 mt-2">First Contentful Paint</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-accent-cyan">4.8x</p>
                <p className="text-xs uppercase font-mono tracking-widest text-white/40 mt-2">Avg. Meta ROAS Yield</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-white/90">100%</p>
                <p className="text-xs uppercase font-mono tracking-widest text-white/40 mt-2">Mobile Fluidity</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-emerald-400">$12M+</p>
                <p className="text-xs uppercase font-mono tracking-widest text-white/40 mt-2">Ad Spend Managed</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- INTERACTIVE ENQUIRY FORM --- */}
        <section id="contact-enquiry" className="py-32 px-6 sm:px-12 max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.01] border border-white/10 p-8 sm:p-14 backdrop-blur-2xl shadow-2xl">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-accent-cyan">
                Direct Partnership Inquiry
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/90 mt-2">
                Start Your Digital Project
              </h2>
              <p className="text-sm text-white/60 mt-3 font-light">
                Connect directly with our lead technical strategist. Expect a comprehensive review within 24 hours.
              </p>
            </div>

            {formSubmitted ? (
              <div className="text-center py-12 px-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold text-lg mb-4">
                  &check;
                </div>
                <h3 className="text-xl font-bold text-white">Inquiry Received</h3>
                <p className="text-sm text-white/70 mt-2 max-w-md mx-auto">
                  Thank you for reaching out to ANX Venture Technology. We will review your specification and get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="mt-6 text-xs font-mono uppercase tracking-widest text-accent-cyan hover:underline"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                    Select Core Objective
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedService('website')}
                      className={`py-3.5 px-4 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                        selectedService === 'website'
                          ? 'bg-white text-[#08090B] font-bold border-white'
                          : 'bg-white/[0.04] text-white/70 border-white/10 hover:border-white/30'
                      }`}
                    >
                      Website Development
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedService('meta_ads')}
                      className={`py-3.5 px-4 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                        selectedService === 'meta_ads'
                          ? 'bg-white text-[#08090B] font-bold border-white'
                          : 'bg-white/[0.04] text-white/70 border-white/10 hover:border-white/30'
                      }`}
                    >
                      Meta Ads Campaigns
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-white/40 focus:outline-none text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-white/40 focus:outline-none text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="https://company.com"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-white/40 focus:outline-none text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Project Requirements & Goals
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your brand goals, target timeline, or ad budget..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-white/40 focus:outline-none text-sm text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-white text-[#08090B] font-bold text-sm tracking-widest uppercase hover:bg-silver-light cursor-pointer transition-all"
                >
                  SUBMIT PROJECT SPECIFICATION
                </button>
              </form>
            )}
          </div>
        </section>

        {/* --- MINIMALIST FOOTER --- */}
        <footer className="py-12 px-6 sm:px-12 border-t border-white/[0.08] text-xs font-mono text-white/40 bg-[#08090B]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white/80">ANX VENTURE TECHNOLOGY</span>
              <span>&bull;</span>
              <span>High-Performance Websites & Meta Ads Acquisition</span>
            </div>
            <div className="flex items-center gap-6">
              <span>&copy; {new Date().getFullYear()} ANX Venture Technology.</span>
              <span>All Rights Reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
