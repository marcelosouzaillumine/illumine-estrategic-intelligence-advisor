# Pilot Feedback Framework (PILOT_FEEDBACK_FRAMEWORK)

The feedback framework outlines how executive qualitative reviews are collected, processed, and validated during controlled activation.

## 1. Submission Rules

To prevent data contamination and preserve privacy, feedback comment boxes only accept usability notes and cognitive load reviews. Sensitive business details (such as account balances, specific names, or passwords) are blocked.

## 2. Categorization & Severity Scale

Feedback must select:
- **Category**: `EXECUTIVE_CLARITY`, `GOVERNANCE_READABILITY`, `COGNITIVE_LOAD`, or `RUNTIME_STABILITY`.
- **Severity**:
  - `SUGGESTION`: Small enhancements or usability tweaks.
  - `ATTENTION`: Readability confusion requiring review.
  - `BLOCKING`: Prevents the completion of an onboarding stage.
  - `CRITICAL`: Severe workflow roadblock or operational instability.

Critical and Blocking feedback entries act as go-live blockers, degrading the maturity score until resolved.
