# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Sales Prediction System built with Angular 20.2.0. The application follows a feature-based modular architecture with three main features:
- Sales Prediction
- Orders Management 
- New Order Creation

## Development Commands

### Core Development
- `npm start` or `ng serve` - Start development server on http://localhost:4200
- `npm run build` or `ng build` - Build for production
- `npm run watch` or `ng build --watch --configuration development` - Build in watch mode
- `npm test` or `ng test` - Run unit tests with Karma
- `npm run lint` or `ng lint` - Run ESLint on TypeScript and HTML files

### Code Generation
- `ng generate component component-name` - Generate new component
- `ng generate --help` - List all available schematics

## Architecture

### Module Structure
The application follows Angular's feature module pattern:
- **Core Module** (`src/app/core/`) - Singleton services and app-wide functionality
- **Shared Module** (`src/app/shared/`) - Reusable components, pipes, directives, and models
- **Feature Modules** (`src/app/features/`) - Lazy-loaded feature modules:
  - `sales-prediction/` - Sales prediction functionality
  - `orders/` - Orders list and management
  - `new-order/` - New order creation forms

### File Organization
- Each feature has its own routing module (`*-routing-module.ts`)
- Each feature has its own feature module (`*-module.ts`)
- Components follow the pattern: `component-name.ts`, `component-name.html`, `component-name.scss`
- Shared models are in `src/app/shared/models/`
- Core services are in `src/app/core/services/`

### Technology Stack
- **Framework**: Angular 20.2.0 with standalone components config
- **UI Libraries**: Angular Material 20.2.2, Bootstrap 5.3.8
- **Styling**: SCSS with Angular Material theming
- **Testing**: Jasmine + Karma
- **Linting**: ESLint with Angular-specific rules
- **Code Formatting**: Prettier (configured for 100 char width, single quotes)

## Code Standards

### Component Naming
- Component selectors use `app-` prefix with kebab-case (`app-sales-prediction`)
- Directive selectors use `app` prefix with camelCase (`appCustomDirective`)

### ESLint Configuration
The project uses Angular ESLint with:
- TypeScript recommended rules
- Angular template accessibility rules
- Inline template processing enabled
- Custom component and directive selector rules

### Prettier Configuration
- 100 character line width
- Single quotes for strings
- Special Angular parser for HTML templates

## Development Notes

- The project uses the new Angular standalone components architecture
- Bootstrap and Angular Material are both available for UI components
- Zone.js change detection with event coalescing is enabled
- Source maps are enabled in development builds
- Bundle size budgets: 500kB warning, 1MB error for initial bundle