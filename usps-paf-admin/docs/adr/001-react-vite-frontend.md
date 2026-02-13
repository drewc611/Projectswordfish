# ADR-001: React + Vite as Frontend Framework

**Date:** 2026-02-13
**Status:** Accepted
**Deciders:** Architecture Team

## Context

The USPS PAF Admin Portal requires a modern, maintainable web frontend capable of rendering complex data tables, interactive charts, and real-time AI analytics dashboards. The framework choice must support:

- Rapid development with hot module replacement
- Component-based architecture for reusable UI elements
- Rich ecosystem for charting (Recharts), routing (React Router), and icons (Lucide)
- Future integration with AWS services (Bedrock, Cognito, API Gateway)
- Production builds optimized for deployment to AWS CloudFront/S3

## Decision

We chose **React 19** as the UI framework with **Vite 7** as the build tool.

## Alternatives Considered

| Alternative | Pros | Cons | Reason Rejected |
|------------|------|------|-----------------|
| **Next.js** | SSR, file-based routing, API routes | Over-engineered for SPA admin portal; SSR unnecessary for authenticated internal tool | Added complexity without benefit for internal SPA |
| **Vue 3 + Vite** | Simpler learning curve, excellent Vite integration | Smaller ecosystem for enterprise charting libraries; team expertise is React-focused | Ecosystem and team alignment |
| **Angular** | Strong typing, dependency injection, enterprise patterns | Heavy framework overhead; slower dev iteration; steeper learning curve | Too heavyweight for rapid prototyping phase |
| **Create React App** | Familiar React tooling | Deprecated; slow builds; no ESM support; poor DX | CRA is effectively end-of-life |

## Consequences

### Positive
- **Fast development:** Vite provides sub-50ms HMR and <1s cold starts
- **Ecosystem access:** Direct access to React Router DOM 7, Recharts 3, Lucide React icons
- **Future-proof:** React 19 with concurrent features supports the scaling path
- **Simple deployment:** `vite build` produces a static bundle deployable to S3/CloudFront
- **Team productivity:** Component-based architecture enables parallel feature development

### Negative
- **No SSR:** Pure SPA means no server-side rendering (acceptable for authenticated admin portal)
- **Client-side routing:** Requires CloudFront URL rewriting configuration for production
- **Bundle size:** React + Recharts + Lucide adds ~200KB gzipped to initial load

### Risks
- React 19 is relatively new; some third-party libraries may lag in compatibility
- Vite major version upgrades may require config migration

## Compliance

This decision aligns with:
- USPS digital modernization standards for web applications
- AWS Well-Architected Framework (static hosting pattern)
