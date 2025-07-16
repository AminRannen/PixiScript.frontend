import React from 'react';

export default function HeavenlyFooter() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-950 text-white">
      {/* Animated background layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Animated clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-0 w-32 h-16 bg-white/10 rounded-full blur-xl animate-pulse" 
             style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute top-8 right-20 w-24 h-12 bg-white/15 rounded-full blur-lg animate-pulse" 
             style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute bottom-8 left-1/4 w-28 h-14 bg-white/8 rounded-full blur-xl animate-pulse" 
             style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute top-12 left-1/2 w-20 h-10 bg-white/12 rounded-full blur-lg animate-pulse" 
             style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
      </div>

      {/* Golden rays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-yellow-300/60 via-yellow-200/30 to-transparent transform -skew-x-12 animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-yellow-300/40 via-yellow-200/20 to-transparent transform skew-x-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-yellow-300/50 via-yellow-200/25 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 py-16 px-8">
        {/* Divine title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-100 bg-clip-text text-transparent mb-4 animate-pulse">
            ✨ CELESTIAL REALM ✨
          </h2>
          <p className="text-xl text-blue-100 opacity-90 font-light tracking-wide">
            Where dreams ascend to infinity
          </p>
        </div>

        {/* Floating navigation */}
        <div className="flex justify-center space-x-8 mb-12">
          {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
            <a
              key={item}
              href="#"
              className="group relative px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="relative z-10 font-medium">{item}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/30 to-blue-400/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          ))}
        </div>

        {/* Glowing divider */}
        <div className="relative mb-8">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-yellow-300 to-transparent"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1 w-3 h-3 bg-yellow-300 rounded-full blur-sm animate-pulse"></div>
        </div>

        {/* Social icons with halos */}
        <div className="flex justify-center space-x-6 mb-8">
          {['💫', '🌟', '✨', '🌙', '⭐'].map((icon, index) => (
            <div
              key={index}
              className="group relative w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 cursor-pointer"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-300/50 to-yellow-400/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <span className="relative z-10 text-xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
            </div>
          ))}
        </div>

        {/* Copyright with ethereal glow */}
        <div className="text-center">
          <p className="text-blue-100/80 text-sm font-light tracking-wider mb-2">
            Crafted with divine inspiration
          </p>
          <p className="text-yellow-200/90 font-medium text-lg bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent animate-pulse">
            © 2025 • Blessed by the heavens above
          </p>
        </div>
      </div>

      {/* Bottom celestial border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-yellow-400 via-purple-500 to-blue-500 animate-pulse"></div>
      
      {/* Subtle animation overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none opacity-60 animate-pulse" style={{ animationDuration: '8s' }}></div>
    </footer>
  );
}