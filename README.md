# TYVG Project

Un proyecto moderno de Next.js construido con las mejores tecnologías web actuales.

## 🚀 Tecnologías

- **Framework**: Next.js 14+ con App Router
- **Lenguaje**: TypeScript
- **UI Library**: React
- **Componentes**: ShadCN UI
- **Estilos**: Tailwind CSS
- **Linting**: ESLint

## 📁 Estructura del Proyecto

```
src/
├── app/                 # Páginas (App Router)
├── components/          # Componentes React
│   └── ui/             # Componentes ShadCN UI
└── lib/                # Utilidades
```

## 🛠️ Instalación y Uso

### Prerrequisitos

- Node.js 18+ 
- npm, yarn, pnpm o bun

### Instalación

1. Clona el repositorio
2. Instala las dependencias:

```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

### Desarrollo

Ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

### Comandos Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta ESLint

## 🎨 ShadCN UI

Este proyecto utiliza ShadCN UI para los componentes. Para añadir nuevos componentes:

```bash
npx shadcn@latest add [component-name]
```

Componentes disponibles: [ShadCN UI Components](https://ui.shadcn.com/docs/components)

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [ShadCN UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🚀 Despliegue

La forma más fácil de desplegar tu aplicación Next.js es usar [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.
