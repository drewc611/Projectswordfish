# ADR-005: Client-Side State Management with React Hooks

**Date:** 2026-02-13
**Status:** Accepted
**Deciders:** Architecture Team, Frontend Lead

## Context

The PAF Admin Portal needs a state management strategy for:
- Page-level data (PAF lists, CRID records, MID records)
- AI service responses (anomalies, risk scores, predictions, fraud alerts)
- UI state (active tab, modal open/closed, search filters, loading states)
- Form state (settings, address validation input)

The solution must balance simplicity with scalability as the application grows.

## Decision

Use **React built-in hooks** (`useState`, `useEffect`) for all state management, with data fetched independently in each page component.

## Pattern

```javascript
function PAFManagement() {
  // Data state
  const [pafs] = useState(mockData.pafs);
  const [riskScores, setRiskScores] = useState({});
  const [loading, setLoading] = useState(true);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPaf, setSelectedPaf] = useState(null);

  // Data fetching
  useEffect(() => {
    calculateRiskScores().then(data => {
      setRiskScores(data.scores);
      setLoading(false);
    });
  }, []);

  // Derived state (computed, not stored)
  const filteredPafs = pafs.filter(p =>
    p.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || p.status === statusFilter)
  );
}
```

## Alternatives Considered

| Alternative | Pros | Cons | Reason Rejected |
|------------|------|------|-----------------|
| **Redux Toolkit** | Centralized store, DevTools, middleware | Boilerplate for simple CRUD; 9 pages don't share enough state to justify | Over-engineering for current scope |
| **Zustand** | Lightweight, minimal API, no providers | Adds dependency; each page's state is independent anyway | No shared state to centralize |
| **React Context** | Built-in, no dependencies, provider pattern | Causes re-renders on any context change; poor for frequently-updating data | Performance concern with AI polling |
| **TanStack Query** | Caching, refetching, stale-while-revalidate | Service layer is mock-based; no real API caching needed yet | Premature for mock services |

## Consequences

### Positive
- **Zero dependencies:** No additional state management libraries
- **Simplicity:** Each page is self-contained with its own data lifecycle
- **Performance:** No unnecessary re-renders from global state changes
- **Debuggability:** State is localized, making issues easier to trace
- **Low learning curve:** Standard React patterns understood by all React developers

### Negative
- **No shared state:** AI data fetched independently in Dashboard and AI Insights (duplicate calls)
- **No caching:** Navigating away and back re-fetches data
- **No persistence:** Refresh loses all state (filters, tabs, etc.)
- **Scale limit:** If 20+ components need shared data, this pattern becomes unwieldy

### Migration Path

If the application grows to require shared state:

1. **Phase 1 (Current):** `useState` + `useEffect` per page
2. **Phase 2:** Extract shared AI data into React Context (when 3+ pages need same data)
3. **Phase 3:** Adopt TanStack Query when real APIs replace mocks (for caching/refetching)
4. **Phase 4:** Consider Zustand only if truly global state emerges (auth, user preferences)

### State Ownership Map

| State | Owner Component | Scope | Persistence |
|-------|----------------|-------|-------------|
| PAF list + filters | PAFManagement | Page | None |
| CRID list + filters | CRIDManagement | Page | None |
| MID list + filters | MailerIDManagement | Page | None |
| AI anomalies | Dashboard, AIInsights | Page | None |
| AI risk scores | PAFManagement, AIInsights | Page | None |
| AI predictions | AIInsights | Page | None |
| AI fraud alerts | AIInsights | Page | None |
| AI summary | Dashboard, AIInsights | Page | None |
| Address validation | AddressValidation | Page | None |
| Active route | React Router | App | URL-based |
| Settings form | SettingsPage | Page | None |
