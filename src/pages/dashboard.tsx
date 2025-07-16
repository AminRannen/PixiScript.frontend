import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { ChartTest } from "@/components/ChartTest";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Globe,
  Sparkles,
  Activity,
  Target,
  Star,
  Layers,
  Compass,
  Briefcase
} from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      console.warn("Access token expired and refresh failed. Signing out...");
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-tertiary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-8"></div>
            <Sparkles className="w-12 h-12 text-primary-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-2xl text-gray-600 font-medium">Crafting your experience...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+12.5%",
      icon: TrendingUp,
      gradient: "from-primary-400 via-primary-500 to-primary-600",
      bgGradient: "from-primary-50 via-primary-100 to-primary-200/50"
    },
    {
      title: "Active Users",
      value: "12,384",
      change: "+8.2%",
      icon: Users,
      gradient: "from-blue-400 via-blue-500 to-blue-600",
      bgGradient: "from-blue-50 via-blue-100 to-blue-200/50"
    },
    {
      title: "Performance",
      value: "98.5%",
      change: "+2.1%",
      icon: Zap,
      gradient: "from-tertiary-400 via-tertiary-500 to-tertiary-600",
      bgGradient: "from-tertiary-50 via-tertiary-100 to-tertiary-200/50"
    },
    {
      title: "Projects",
      value: "47",
      change: "+15.3%",
      icon: Briefcase,
      gradient: "from-pink-400 via-pink-500 to-pink-600",
      bgGradient: "from-pink-50 via-pink-100 to-pink-200/50"
    }
  ];

  const features = [
    { 
      title: "Analytics Hub", 
      description: "Deep insights into your data",
      icon: BarChart3, 
      gradient: "from-primary-500 to-primary-600",
      bgGradient: "from-primary-50 to-primary-100"
    },
    { 
      title: "Team Collaboration", 
      description: "Connect and create together",
      icon: Users, 
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    { 
      title: "Project Management", 
      description: "Organize your workflow",
      icon: Target, 
      gradient: "from-tertiary-500 to-tertiary-600",
      bgGradient: "from-tertiary-50 to-tertiary-100"
    },
    { 
      title: "Global Reach", 
      description: "Expand your horizons",
      icon: Globe, 
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-50 to-pink-100"
    }
  ];
  // Show loading state while checking auth and roles
  if (status !== "authenticated" || !session?.user?.roles?.includes("admin")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-tertiary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-8"></div>
            <Sparkles className="w-12 h-12 text-primary-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-2xl text-gray-600 font-medium">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <PrivateLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-blue-50/40 relative overflow-hidden">
        
        {/* Stunning Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large floating orbs */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-primary-300/30 to-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-tertiary-300/25 to-pink-300/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-r from-blue-300/20 to-primary-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-300/15 to-tertiary-300/15 rounded-full blur-3xl animate-pulse delay-1500"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>

        <div className="relative z-10 px-12 py-16">
          
          {/* Hero Header */}
          <div className={`text-center mb-20 transition-all duration-1500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 via-primary-600 to-blue-600 rounded-full shadow-2xl mb-8">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-6">
              Welcome Back, {session?.user?.name?.split(' ')[0] || 'Visionary'}
            </h1>
            
            <p className="text-2xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              Your digital command center awaits. Every metric, every insight, 
              <span className="text-primary-600 font-medium"> perfectly orchestrated</span>.
            </p>
            
            <div className="flex items-center justify-center space-x-6 mt-8 text-lg text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-pulse"></div>
                <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="font-mono">{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Stats Grid - More Spacious */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20 transition-all duration-1500 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className={`group relative p-10 bg-gradient-to-br ${stat.bgGradient} rounded-3xl backdrop-blur-sm border border-white/60 hover:border-white/80 shadow-xl hover:shadow-2xl transition-all duration-700 hover:scale-105 cursor-pointer`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className={`p-5 bg-gradient-to-r ${stat.gradient} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-gray-600 text-lg font-medium">{stat.title}</p>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>

          {/* Main Content - Chart Section */}
          <div className={`mb-20 transition-all duration-1500 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/60 hover:shadow-3xl transition-all duration-700">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Performance Analytics</h2>
                <p className="text-xl text-gray-600">Real-time insights into your success story</p>
              </div>
              
              <div className="relative">
                <ChartTest />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r from-tertiary-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 transition-all duration-1500 delay-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group relative p-8 bg-gradient-to-br ${feature.bgGradient} rounded-2xl backdrop-blur-sm border border-white/50 hover:border-white/70 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-xl shadow-md`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Hero Section */}
          <div className={`transition-all duration-1500 delay-900 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            <div className="relative bg-gradient-to-r from-primary-600 via-blue-600 to-tertiary-600 rounded-3xl p-16 text-white overflow-hidden shadow-2xl">
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10 text-center space-y-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold">Your Journey Continues</h3>
                <p className="text-2xl text-blue-100 font-light max-w-3xl mx-auto leading-relaxed">
                  Every great achievement starts with the decision to try. 
                  Your dashboard is more than numbers—it's your story of growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}