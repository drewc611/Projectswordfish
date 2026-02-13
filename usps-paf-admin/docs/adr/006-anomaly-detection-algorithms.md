# ADR-006: Anomaly Detection Algorithm Selection

**Date:** 2026-02-13
**Status:** Accepted
**Deciders:** Architecture Team, AI/ML Lead, Security Lead

## Context

The USPS PAF Admin Portal must detect anomalous behavior across PAF processing volumes, address validation patterns, API access patterns, and compliance indicators. Anomaly detection serves three critical functions:

1. **Operational monitoring:** Identifying unusual processing volumes that may indicate system issues
2. **Fraud prevention:** Detecting data exfiltration, unauthorized access, and address abuse
3. **Compliance enforcement:** Flagging entities that deviate from expected behavior patterns

The detection system must operate across multiple data dimensions (volume, timing, geography, failure rates) with varying baseline patterns and sensitivity requirements.

## Decision

Implement a **multi-algorithm ensemble** approach combining three complementary detection methods:

1. **Z-Score Analysis** - Statistical deviation from historical baselines
2. **Isolation Forest** - Unsupervised outlier detection via random partitioning
3. **Time-Series Decomposition** - Seasonal pattern analysis and trend detection

## Algorithm Details

### Z-Score Analysis

```
Purpose: Detect point anomalies in numerical metrics
Formula: z = (x - μ) / σ
Thresholds:
  - |z| > 2.0 → Low severity (unusual)
  - |z| > 3.0 → Medium severity (anomalous)
  - |z| > 4.0 → High severity (critical anomaly)
  - |z| > 5.0 → Critical severity (potential fraud)

Applicable to:
  - Processing volume per PAF/CRID/MID
  - Address validation request rates
  - DPV failure rates
  - API call frequency
```

**Example from production detection:**

| Anomaly | Entity | Metric | Expected | Actual | Z-Score | Severity |
|---------|--------|--------|----------|--------|---------|----------|
| ANM-001 | PAF-2026-004 | Processing Volume | 42,000 | 567,000 | 4.2 | High |
| ANM-003 | MID-900345678 | DPV Failure Rate | 2.1% | 18.7% | 5.1 | High |
| ANM-002 | CRID-100234 | Validation Rate | 4,200 | 8,900 | 2.8 | Medium |

### Isolation Forest

```
Purpose: Detect contextual anomalies in multi-dimensional data
Method: Random recursive partitioning; anomalies are isolated
        in fewer partitions than normal points

Applied dimensions:
  - Volume × Time-of-day
  - Geographic distribution × Entity
  - Failure rate × Volume
  - API pattern × Authorization status

Advantages:
  - No need to define "normal" explicitly
  - Handles high-dimensional data
  - Works with mixed feature types
```

### Time-Series Decomposition

```
Purpose: Detect anomalies relative to seasonal patterns
Method: STL (Seasonal-Trend-Loess) decomposition

Components:
  - Trend: Long-term direction of metric
  - Seasonal: Weekly/monthly cyclical patterns
  - Residual: Unexplained variation (anomaly signal)

Applied to:
  - Daily processing volumes (weekly seasonality)
  - Monthly PAF expiration patterns (annual seasonality)
  - Address validation volumes (business hour patterns)

Anomaly criterion: Residual > 3σ of historical residuals
```

## Ensemble Scoring

```
Final Anomaly Score = max(
  Z-Score severity,
  Isolation Forest anomaly score,
  Time-Series residual severity
)

Rationale: Maximum operator ensures any single algorithm
detecting an anomaly triggers investigation, reducing
false negatives at the cost of higher false positives
(acceptable for security-critical monitoring).
```

## Alternatives Considered

| Alternative | Pros | Cons | Reason Rejected |
|------------|------|------|-----------------|
| **Z-Score only** | Simple, interpretable, fast | Misses contextual and seasonal anomalies | Insufficient coverage |
| **DBSCAN clustering** | Density-based, good for spatial data | Requires epsilon tuning per metric; poor with varying densities | Tuning overhead |
| **Autoencoder (neural)** | Learns complex patterns, adaptive | Requires training data, GPU inference, higher latency | Infrastructure overhead |
| **Prophet (Facebook)** | Excellent time-series, handles holidays | Python-only; requires separate microservice | Stack complexity |
| **AWS Lookout for Metrics** | Managed anomaly detection | Separate AWS service; additional cost; less customizable | Vendor lock-in for core feature |

## Consequences

### Positive
- **Comprehensive coverage:** Three algorithms cover point, contextual, and seasonal anomalies
- **Interpretable:** Z-scores and time-series residuals are explainable to non-technical users
- **Low latency:** All algorithms are O(n) or O(n log n) - suitable for real-time detection
- **No training required:** Z-Score and Isolation Forest are unsupervised
- **Bedrock integration:** LLM generates human-readable descriptions and recommendations from raw scores

### Negative
- **False positive risk:** Ensemble max-operator increases alert volume
- **Baseline dependency:** Z-Score requires sufficient historical data (minimum 30 days)
- **Threshold tuning:** Severity thresholds may need adjustment per entity type
- **Limited to structured data:** Cannot detect anomalies in unstructured text or images

### Severity Classification

| Level | Z-Score Range | Color | Required Action |
|-------|--------------|-------|-----------------|
| Low | 1.9 - 2.5 | Yellow | Monitor, log |
| Medium | 2.5 - 4.0 | Orange | Investigate within 24h |
| High | 4.0 - 5.0 | Red | Immediate investigation |
| Critical | > 5.0 | Dark Red | Suspend operations, escalate |

### Detection Response Matrix

| Anomaly Type | Detection Method | Primary Response |
|-------------|-----------------|-----------------|
| Volume spike before PAF expiration | Z-Score + Time-Series | Audit, potential access suspension |
| Off-hours API activity | Isolation Forest | Rate limiting, authorization review |
| Geographic concentration shift | Isolation Forest | Monitor, verify business change |
| DPV failure rate surge | Z-Score | Quarantine address batches |
| Validation volume doubling | Z-Score | 24h monitoring, licensee contact |
| Seasonal deviation | Time-Series Decomposition | Context-dependent |

## Future Enhancements

1. **Adaptive thresholds:** Per-entity baseline learning that adjusts thresholds based on entity size and history
2. **Feedback loop:** Analyst resolution actions (true positive / false positive) fed back to improve scoring
3. **Cross-entity correlation:** Detecting coordinated anomalies across related PAFs, CRIDs, and MIDs
4. **Real-time streaming:** Replace batch detection with Apache Kafka + Kinesis stream processing
