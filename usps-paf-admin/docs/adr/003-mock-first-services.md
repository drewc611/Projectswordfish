# ADR-003: Mock-First Service Architecture

**Date:** 2026-02-13
**Status:** Accepted
**Deciders:** Architecture Team, Frontend Lead

## Context

The PAF Admin Portal frontend needs to be developed and demonstrated before backend APIs (AWS Bedrock, DynamoDB, Cognito) are fully provisioned and deployed. The service layer must:

- Allow frontend development to proceed independently of backend readiness
- Produce realistic data that mirrors production API response shapes
- Simulate realistic latency to validate UX under real-world conditions
- Be easily swappable with real API calls without frontend code changes

## Decision

Adopt a **mock-first service architecture** where all external integrations are abstracted behind async service functions that initially return simulated responses with configurable latency.

## Design Pattern

```javascript
// Service contract (same interface for mock and production)
export async function detectVolumeAnomalies(historicalData) {
  // Mock: simulate inference latency
  await simulateBedrockInference('volume_anomaly_detection');

  // Mock: return realistic response
  return {
    anomalies: [...],
    summary: {...},
    metadata: {
      engine: 'AWS Bedrock Anomaly Detection',
      modelId: BEDROCK_CONFIG.modelId,
    }
  };
}

// Production swap: replace internals, keep signature
export async function detectVolumeAnomalies(historicalData) {
  const response = await fetch('/api/bedrock/anomalies', {
    method: 'POST',
    body: JSON.stringify({ data: historicalData })
  });
  return response.json();
}
```

## Alternatives Considered

| Alternative | Pros | Cons | Reason Rejected |
|------------|------|------|-----------------|
| **MSW (Mock Service Worker)** | Network-level mocking, browser DevTools visibility | Additional dependency, more complex setup, no built-in latency simulation | Overkill for initial development |
| **JSON Server** | RESTful mock API, familiar patterns | Static data only, no computed responses, separate process | Can't simulate AI inference patterns |
| **Backend-first** | Real APIs from day one | Blocks frontend development on backend readiness, slower iteration | Serial dependency unacceptable |
| **Storybook only** | Isolated component development | No integration testing, no real data flow | Insufficient for page-level features |

## Consequences

### Positive
- **Parallel development:** Frontend and backend teams work independently
- **Realistic UX:** Simulated 600-1500ms latency validates loading states and async patterns
- **Demo-ready:** Full portal functionality for stakeholder reviews without backend
- **Contract-first:** Mock responses define the API contract that backend must implement
- **Testing:** Mock services enable deterministic unit and integration tests

### Negative
- **Data drift risk:** Mock responses may diverge from actual API schemas over time
- **False confidence:** UI may work perfectly with mocks but fail with real data edge cases
- **Maintenance:** Mock data must be updated when business rules change

### Migration Path

1. **Phase 1 (Current):** Mock services with simulated latency
2. **Phase 2:** Feature flags to toggle between mock and real services
3. **Phase 3:** Replace mock internals with `fetch()` calls to API Gateway
4. **Phase 4:** Remove mock code, environment-driven service selection

## Service Inventory

| Service | Mock File | Functions | Simulated Latency |
|---------|-----------|-----------|-------------------|
| Address Intelligence | `bedrockService.js` | `validateAddressWithAI`, `batchValidateAddresses`, `getAddressSuggestions`, `analyzeAddressQuality` | 800-1500ms |
| Anomaly Detection | `anomalyService.js` | `detectVolumeAnomalies` | 600-1000ms |
| Risk Scoring | `anomalyService.js` | `calculateRiskScores` | 500-900ms |
| Predictive Analytics | `anomalyService.js` | `generatePredictions` | 700-1100ms |
| Fraud Detection | `anomalyService.js` | `runFraudAnalysis` | 800-1200ms |
| AI Summaries | `anomalyService.js` | `generateAISummary` | 400-800ms |
