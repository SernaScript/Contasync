# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Next.js project built with the following technologies:

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **UI Library**: React
- **Component Library**: ShadCN UI
- **Styling**: Tailwind CSS
- **Linting**: ESLint

## Architecture Guidelines

- Use the `src/` directory structure
- Follow Next.js App Router conventions
- Utilize TypeScript for type safety
- Use ShadCN UI components for consistent design
- Apply Tailwind CSS for styling
- Implement responsive design principles

## Code Style Preferences

- Prefer functional components with hooks
- Use TypeScript interfaces for props and data structures
- Follow naming conventions: PascalCase for components, camelCase for variables/functions
- Use ShadCN UI components when available before creating custom components
- Implement proper error handling and loading states
- Use Next.js built-in optimizations (Image, Link, etc.)

## File Organization

- Components in `src/components/`
- Pages in `src/app/`
- Utilities in `src/lib/`
- Types in `src/types/` or co-located with components
- ShadCN UI components in `src/components/ui/`

## Best Practices

- Use server components by default, client components when needed
- Implement proper SEO with Next.js metadata API
- Follow accessibility guidelines
- Use TypeScript strict mode
- Implement proper error boundaries
- Use React Suspense for loading states
