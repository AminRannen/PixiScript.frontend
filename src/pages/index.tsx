import { getSession, signOut } from "next-auth/react";
import { GetServerSideProps } from "next";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ChartTest } from "@/components/ChartTest";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Sparkles, 
  Rocket, 
  Play, 
  FileText, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowRight,
  Star,
  Code,
  Wand2,
  Download,
  Share2,
  Globe
} from 'lucide-react';

export default function Home({ user }: { user: any }) {
  const { t } = useTranslation();
  const [animationStep, setAnimationStep] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [typingText, setTypingText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const scriptTypes = [
    'Marketing Scripts', 
    'Sales Pitches', 
    'Video Content', 
    'Social Media Posts',
    'Email Campaigns',
    'Product Descriptions'
  ];

  const stats = [
    { icon: FileText, value: "50K+", label: "Scripts Generated", color: "from-[#79C300] to-[#66A300]" },
    { icon: Users, value: "12K+", label: "Happy Users", color: "from-[#B7E35B] to-[#94CF33]" },
    { icon: Clock, value: "24/7", label: "AI Powered", color: "from-[#6FB200] to-[#589200]" },
    { icon: TrendingUp, value: "98%", label: "Success Rate", color: "from-[#C9EA84] to-[#B7E35B]" }
  ];

  const features = [
    {
      icon: Wand2,
      title: "AI-Powered Generation",
      description: "Transform your ideas into compelling scripts with advanced AI technology",
      gradient: "from-[#79C300] to-[#66A300]"
    },
    {
      icon: Rocket,
      title: "Lightning Fast",
      description: "Generate professional scripts in seconds, not hours",
      gradient: "from-[#B7E35B] to-[#94CF33]"
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Create scripts in multiple languages for global reach",
      gradient: "from-[#6FB200] to-[#589200]"
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Export and share your scripts with your team instantly",
      gradient: "from-[#C9EA84] to-[#B7E35B]"
    }
  ];

  // Typing animation effect
  useEffect(() => {
    const currentWord = scriptTypes[currentWordIndex];
    if (typingText.length < currentWord.length) {
      const timeout = setTimeout(() => {
        setTypingText(currentWord.slice(0, typingText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTypingText('');
        setCurrentWordIndex((prev) => (prev + 1) % scriptTypes.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [typingText, currentWordIndex]);

  useEffect(() => {
    const intervals = [
      setTimeout(() => setAnimationStep(1), 300),
      setTimeout(() => setAnimationStep(2), 600),
      setTimeout(() => setAnimationStep(3), 900),
    ];
    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#EEFBDE] via-white to-[#D6F1AD] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#B7E35B]/20 to-[#94CF33]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#79C300]/20 to-[#66A300]/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-[#EEFBDE]/30 to-[#D6F1AD]/30 rounded-full blur-3xl animate-bounce" />
        </div>

        {/* Hero Section */}
        <div className="relative z-10 pt-16 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Welcome Message with Animation */}
              <div className={`transform transition-all duration-1000 ${animationStep >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#EEFBDE] to-[#D6F1AD] rounded-full px-6 py-3 mb-8 border border-[#C9EA84]">
                  <Sparkles className="w-5 h-5 text-[#66A300] animate-spin" />
                  <span className="text-[#589200] font-medium">
                    {t("welcome")}, {user.name}! 🌱
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <div className={`transform transition-all duration-1000 delay-300 ${animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-[#79C300] via-[#66A300] to-[#6FB200] bg-clip-text text-transparent">
                    Generate
                  </span>
                  <br />
                  <span className="text-gray-800">
                    {typingText}
                    <span className="animate-pulse">|</span>
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Transform your ideas into powerful scripts with AI magic. 
                  Create compelling content that converts in seconds.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className={`transform transition-all duration-1000 delay-500 ${animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                  <Link href="/scripts/new">
                    <button className="group relative bg-gradient-to-r from-[#79C300] to-[#66A300] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                      <span className="relative z-10 flex items-center gap-2">
                        <Zap className="w-5 h-5 group-hover:animate-pulse" />
                        Create New Script
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#66A300] to-[#6FB200] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </Link>
                  
                  <Link href="/scripts">
                    <button className="group bg-white text-gray-800 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-gray-200 hover:border-[#B7E35B]">
                      <span className="flex items-center gap-2">
                        <FileText className="w-5 h-5 group-hover:text-[#79C300] transition-colors" />
                        View My Scripts
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative z-10 py-16 bg-white/50 backdrop-blur-sm border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center transform hover:scale-110 transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} mb-4 shadow-lg ${hoveredCard === index ? 'animate-pulse' : ''}`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Why Choose <span className="bg-gradient-to-r from-[#79C300] to-[#66A300] bg-clip-text text-transparent">PixiScript</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of content creation with our cutting-edge AI technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-[#79C300] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="relative z-10 py-16 bg-gradient-to-r from-[#79C300] to-[#66A300]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Ready to create amazing scripts?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scripts/new">
                <button className="bg-white text-[#79C300] px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-[#EEFBDE]">
                  <span className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Start Creating Now
                  </span>
                </button>
              </Link>
              
              <Link href="/scripts">
                <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#79C300] transform hover:scale-105 transition-all duration-300">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Browse Templates
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity or Dashboard Preview */}
        <div className="relative z-10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Quick Start</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    Last login: {new Date().toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-[#EEFBDE] to-[#D6F1AD] rounded-xl border border-[#C9EA84]">
                    <Code className="w-8 h-8 text-[#66A300] mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">Marketing Script</h4>
                    <p className="text-sm text-gray-600 mb-4">Generate compelling marketing copy</p>
                    <Link href="/scripts/new?type=marketing" className="text-[#66A300] hover:text-[#79C300] font-medium text-sm">
                      Create now →
                    </Link>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-[#D6F1AD] to-[#C9EA84] rounded-xl border border-[#B7E35B]">
                    <Star className="w-8 h-8 text-[#589200] mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">Sales Pitch</h4>
                    <p className="text-sm text-gray-600 mb-4">Craft persuasive sales presentations</p>
                    <Link href="/scripts/new?type=sales" className="text-[#589200] hover:text-[#6FB200] font-medium text-sm">
                      Create now →
                    </Link>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-[#C9EA84] to-[#B7E35B] rounded-xl border border-[#94CF33]">
                    <Globe className="w-8 h-8 text-[#4B7A00] mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">Social Media</h4>
                    <p className="text-sm text-gray-600 mb-4">Create engaging social content</p>
                    <Link href="/scripts/new?type=social" className="text-[#4B7A00] hover:text-[#589200] font-medium text-sm">
                      Create now →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  
  return {
    props: {
      user: session.user,
    },
  };
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};