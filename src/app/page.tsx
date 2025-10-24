"use client"

import Link from 'next/link'
import { 
  FileText, 
  Download, 
  Bot, 
  Zap, 
  Shield, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  User,
  Menu,
  X,
  Building2,
  Users,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Corporativo */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-sm border-b border-gray-100 py-3' 
          : 'bg-white/95 backdrop-blur-sm py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className={`bg-[#0F4C81] rounded-lg flex items-center justify-center transition-all duration-300 ${
                isScrolled ? 'w-8 h-8' : 'w-9 h-9'
              }`}>
                <FileText className={`text-white transition-all duration-300 ${
                  isScrolled ? 'w-4 h-4' : 'w-5 h-5'
                }`} />
              </div>
              <span className={`font-semibold text-[#2D3748] transition-all duration-300 ${
                isScrolled ? 'text-lg' : 'text-xl'
              }`}>
                Contasync
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="/services/dian-downloads" 
                className="text-[#718096] hover:text-[#0F4C81] font-medium transition-colors text-sm"
              >
                DIAN
              </Link>
              <Link 
                href="/services/accounting-agent" 
                className="text-[#718096] hover:text-[#0F4C81] font-medium transition-colors text-sm"
              >
                Agente IA
              </Link>
              <Link 
                href="/contact" 
                className="text-[#718096] hover:text-[#0F4C81] font-medium transition-colors text-sm"
              >
                Contacto
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-[#718096] hover:text-[#0F4C81] font-medium transition-colors text-sm"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/demo" 
                className="bg-[#0F4C81] text-white px-6 py-2.5 rounded-md font-medium hover:bg-[#0a3d6b] transition-colors text-sm"
              >
                Solicitar Demo
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#718096]" />
              ) : (
                <Menu className="w-5 h-5 text-[#718096]" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
              <div className="flex flex-col gap-4 pt-4">
                <Link 
                  href="/services/dian-downloads" 
                  className="text-[#718096] hover:text-[#0F4C81] font-medium transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  DIAN
                </Link>
                <Link 
                  href="/services/accounting-agent" 
                  className="text-[#718096] hover:text-[#0F4C81] font-medium transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Agente IA
                </Link>
                <Link 
                  href="/contact" 
                  className="text-[#718096] hover:text-[#0F4C81] font-medium transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contacto
                </Link>
                <div className="pt-4 border-t border-gray-100">
                  <Link 
                    href="/login" 
                    className="block text-[#718096] hover:text-[#0F4C81] font-medium transition-colors mb-3 text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    href="/demo" 
                    className="block bg-[#0F4C81] text-white px-6 py-3 rounded-md font-medium hover:bg-[#0a3d6b] transition-colors text-center text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Solicitar Demo
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>

      {/* Hero Section Empresarial */}
      <section className="relative bg-[#F7FAFC] py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F4C81]/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenido Principal */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-[#2D3748] leading-tight">
                  Automatización Contable
                  <span className="block text-[#0F4C81]">Inteligente</span>
                </h1>
                <p className="text-xl text-[#718096] leading-relaxed max-w-2xl">
                  Transforma tu gestión contable con tecnología de vanguardia. 
                  Reduce costos operativos en un 80% y elimina errores humanos 
                  con nuestra plataforma de automatización empresarial.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/demo" 
                  className="bg-[#0F4C81] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#0a3d6b] transition-colors inline-flex items-center justify-center gap-2 shadow-lg"
                >
                  Solicitar Demo Gratuito
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/contact" 
                  className="border-2 border-[#0F4C81] text-[#0F4C81] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#0F4C81] hover:text-white transition-colors inline-flex items-center justify-center"
                >
                  Hablar con Experto
                </Link>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0F4C81]">80%</div>
                  <div className="text-sm text-[#718096] font-medium">Reducción de tiempo</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#22C55E]">99.9%</div>
                  <div className="text-sm text-[#718096] font-medium">Precisión</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0F4C81]">24/7</div>
                  <div className="text-sm text-[#718096] font-medium">Disponibilidad</div>
                </div>
              </div>
            </div>

            {/* Imagen/Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#0F4C81]/10 to-[#22C55E]/10 rounded-2xl p-12 text-center">
                <div className="w-32 h-32 bg-[#0F4C81] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#2D3748] mb-2">
                  Imagen Corporativa
                </h3>
                <p className="text-[#718096]">
                  Aquí irá la imagen profesional de tu empresa
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección "Confían en Nosotros" */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-[#2D3748] mb-4">
              Confían en Nosotros
            </h2>
            <p className="text-[#718096] max-w-2xl mx-auto">
              Empresas líderes en Colombia ya automatizaron sus procesos contables con Contasync
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {/* Placeholders para logos de clientes */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-center p-4">
                <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <span className="text-xs text-[#718096] font-medium">Logo {i}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section Corporativa */}
      <section className="py-20 bg-[#F7FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#2D3748] mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-[#718096] max-w-3xl mx-auto">
              Soluciones empresariales diseñadas para automatizar y optimizar 
              tu proceso contable con la máxima eficiencia y precisión
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Invoice Automation */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#0F4C81]/20">
              <div className="w-14 h-14 bg-[#0F4C81] rounded-lg flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D3748] mb-4">
                Automatización de Facturas
              </h3>
              <p className="text-[#718096] mb-6 leading-relaxed">
                Procesamiento automático de facturas con reconocimiento inteligente de datos. 
                Reduce errores y tiempo de procesamiento en un 80%.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-sm text-[#718096]">
                  <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Extracción automática de datos
                </li>
                <li className="flex items-center gap-3 text-sm text-[#718096]">
                  <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Validación inteligente
                </li>
                <li className="flex items-center gap-3 text-sm text-[#718096]">
                  <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Integración con sistemas contables
                </li>
              </ul>
            </div>

            {/* DIAN Downloads */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#0F4C81]/20">
              <div className="w-14 h-14 bg-[#0F4C81] rounded-lg flex items-center justify-center mb-6">
                <Download className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D3748] mb-4">
                Descargas DIAN Automatizadas
              </h3>
              <p className="text-[#718096] mb-6 leading-relaxed">
                Descarga automática de certificados, constancias y documentos de la DIAN. 
                Mantente al día sin esfuerzo manual.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-sm text-[#718096]">
                  <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Descargas programadas
                </li>
                <li className="flex items-center gap-3 text-sm text-[#718096]">
                  <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Notificaciones automáticas
                </li>
                <li className="flex items-center gap-3 text-sm text-[#718096]">
                  <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Almacenamiento seguro
                </li>
              </ul>
              <Link 
                href="/services/dian-downloads"
                className="inline-flex items-center gap-2 text-[#0F4C81] font-semibold hover:text-[#0a3d6b] text-sm"
              >
                Saber más <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Accounting Agent */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#0F4C81]/20">
              <div className="w-14 h-14 bg-[#0F4C81] rounded-lg flex items-center justify-center mb-6">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D3748] mb-4">
                Agente de Contabilización IA
              </h3>
              <p className="text-[#718096] mb-6 leading-relaxed">
                Asistente inteligente que automatiza la contabilización de transacciones. 
                Aprende de tus patrones y mejora continuamente.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-sm text-[#718096]">
                  <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Machine Learning avanzado
                </li>
                <li className="flex items-center gap-3 text-sm text-[#718096]">
                  <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Sugerencias inteligentes
                </li>
                <li className="flex items-center gap-3 text-sm text-[#718096]">
                  <CheckCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Aprendizaje continuo
                </li>
              </ul>
              <Link 
                href="/services/accounting-agent"
                className="inline-flex items-center gap-2 text-[#0F4C81] font-semibold hover:text-[#0a3d6b] text-sm"
              >
                Saber más <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Siigo Integration Section Corporativa */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#2D3748] mb-4">
              Integración con Siigo
            </h2>
            <p className="text-lg text-[#718096] max-w-3xl mx-auto">
              Conectamos directamente con tu sistema contable Siigo para una experiencia 
              fluida y sin interrupciones en tu flujo de trabajo
            </p>
          </div>

          <div className="bg-[#F7FAFC] rounded-2xl p-8 lg:p-12 border border-gray-200">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-[#0F4C81] rounded-xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#2D3748]">Sincronización Automática</h3>
                </div>
                <p className="text-[#718096] mb-8 leading-relaxed text-lg">
                  Todos los datos procesados se sincronizan automáticamente con Siigo, 
                  eliminando la necesidad de ingresos manuales y reduciendo errores.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                    <span className="text-[#2D3748] font-medium">Sincronización en tiempo real</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                    <span className="text-[#2D3748] font-medium">Mapeo automático de cuentas</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                    <span className="text-[#2D3748] font-medium">Validación antes de sincronizar</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
                <div className="w-24 h-24 bg-[#0F4C81] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">Siigo</span>
                </div>
                <div className="text-5xl font-bold text-[#0F4C81] mb-4">100%</div>
                <p className="text-xl text-[#2D3748] font-semibold mb-2">Integrado</p>
                <p className="text-[#718096]">con Siigo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section Corporativa */}
      <section className="py-20 bg-[#F7FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#2D3748] mb-4">
              ¿Por qué elegir Contasync?
            </h2>
            <p className="text-lg text-[#718096] max-w-2xl mx-auto">
              Beneficios empresariales que transformarán tu proceso contable 
              y optimizarán la rentabilidad de tu negocio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-[#0F4C81] rounded-xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D3748] mb-3">Eficiencia</h3>
              <p className="text-[#718096] leading-relaxed">Reduce el tiempo de procesamiento en un 80%</p>
            </div>

            <div className="text-center bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-[#0F4C81] rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D3748] mb-3">Precisión</h3>
              <p className="text-[#718096] leading-relaxed">Elimina errores humanos con IA avanzada</p>
            </div>

            <div className="text-center bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-[#0F4C81] rounded-xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D3748] mb-3">Velocidad</h3>
              <p className="text-[#718096] leading-relaxed">Procesamiento en tiempo real</p>
            </div>

            <div className="text-center bg-white p-8 rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-[#0F4C81] rounded-xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D3748] mb-3">Calidad</h3>
              <p className="text-[#718096] leading-relaxed">Resultados consistentes y confiables</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section Corporativa */}
      <section className="py-20 bg-[#0F4C81] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            ¿Listo para transformar tu contabilidad?
          </h2>
          <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
            Únete a cientos de empresas que ya automatizaron sus procesos contables 
            con Contasync y aumentaron su rentabilidad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/demo" 
              className="bg-white text-[#0F4C81] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg"
            >
              Solicitar Demo Gratuito
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#0F4C81] transition-colors"
            >
              Hablar con un Experto
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Corporativo */}
      <footer className="bg-[#2D3748] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo y Descripción */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0F4C81] rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold">Contasync</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Plataforma líder en automatización contable para empresas en Colombia. 
                Transformamos tu gestión financiera con tecnología de vanguardia.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center hover:bg-[#0F4C81] transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center hover:bg-[#0F4C81] transition-colors cursor-pointer">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Servicios */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Servicios</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/services/dian-downloads" className="text-gray-300 hover:text-white transition-colors">
                    Descargas DIAN
                  </Link>
                </li>
                <li>
                  <Link href="/services/accounting-agent" className="text-gray-300 hover:text-white transition-colors">
                    Agente IA
                  </Link>
                </li>
                <li>
                  <Link href="/services/f2x-automation" className="text-gray-300 hover:text-white transition-colors">
                    Automatización F2X
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                    Consultoría
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contacto</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>+57 (1) 234-5678</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>info@contasync.com</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>Bogotá, Colombia</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 text-sm">
                © 2024 Contasync. Todos los derechos reservados.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Política de Privacidad
                </Link>
                <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Términos de Servicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
