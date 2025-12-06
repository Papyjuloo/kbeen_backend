# Architecture Decision Records

## ADR 001: Project Structure

**Date:** 2024-12-06

**Status:** Accepted

**Context:**
We need a scalable and maintainable structure for a backend with multiple modules (Auth, Reservations, Payments, QR Code, IoT).

**Decision:**
Adopt a modular structure with clear separation of concerns:
- Controllers organized by module in subdirectories
- Services for business logic and external integrations
- Validators for input validation
- Event-driven architecture for async operations

**Consequences:**
- Easier to maintain and scale
- Clear separation of concerns
- Better testability
- Consistent code organization

## ADR 002: Authentication Strategy

**Date:** 2024-12-06

**Status:** Accepted

**Context:**
Need to choose between session-based and token-based authentication.

**Decision:**
Use session-based authentication with AdonisJS Auth for web clients. Can be extended with API tokens for mobile apps later.

**Consequences:**
- Simple to implement and secure
- Works well with CSRF protection
- Easy to extend with API tokens later

## ADR 003: Payment Provider

**Date:** 2024-12-06

**Status:** Accepted

**Context:**
Need a reliable payment provider for handling transactions.

**Decision:**
Use Stripe as the payment provider for its robust API, webhook support, and comprehensive features.

**Consequences:**
- Industry-standard security
- Good documentation
- Webhook support for async operations
- Easy refund management

## ADR 004: IoT Communication Protocol

**Date:** 2024-12-06

**Status:** Accepted

**Context:**
Need a protocol for IoT device communication.

**Decision:**
Use MQTT protocol for IoT device communication due to its lightweight nature and pub/sub model.

**Consequences:**
- Low bandwidth usage
- Good for real-time communication
- Scalable pub/sub model
- Requires MQTT broker setup

## ADR 005: QR Code Generation

**Date:** 2024-12-06

**Status:** Accepted

**Context:**
Need to generate QR codes for reservations.

**Decision:**
Use the `qrcode` npm package for generating QR codes server-side.

**Consequences:**
- Simple to implement
- No external API dependencies
- Good customization options
- Server-side generation for better security
