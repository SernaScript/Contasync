"use client"

import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { 
  Check,
  Star,
  Bot,
  FileText,
  Zap,
  Crown,
  Sparkles,
  Filter,
  BotIcon
} from "lucide-react"

// Planes de facturación
const PLANS = [
  {
    id: 'basic',
    name: 'Plan Básico',
    price: 120000,
    documents: 50,
    description: 'Ideal para pequeñas empresas',
    features: [
      'Hasta 50 facturas por mes',
      'Descarga automática DIAN',
      'Procesamiento básico',
      'Soporte por email'
    ],
    popular: false,
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'standard',
    name: 'Plan Estándar',
    price: 240000,
    documents: 150,
    description: 'Para empresas en crecimiento',
    features: [
      'Hasta 150 facturas por mes',
      'Descarga automática DIAN',
      'Procesamiento avanzado',
      'Reportes básicos',
      'Soporte prioritario'
    ],
    popular: true,
    icon: Zap,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    price: 350000,
    documents: 300,
    description: 'Para empresas establecidas',
    features: [
      'Hasta 300 facturas por mes',
      'Descarga automática DIAN',
      'Procesamiento premium',
      'Reportes avanzados',
      'Integración Siigo',
      'Soporte 24/7'
    ],
    popular: false,
    icon: Crown,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    id: 'enterprise',
    name: 'Plan Empresarial',
    price: 1000000,
    documents: 1000,
    description: 'Para grandes corporaciones',
    features: [
      'Hasta 1000 facturas por mes',
      'Descarga automática DIAN',
      'Procesamiento empresarial',
      'Reportes personalizados',
      'Integración completa Siigo',
      'API personalizada',
      'Soporte dedicado',
      'Consultoría incluida'
    ],
    popular: false,
    icon: Star,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
]

// Planes de IA
const AI_PLANS = [
  {
    id: 'conty',
    name: 'Conty - Asistente IA',
    price: 1900000,
    documents: 1400,
    description: 'Inteligencia artificial para contabilidad general',
    features: [
      'Revisión automática de causaciones',
      'Predicción basada en facturas pasadas',
      'Detección de errores de causación',
      'Análisis predictivo avanzado',
      'Recomendaciones inteligentes',
      '1400 documentos incluidos',
      'Soporte especializado IA',
      'Actualizaciones automáticas'
    ],
    popular: false,
    icon: Bot,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    isAI: true
  },
  {
    id: 'flypy',
    name: 'Flypy - Conty + Peajes',
    price: 2500000,
    documents: 2000,
    description: 'Conty completo + contabilización de peajes',
    features: [
      'Todo lo de Conty incluido',
      'Revisión automática de causaciones',
      'Predicción basada en facturas pasadas',
      'Detección de errores de causación',
      'Análisis predictivo avanzado',
      'Contabilización automática de peajes',
      'Asignación inteligente de centros de costos',
      'Generación automática de fechas',
      '2000 documentos incluidos',
      'Soporte especializado IA',
      'Actualizaciones automáticas'
    ],
    popular: true,
    icon: Bot,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    isAI: true
  }
]

// Componente para formatear precios
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Componente para mostrar dos robots
const DualBotIcon = ({ planId }: { planId: string }) => {
  if (planId === 'flypy') {
    return (
      <div className="flex items-center justify-center gap-1">
        <Bot className="h-6 w-6 text-indigo-600" />
        <Bot className="h-6 w-6 text-green-600" />
      </div>
    )
  }
  return <Bot className="h-8 w-8 text-indigo-600" />
}

// Componente de tarjeta de plan
const PlanCard = ({ plan, isAI = false }: { plan: typeof PLANS[number] | typeof AI_PLANS[number], isAI?: boolean }) => {
  const IconComponent = plan.icon
  
  return (
    <Card className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${plan.borderColor} ${plan.popular ? 'ring-2 ring-green-500 shadow-lg' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-green-500 text-white px-4 py-1">
            <Star className="h-3 w-3 mr-1" />
            Más Popular
          </Badge>
        </div>
      )}
      
      {isAI && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className={`${plan.id === 'flypy' ? 'bg-green-500' : 'bg-indigo-500'} text-white px-4 py-1`}>
            <Sparkles className="h-3 w-3 mr-1" />
            Inteligencia Artificial
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className={`mx-auto p-4 rounded-full ${plan.bgColor} w-fit mb-4`}>
          {isAI && plan.id === 'flypy' ? (
            <DualBotIcon planId={plan.id} />
          ) : (
            <IconComponent className={`h-8 w-8 ${plan.color}`} />
          )}
        </div>
        
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          {plan.name}
        </CardTitle>
        
        <CardDescription className="text-gray-600 dark:text-gray-300">
          {plan.description}
        </CardDescription>
        
        <div className="mt-4">
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {formatPrice(plan.price)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            por mes
          </div>
        </div>
        
        <div className="mt-2">
          <Badge variant="outline" className="text-sm">
            {plan.documents} documentos/mes
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {feature}
              </span>
            </li>
          ))}
        </ul>
        
        <Button 
          className={`w-full ${
            plan.popular 
              ? 'bg-green-600 hover:bg-green-700' 
              : isAI 
                ? plan.id === 'flypy' 
                  ? 'bg-cyan-600 hover:bg-cyan-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
                : ''
          }`}
          variant={plan.popular || isAI ? 'default' : 'outline'}
        >
          {isAI 
            ? (plan.id === 'flypy' ? 'Activar Flypy' : 'Activar Conty') 
            : 'Seleccionar Plan'
          }
        </Button>
      </CardContent>
    </Card>
  )
}

export default function PlansPage() {
  const [showAIPlans, setShowAIPlans] = useState(false)

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Planes y Precios
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Elige el plan que mejor se adapte a las necesidades de tu empresa. 
            Todos los planes incluyen descarga automática de la DIAN y procesamiento inteligente.
          </p>
          
          {/* Filter Toggle */}
          <div className="flex justify-center mt-6">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
              <Button
                variant={!showAIPlans ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowAIPlans(false)}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Planes Tradicionales
              </Button>
              <Button
                variant={showAIPlans ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowAIPlans(true)}
                className="flex items-center gap-2"
              >
                <Bot className="h-4 w-4" />
                Planes con IA
              </Button>
            </div>
          </div>
        </div>

        {/* Planes según el filtro seleccionado */}
        {!showAIPlans ? (
          /* Planes Tradicionales */
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              Planes de Facturación
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        ) : (
          /* Planes con IA */
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              Planes con Inteligencia Artificial
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {AI_PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} isAI={true} />
              ))}
            </div>
            
            <div className="text-center space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                    🤖 Conty - Asistente IA General
                  </h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    Especializado en contabilidad general. Revisa causaciones, predice patrones 
                    basados en facturas pasadas y detecta errores antes de que se conviertan en problemas.
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    🤖🤖 Flypy - Conty + Peajes
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Incluye todo lo de Conty más contabilización automática de peajes. 
                    Perfecto para empresas del sector transporte que necesitan manejar tanto 
                    contabilidad general como peajes de manera inteligente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información Adicional */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ¿Necesitas un plan personalizado?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Si tu empresa maneja más de 1000 facturas mensuales o necesitas funcionalidades específicas, 
            podemos crear un plan personalizado para ti.
          </p>
          <Button variant="outline">
            Contactar Ventas
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
