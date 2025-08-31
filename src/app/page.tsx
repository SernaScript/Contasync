"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  ArrowRight,
  Shield,
  Truck,
  BarChart3, 
  Users, 
  MapPin,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  Package,
  Route,
  FileText,
  DollarSign
} from "lucide-react"

export default function LandingPage() {
  return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
        </div>
              <span className="text-xl font-bold text-gray-900">TYVG</span>
        </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Acceder al Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

            {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 bg-orange-100 text-orange-800 border-orange-300">
            <Truck className="w-4 h-4 mr-1" />
            Plataforma de Transporte de Carga
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Portal <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">TYVG</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma exclusiva para proveedores y terceros de TYVG. Gestiona tus pagos, certificaciones, 
            registra tus viajes y consulta información de tus servicios de transporte de materiales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6 bg-orange-600 hover:bg-orange-700">
                <Lock className="mr-2 h-5 w-5" />
                Acceder al Portal
                </Button>
              </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-orange-600 text-orange-600 hover:bg-orange-50">
              <Users className="mr-2 h-5 w-5" />
              Solicitar Registro
            </Button>
          </div>
        </div>
      </section>

            {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades del Portal
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas para que nuestros proveedores y terceros gestionen eficientemente sus operaciones con TYVG
            </p>
          </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Gestión de Pagos */}
            <Card className="border-orange-200 hover:border-orange-300 transition-colors group hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-orange-900">Gestión de Pagos</CardTitle>
                <CardDescription>
                  Consulta el estado de tus pagos, historial de liquidaciones y próximos desembolsos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Estado de pagos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Historial de liquidaciones
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Próximos desembolsos
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Registro de Viajes */}
            <Card className="border-blue-200 hover:border-blue-300 transition-colors group hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Registro de Viajes</CardTitle>
                <CardDescription>
                  Registra tus viajes realizados para el proceso de liquidación y pago
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    Registro de servicios
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    Carga de documentos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    Seguimiento de estado
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Certificaciones */}
            <Card className="border-green-200 hover:border-green-300 transition-colors group hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-green-900">Certificaciones</CardTitle>
                <CardDescription>
                  Mantén actualizadas tus certificaciones RUNT, pólizas y documentación legal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Certificados RUNT
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Pólizas de seguros
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Documentación vehicular
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Consulta de Información */}
            <Card className="border-purple-200 hover:border-purple-300 transition-colors group hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-purple-900">Consulta de Información</CardTitle>
                <CardDescription>
                  Accede a reportes, historial de servicios y información adicional de tus operaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Historial de servicios
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Reportes de actividad
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Información contractual
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ventajas para Nuestros Proveedores
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Una plataforma diseñada para simplificar la gestión de tus servicios con TYVG
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Pagos Transparentes</h3>
              <p className="text-gray-600">
                Consulta en tiempo real el estado de tus pagos, historial de liquidaciones y próximos desembolsos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Documentación Centralizada</h3>
              <p className="text-gray-600">
                Mantén actualizadas todas tus certificaciones y documentos legales en un solo lugar
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Proceso Ágil</h3>
              <p className="text-gray-600">
                Registra tus viajes de forma rápida y sencilla para agilizar el proceso de liquidación
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">120+</div>
              <div className="text-gray-600">Proveedores Registrados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">2,500+</div>
              <div className="text-gray-600">Viajes Procesados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600">Pagos Puntuales</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Soporte Disponible</div>
            </div>
          </div>
        </div>
      </section>

            {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Eres proveedor de servicios de transporte?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Únete a nuestros proveedores registrados y gestiona tus pagos, certificaciones y servicios de forma eficiente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Lock className="mr-2 h-5 w-5" />
                Acceder al Portal
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-orange-600">
              <Users className="mr-2 h-5 w-5" />
              Registrarse como Proveedor
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TYVG</span>
              </div>
              <p className="text-gray-400">
                Portal especializado para proveedores y afiliados en el transporte de carga por carretera
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Gestión de Pagos</li>
                <li>Registro de Viajes</li>
                <li>Certificaciones</li>
                <li>Consulta de Información</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Centro de Ayuda</li>
                <li>Contacto Técnico</li>
                <li>Capacitaciones</li>
                <li>Estado del Sistema</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Términos de Servicio</li>
                <li>Política de Privacidad</li>
                <li>Normativa RUNT</li>
                <li>Certificaciones</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TYVG - Portal de Transporte de Carga. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
      </div>
  )
}
