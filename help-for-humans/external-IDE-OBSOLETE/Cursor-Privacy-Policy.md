---
description: "Comprehensive guide to Cursor's privacy policy, data collection practices, privacy modes, security certifications, and user rights regarding data protection"
---

# Cursor Privacy Policy

This document explains Cursor's privacy practices, data collection, privacy modes, and security measures. Cursor (operated by Anysphere) is SOC 2 Type II certified and commits to protecting user data.

## See Also

- [`Cursor`](Cursor.md) - Cursor IDE setup, installation, configuration, and usage guide
- [`MCP-tools-and-other-knowledge-sources`](mcp-connectors-tools-and-integrations.md) - external tool connections and MCP integrations
- Official Cursor privacy policy: https://cursor.com/privacy
- Official data use overview: https://cursor.com/data-use
- Official security page: https://cursor.com/security
- Cursor Trust Center: https://trust.cursor.com


## Quick Summary

**Key points you need to know:**
- Cursor offers three privacy modes with different data retention policies
- In Privacy Mode and Privacy Mode (Legacy), your code is never stored or used for training
- **Mindstone Rebel / Rebel workspaces are configured to use Cursor Privacy Mode** via the shared `.vscode/settings.json` template (`system/templates/vscode-settings-template.json`), which sets `"cursor.privacyMode": true` for the workspace
- Cursor is SOC 2 Type II certified with annual penetration testing
- Account creation date (before/after October 15, 2025) affects data sharing defaults
- All requests go through Cursor's AWS infrastructure, even when using your own API keys
- You can delete your account and data at any time (complete removal within 30 days)


## Privacy Modes

Cursor offers three distinct privacy modes that control how your data is handled:

### Privacy Mode

**Data retention:** Zero data retention enabled for model providers

**What happens to your code:**
- Your code will not be trained on by Cursor or third parties
- Cursor may store some code for extra features (e.g., codebase indexing)
- All cached file contents are temporary and never permanently stored
- Files are encrypted using unique client-generated keys that only exist during request duration

**Model provider agreements:**
- Zero data retention agreement with Fireworks, Baseten, and Together AI
- Zero data retention agreement with OpenAI
- Requests may be sent to OpenAI for certain background or summarization tasks with zero data retention

### Privacy Mode (Legacy)

**Most user-privacy-friendly option** - This mode provides the strongest privacy protections.

**Data retention:** Zero data retention enabled

**What happens to your code:**
- None of your code will ever be stored by Cursor
- None of your code will be trained on by Cursor or any third-party
- Most restrictive privacy option

### Share Data Mode (Default for New Users)

**Data retention:** Data may be stored and used for improvement

**What happens to your code:**
- Cursor may use and store codebase data, prompts, editor actions, code snippets, and other code data
- This data may be used to improve AI features and train models
- Prompts and limited telemetry shared with model providers when you select their models

**Important date-based difference:**
- **Accounts created before October 15, 2025:** Data not shared with OpenAI by default
- **Accounts created after October 15, 2025:** Prompts and limited telemetry may be shared with OpenAI when directly using their models in Share Data mode


## Data Collection

### What Cursor Collects

**Account Information:**
- Name and email address when you create an account
- Payment information
- Any content you submit as "Inputs" that generate "Suggestions"
- Personal data included in your Inputs (if you reference external content)

**Automatically Collected:**
- Device information (type, operating system)
- IP addresses
- Browser information
- Usage patterns and telemetry
- Location data derived from access patterns

**What Cursor Does NOT Collect:**
- Sensitive or special category personal information
- Genetic data or biometric data
- Information from users under 18 years old


### How Data is Used

**Primary uses:**
- Operating the service and managing accounts
- Improving features and user experience
- Communicating with users
- Security monitoring and fraud prevention

**Training data policy:**
- "We do not use Inputs or Suggestions to train our models, or permit third parties to use them for training"
- Exceptions: Content flagged for security review, explicitly reported as feedback, or explicitly consented to


## Technical Implementation

### How Requests Are Handled

**Request routing:**
- All requests first hit a proxy that determines which service should handle the request
- Each service has two near-identical replicas: one for privacy mode, one for non-privacy mode
- The proxy checks the 'x-ghost-mode' header to route requests appropriately
- Log functions from privacy mode replicas are no-ops (don't log) unless explicitly approved

**API key usage:**
- Even if you use your own API key, requests still go through Cursor's backend
- This is where Cursor performs final prompt building and processing
- Your API keys are used for model access, but Cursor's infrastructure handles the logic

### Codebase Indexing

When you choose to index your codebase:

**How it works:**
- Codebase uploaded in small chunks to compute embeddings
- Plaintext code for embeddings is deleted after request completion
- Embeddings and metadata (hashes, filenames) may be stored

**Privacy protections:**
- Embeddings use obfuscated file names, not plaintext
- File paths use deterministic 6-byte nonce encryption with client-side keys
- No full source code is retained in embeddings

### File Caching

**Temporary server caching:**
- Files temporarily cached to reduce latency and network usage
- Encrypted using unique client-generated encryption keys
- Keys only exist on servers for the duration of a request
- In Privacy Mode: cached content never permanently stored or used for training


## Data Sharing

### Third-Party Service Providers

**Model providers (when explicitly selected):**
- OpenAI - zero retention in Privacy Mode; may receive prompts/telemetry in Share Data mode (post-Oct 15 accounts)
- Anthropic - zero retention in Privacy Mode
- Fireworks, Baseten, Together AI - zero retention agreements for Privacy Mode users

**Infrastructure providers:**
- AWS (primary hosting, US-based)
- Microsoft Azure (secondary services)
- Google Cloud Platform (secondary services)
- Cloudflare (reverse proxy for API/website)

**Important:** None of Cursor's infrastructure is in China.

### Business and Legal Sharing

**Organization accounts:**
- If you create an account using an email associated with an organization (e.g., your employer), Cursor may disclose account-related information to that organization

**Legal requirements:**
- Cursor may disclose personal data to law enforcement when legally required
- Cursor may share data with business partners and service providers necessary to operate the service


## Security and Compliance

### Certifications

**SOC 2 Type II:**
- Cursor has undergone independent third-party audit
- Meets high standards for data security, availability, processing integrity, confidentiality, and privacy
- Reports available at https://trust.cursor.com
- Annual recertification required

**Compliance:**
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)

### Security Practices

**Encryption:**
- AES-256 encryption at rest
- TLS 1.2+ encryption in transit

**Testing:**
- At-least-annual penetration testing by reputable third parties
- Vulnerability disclosure program (reports to security-reports@cursor.com)
- Acknowledgment promised within 5 business days

**Infrastructure security:**
- Enterprise-grade security measures on AWS
- Separate privacy and non-privacy service replicas
- No logging in privacy mode (except when explicitly approved)


## Data Retention

**Retention policy:**
- Cursor retains personal data only as long as necessary to operate the service effectively
- Retention duration required to comply with legal obligations
- User settings may influence retention duration

**Account deletion:**
- Users can delete their account at any time
- Complete removal of data within 30 days of account deletion
- Contact hi@cursor.com for assistance


## User Rights

Depending on your jurisdiction, you may have the right to:

**Access:** Request a copy of your personal data
**Deletion:** Request deletion of your personal data
**Correction:** Request correction of inaccurate data
**Portability:** Request transfer of your data to another service
**Objection:** Object to certain processing of your data

**How to exercise rights:**
- Email: hi@cursor.com
- Include clear description of your request
- Cursor will respond according to applicable legal timeframes

**Data sale policy:**
- Cursor does not "sell" personal data for targeted advertising
- No personal data sold to third-party data brokers


## Privacy Best Practices

### For Maximum Privacy

1. **Enable Privacy Mode:** Go to Settings → Privacy Mode
2. **Use Privacy Mode (Legacy):** If you want the most restrictive option
3. **Review organization settings:** If using a work email, understand what data may be shared with your employer
4. **Avoid including sensitive data in prompts:** Don't reference credentials, API keys, or personal information in your Inputs
5. **Regularly review settings:** Check your privacy settings periodically to ensure they match your preferences

### For Teams and Organizations

1. **Team admin controls:** Admins can enable Privacy Mode for entire teams
2. **Organization email awareness:** Understand that organization accounts may have information shared with the organization
3. **Security review:** Consider reviewing Cursor's SOC 2 Type II report at trust.cursor.com
4. **Credential management:** Never include actual credentials or secrets in code shared with AI models

### Understanding Privacy Mode Limitations

Even with Privacy Mode enabled:
- Requests still go through Cursor's backend infrastructure
- Some metadata (hashes, filenames) may be stored for codebase indexing
- Background summarization tasks may use OpenAI with zero retention
- Cursor's infrastructure can see requests in transit (though they're encrypted and not logged)


## Frequently Asked Questions

**Q: If I use my own OpenAI API key, does my data still go through Cursor?**
A: Yes. Even with your own API key, requests go through Cursor's backend for prompt building and request routing.

**Q: What's the difference between Privacy Mode and Privacy Mode (Legacy)?**
A: Privacy Mode (Legacy) has stricter guarantees - absolutely no code storage. Regular Privacy Mode may store some code for features but never for training.

**Q: Does my account creation date matter?**
A: Yes. Accounts created after October 15, 2025, in Share Data mode may have prompts/telemetry shared with OpenAI. Earlier accounts do not have this default.

**Q: Can I switch privacy modes after creating my account?**
A: Yes. You can change your privacy mode in Settings at any time.

**Q: Is Cursor storing my code when I use codebase indexing?**
A: In Privacy Mode, plaintext code is deleted after embedding computation. Only embeddings with obfuscated filenames are stored, not your actual source code.

**Q: What happens to my data if I delete my account?**
A: Complete removal within 30 days of account deletion.

**Q: Where is Cursor's infrastructure located?**
A: Primarily on AWS in the United States, with secondary services on Azure and Google Cloud. No infrastructure in China.


## Changes to Privacy Policy

Cursor may update their privacy policy. Key dates:
- **October 15, 2025:** Policy change regarding OpenAI data sharing for new accounts

For the most current version, always check:
- https://cursor.com/privacy
- https://cursor.com/data-use


## Contact and Support

**Privacy questions:** hi@cursor.com
**Security reports:** security-reports@cursor.com or via GitHub Security page
**Trust Center:** https://trust.cursor.com
**Documentation:** https://cursor.com/security


## Appendix: Privacy Mode Comparison Table

| Feature                             | Share Data Mode             | Privacy Mode               | Privacy Mode (Legacy) |
| ----------------------------------- | --------------------------- | -------------------------- | --------------------- |
| Code used for training              | Yes (may be used)           | No                         | No                    |
| Code stored by Cursor               | Yes                         | Some (for features only)   | No                    |
| Zero retention with model providers | No*                         | Yes                        | Yes                   |
| Codebase indexing                   | Full storage                | Embeddings only            | Embeddings only       |
| Plaintext code stored               | Yes                         | No (temporary only)        | No                    |
| Prompts shared with OpenAI          | Yes (post-Oct 15 accounts)  | No                         | No                    |
| Best for                            | General use, model training | Sensitive code, compliance | Maximum privacy       |

*Exception: Accounts created before October 15, 2025, have zero retention with OpenAI even in Share Data mode


---

**Document status:** Current as of November 2025
**Last verified:** November 6, 2025
**Source materials:** cursor.com/privacy, cursor.com/data-use, cursor.com/security, trust.cursor.com
