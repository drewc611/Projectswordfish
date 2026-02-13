# ADR-002: AWS Bedrock for AI/ML Integration

**Date:** 2026-02-13
**Status:** Accepted
**Deciders:** Architecture Team, AI/ML Lead

## Context

The PAF Admin Portal requires AI capabilities for:
1. **Address validation and enrichment** - Intelligent address parsing, standardization, and quality assessment
2. **Anomaly detection** - Identifying unusual patterns in PAF processing volumes and behaviors
3. **Risk scoring** - Automated risk assessment for PAF entities
4. **Fraud detection** - Detecting data exfiltration, unauthorized access, and address abuse patterns
5. **Predictive analytics** - Forecasting PAF expirations, volume trends, and compliance risk

The AI service must integrate with existing USPS infrastructure (AMS API, NCOALink) and meet federal security requirements.

## Decision

We chose **AWS Bedrock** with the **Anthropic Claude Sonnet 4.5** model (`anthropic.claude-sonnet-4-5-20250929`) as the AI/ML inference engine.

## Alternatives Considered

| Alternative | Pros | Cons | Reason Rejected |
|------------|------|------|-----------------|
| **AWS SageMaker** | Full model training pipeline, custom models | Requires ML ops expertise, longer setup, higher cost for inference-only workloads | Over-engineered for inference tasks |
| **OpenAI API** | GPT-4 capabilities, broad ecosystem | Third-party data processing; FedRAMP concerns; no AWS-native integration | Federal data handling requirements |
| **Self-hosted models** | Full data control, no vendor lock-in | Significant infrastructure overhead; GPU procurement; maintenance burden | Cost and operational complexity |
| **Azure OpenAI Service** | Enterprise features, compliance certifications | Not AWS-native; adds cross-cloud complexity to existing AWS stack | Architecture consistency |

## Consequences

### Positive
- **AWS-native:** Direct integration with IAM, VPC, CloudWatch for security and monitoring
- **Model flexibility:** Can swap between Claude, Titan, Llama models without code changes
- **FedRAMP alignment:** AWS Bedrock operates within AWS GovCloud-eligible infrastructure
- **No ML ops required:** Fully managed inference with no model training or hosting overhead
- **Cost efficient:** Pay-per-token pricing scales with actual usage

### Negative
- **Vendor dependency:** Tight coupling to AWS Bedrock API contracts
- **Latency:** 600-1500ms inference latency per request (mitigated by async patterns)
- **Model availability:** Dependent on Anthropic model availability in Bedrock
- **Cost unpredictability:** Token-based pricing can spike with volume anomalies (ironic but real)

### Architecture Integration

```
Frontend (React)
     │
     ▼
Service Layer (bedrockService.js / anomalyService.js)
     │
     ▼ (Currently simulated; production: via API Gateway)
API Gateway + Lambda
     │
     ▼
AWS Bedrock (InvokeModel API)
     │
     ▼
Anthropic Claude Sonnet 4.5
```

### Configuration

```javascript
const BEDROCK_CONFIG = {
  region: process.env.VITE_AWS_REGION || 'us-east-1',
  modelId: process.env.VITE_BEDROCK_MODEL_ID || 'anthropic.claude-sonnet-4-5-20250929',
  endpoint: process.env.VITE_BEDROCK_ENDPOINT || '/api/bedrock',
};
```

## Compliance

- AWS Bedrock data processing stays within the AWS boundary
- No customer data leaves the AWS environment for AI inference
- All Bedrock API calls logged to CloudWatch for audit trail
- IAM policies restrict model access to authorized service accounts
