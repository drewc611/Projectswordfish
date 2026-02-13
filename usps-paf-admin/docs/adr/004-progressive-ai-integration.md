# ADR-004: Progressive AI Integration Pattern

**Date:** 2026-02-13
**Status:** Accepted
**Deciders:** Architecture Team, UX Lead

## Context

The portal needs to integrate AI-powered features (anomaly detection, risk scoring, fraud detection, predictive analytics) into an existing CRUD-based admin interface. There are two fundamental approaches:

1. **Dedicated AI pages** - Separate the AI features into standalone pages
2. **Embedded AI** - Weave AI insights directly into existing management pages

The chosen pattern must ensure that:
- AI features enhance rather than replace existing workflows
- Users aren't forced to navigate to separate pages for AI insights
- The portal remains fully functional if AI services are unavailable
- AI information is contextually relevant to the data being viewed

## Decision

Adopt a **progressive AI integration pattern** that combines both approaches:
- **Embed** lightweight AI indicators (risk scores, anomaly flags, summary banners) directly into existing CRUD pages
- **Dedicate** a comprehensive AI Insights page for deep-dive analysis

## Implementation

### Tier 1: Ambient AI (Embedded in existing pages)

| Page | AI Element | Behavior |
|------|-----------|----------|
| Dashboard | AI Executive Summary banner | Shows at page top; links to AI Insights |
| Dashboard | Anomaly Detection widget | Compact card in bottom grid |
| PAF Management | "AI Risk" column in data table | Color-coded score badge per row |
| PAF Management | Risk Assessment in detail modal | Score + risk factors |
| CRID Management | "AI Flags" column in data table | Alert count badge per row |
| MID Management | "AI Flags" column with severity | Badge with severity label |

### Tier 2: Deep AI (Dedicated AI Insights page)

| Tab | Content |
|-----|---------|
| Anomaly Detection | Severity metrics, 24h timeline, detection methods, anomaly detail cards |
| Risk Scoring | Risk distribution pie chart, SVG risk gauge, PAF risk table with factors |
| Predictive Analytics | Expiration forecast, volume trends with confidence intervals, compliance projections |
| Fraud Detection | Fraud metrics, detailed alert cards with indicators and recommended actions |

### Tier 3: AI Context (Shared components)

- AI Summary Card with action items (used in Dashboard and AI Insights)
- Bedrock AI Banner with live stats (used in AI Insights and Address Validation)
- Loading states with "Analyzing..." animation (consistent across all AI components)

## Alternatives Considered

| Alternative | Pros | Cons | Reason Rejected |
|------------|------|------|-----------------|
| **AI-only page** | Clean separation, simpler existing pages | Users miss insights in daily workflows; requires navigation | Reduces AI impact |
| **Full AI embedding** | Maximum context awareness | Clutters existing pages; overwhelming for non-AI tasks | Cognitive overload |
| **AI sidebar/panel** | Always visible, persistent | Takes screen real estate; distracting for CRUD operations | Layout constraints |
| **AI notifications** | Non-intrusive, attention-grabbing | Easy to dismiss; no context; limited information density | Insufficient for complex insights |

## Consequences

### Positive
- **Contextual relevance:** Risk scores appear exactly where PAFs are managed
- **Progressive disclosure:** Summary → detail → deep-dive information hierarchy
- **Graceful degradation:** AI columns show loading states or "N/A" if services are down
- **Reduced navigation:** Users don't need to leave their workflow for AI insights
- **Comprehensive analysis:** Dedicated AI page available when deep investigation is needed

### Negative
- **Complexity:** AI data must be fetched in multiple page components (not centralized)
- **Consistency:** Each page implements AI integration slightly differently
- **Performance:** Multiple service calls per page (mitigated by `Promise.all()`)

### Visual Hierarchy

```
┌─────────────────────────────────────────┐
│           AI Executive Summary          │ ◄── Always visible at top
│  "2 critical anomalies detected..."     │     (Dashboard, AI Insights)
└─────────────────────────────────────────┘

┌────────────────────────────────────┐
│  Data Table                        │
│  ┌──────┬──────┬──────┬─────────┐ │
│  │ Name │Status│Volume│ AI Risk │ │ ◄── Inline AI column
│  ├──────┼──────┼──────┼─────────┤ │     (PAF, CRID, MID pages)
│  │ ...  │Active│ 42K  │ 🟢 12  │ │
│  │ ...  │Exprd │ 567K │ 🔴 92  │ │
│  └──────┴──────┴──────┴─────────┘ │
└────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  AI Insights Page (Deep Dive)          │ ◄── Dedicated analysis
│  ┌─────────┬──────────┬──────────────┐ │     (4 tabs, full-page charts)
│  │Anomaly  │Risk Score│Predictive    │ │
│  │Detection│         │Analytics     │ │
│  └─────────┴──────────┴──────────────┘ │
└─────────────────────────────────────────┘
```
