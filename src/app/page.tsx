import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Bienvenido a tu proyecto
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Un proyecto moderno construido con Next.js, TypeScript, Tailwind CSS y ShadCN UI
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ Next.js 14+
              </CardTitle>
              <CardDescription>
                Framework de React con App Router para aplicaciones modernas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 TypeScript
              </CardTitle>
              <CardDescription>
                Tipado estático para mayor seguridad y mejor experiencia de desarrollo
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 ShadCN UI
              </CardTitle>
              <CardDescription>
                Componentes elegantes y accesibles con Tailwind CSS
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Interactive Demo */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Prueba los componentes</CardTitle>
            <CardDescription>
              Interactúa con los componentes de ShadCN UI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="demo-input">Nombre</Label>
              <Input 
                id="demo-input" 
                placeholder="Ingresa tu nombre aquí" 
              />
            </div>
            <div className="flex gap-2">
              <Button variant="default">
                Botón Principal
              </Button>
              <Button variant="outline">
                Botón Secundario
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-300">
            Construido con ❤️ usando las mejores tecnologías web modernas
          </p>
        </div>
      </div>
    </div>
  );
}
