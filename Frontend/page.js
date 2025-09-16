"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Users, 
  BarChart3, 
  Calendar, 
  Zap, 
  Shield,
  ChevronRight,
  Star,
  Award,
  Globe,
  Rocket,
  Brain,
  TrendingUp,
  Clock,
  MessageSquare
} from "lucide-react";
import taskManagement from './business-task-management-illustration-concept_701961-3283.avif';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 text-slate-900 font-[Inter] text-[12px]">
      {/* Floating Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-8 right-8 w-80 h-80 rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 opacity-15 blur-3xl animate-pulse z-0" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center px-2 py-1 rounded-full font-medium bg-indigo-100 text-indigo-700 mb-4">
            <Award className="h-3 w-3 mr-1 text-indigo-600" />
            Trusted by Fortune 500 companies
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Streamline Workflows with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Intelligent Task Management
            </span>
          </h1>
          <p className="text-slate-600 mb-6 max-w-md leading-relaxed">
            TaskFlow empowers teams to organize, prioritize, and execute projects with precision. Our AI-powered platform adapts to your workflow, delivering unparalleled productivity and collaboration.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              href="/register"
              className="group relative px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center"
            >
              Start Free Trial
              <ChevronRight className="ml-1 w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/demo"
              className="group px-6 py-3 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transform hover:scale-105 transition-all duration-200 flex items-center"
            >
              Watch Demo
              <Rocket className="ml-1 w-4 h-4 text-indigo-600 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center shadow-sm"></div>
              ))}
            </div>
            <div className="text-slate-500">
              <span className="font-semibold text-slate-700">50,000+</span> professionals trust our platform
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -top-4 -right-4 w-full h-full rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 -z-10"></div>
          <Image
            src={taskManagement}
            alt="Task Management Dashboard"
            className="rounded-xl shadow-xl max-w-full h-auto border border-slate-200"
            width={600}
            height={400}
            priority
          />
          <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-lg shadow-md border border-slate-100">
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 text-indigo-600 mr-1" />
              <span className="font-medium text-slate-700">Tasks completed</span>
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">92%</div>
          </div>
          <div className="absolute -top-4 -right-4 bg-white p-2 rounded-lg shadow-md border border-slate-100 flex items-center">
            <CheckCircle className="h-5 w-5 text-indigo-600 mr-2" />
            <div>
              <div className="font-medium text-slate-700">Productivity</div>
              <div className="text-slate-500">+48% this month</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Logo Cloud Section */}
      <div className="relative z-10 bg-white py-12 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-center font-semibold uppercase text-slate-500 tracking-wide mb-6">
            Trusted by industry leaders worldwide
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-6">
            {[
              { name: "TechCorp", logo: <Globe className="h-8 w-8 text-indigo-600" /> },
              { name: "InnovateCo", logo: <Award className="h-8 w-8 text-indigo-600" /> },
              { name: "Global Solutions", logo: <Star className="h-8 w-8 text-indigo-600" /> },
              { name: "FutureTech", logo: <Rocket className="h-8 w-8 text-indigo-600" /> },
              { name: "SecureSys", logo: <Shield className="h-8 w-8 text-indigo-600" /> },
              { name: "GrowEasy", logo: <TrendingUp className="h-8 w-8 text-indigo-600" /> },
            ].map((company, index) => (
              <div key={index} className="col-span-1 flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                {company.logo}
                <span className="mt-2 text-slate-600 font-medium">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose TaskFlow Section */}
      <div id="why-taskflow" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Why Choose TaskFlow?
            </h2>
            <p className="text-slate-600 leading-relaxed">
              TaskFlow combines cutting-edge technology with user-centric design to deliver a task management solution that scales with your business needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Brain className="h-6 w-6 text-indigo-600" />, title: "AI-Driven Insights", desc: "Leverage machine learning to gain actionable insights and optimize your workflows dynamically." },
              { icon: <Clock className="h-6 w-6 text-indigo-600" />, title: "Time-Saving Automation", desc: "Automate repetitive tasks and integrate with over 100+ tools to save hours every week." },
              { icon: <Users className="h-6 w-6 text-indigo-600" />, title: "Scalable Collaboration", desc: "From startups to enterprises, TaskFlow supports teams of all sizes with seamless collaboration tools." },
              { icon: <Shield className="h-6 w-6 text-indigo-600" />, title: "Uncompromising Security", desc: "Enterprise-grade security with end-to-end encryption and compliance with global standards." },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group p-6 rounded-lg bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Our platform is engineered to simplify complex workflows, enhance collaboration, and drive productivity through intelligent features tailored for success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <CheckCircle className="h-6 w-6 text-indigo-600" />, title: "Intelligent Task Organization", desc: "AI-powered categorization and prioritization to keep your projects perfectly organized and on track." },
              { icon: <Users className="h-6 w-6 text-indigo-600" />, title: "Seamless Collaboration", desc: "Real-time updates, shared boards, and integrated communication tools for effortless teamwork." },
              { icon: <BarChart3 className="h-6 w-6 text-indigo-600" />, title: "Advanced Analytics", desc: "Comprehensive reports and customizable dashboards to track performance and identify opportunities." },
              { icon: <Calendar className="h-6 w-6 text-indigo-600" />, title: "Smart Scheduling", desc: "Adaptive calendar system with predictive scheduling to optimize your team&apos;s time management." },
              { icon: <Zap className="h-6 w-6 text-indigo-600" />, title: "Automation Engine", desc: "Custom automation rules and extensive integrations to eliminate repetitive manual work." },
              { icon: <Shield className="h-6 w-6 text-indigo-600" />, title: "Enterprise Security", desc: "End-to-end encryption, SOC 2 compliance, and advanced access controls to protect your data." },
              { icon: <MessageSquare className="h-6 w-6 text-indigo-600" />, title: "Integrated Communication", desc: "Built-in chat and commenting features to keep all project discussions in one place." },
              { icon: <TrendingUp className="h-6 w-6 text-indigo-600" />, title: "Performance Tracking", desc: "Monitor team and individual performance with real-time metrics and goal tracking." },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group p-6 rounded-lg bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Loved by Teams Worldwide
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Discover how TaskFlow has transformed productivity and collaboration for organizations across industries.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "&quot;TaskFlow has completely revolutionized our project management. We&apos;ve seen a 45% increase in team productivity since implementation.&quot;", author: "Sarah Johnson", role: "Project Director, TechCorp", avatar: "SJ" },
              { text: "&quot;The intuitive interface and powerful automation features have saved our team countless hours each week. A game-changer for remote collaboration.&quot;", author: "Michael Chen", role: "CTO, InnovateCo", avatar: "MC" },
              { text: "&quot;We evaluated over 15 task management solutions, and TaskFlow stood out for its flexibility, security, and exceptional user experience.&quot;", author: "Elena Rodriguez", role: "Operations Lead, Global Solutions", avatar: "ER" },
              { text: "&quot;TaskFlow&apos;s AI-driven insights have helped us optimize our workflows and achieve our goals faster than ever before.&quot;", author: "James Patel", role: "CEO, FutureTech", avatar: "JP" },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-slate-100"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, star) => (
                    <Star key={star} className="h-4 w-4 text-indigo-600 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-4 italic">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.author}</div>
                    <div className="text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Teaser Section */}
      <div id="pricing" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Flexible Plans for Every Team
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Whether you&apos;re a small startup or a large enterprise, TaskFlow offers pricing plans tailored to your needs. Start free and scale as you grow.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Link
              href="/pricing"
              className="group px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center"
            >
              Explore Pricing
              <ChevronRight className="ml-1 w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Have questions? We&apos;ve got answers. Learn more about how TaskFlow can help your team succeed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { question: "What is TaskFlow?", answer: "TaskFlow is an AI-powered task management platform designed to streamline workflows, enhance collaboration, and boost productivity for teams of all sizes." },
              { question: "Is TaskFlow secure?", answer: "Yes, TaskFlow offers enterprise-grade security with end-to-end encryption, SOC 2 compliance, and advanced access controls to protect your data." },
              { question: "Can I try TaskFlow for free?", answer: "Absolutely! TaskFlow offers a 14-day free trial with no credit card required, so you can explore all features risk-free." },
              { question: "Does TaskFlow integrate with other tools?", answer: "TaskFlow integrates with over 100+ popular tools, including Slack, Google Workspace, Microsoft Teams, and more, to fit seamlessly into your workflow." },
            ].map(({ question, answer }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 rounded-lg bg-white border border-slate-100 hover:shadow-md transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{question}</h3>
                <p className="text-slate-600 leading-relaxed">{answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-700 to-purple-700 text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Transform Your Team&apos;s Productivity?
          </h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">
            Join thousands of forward-thinking teams using TaskFlow to streamline workflows, enhance collaboration, and achieve remarkable results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <Link
              href="/register"
              className="px-6 py-3 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              Start Free Trial
              <ChevronRight className="ml-1 h-4 w-4 text-indigo-700" />
            </Link>
            <Link
              href="/demo"
              className="px-6 py-3 rounded-lg border border-indigo-300 text-white font-semibold hover:bg-indigo-600 transform hover:scale-105 transition-all duration-200"
            >
              Request a Demo
            </Link>
          </div>
          <p className="mt-4 text-slate-200">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
}