/**
 * Kbeen Backend API Structure Documentation
 * 
 * This file provides an overview of the backend structure.
 * 
 * ## Module Organization
 * 
 * Each module (Auth, Reservations, Payments, QR Codes, IoT) follows a consistent structure:
 * 
 * 1. Controller: Handles HTTP requests and responses
 * 2. Model: Database entity with Lucid ORM
 * 3. Service: Business logic and external API integration
 * 4. Validator: Request validation with VineJS
 * 5. Listener: Event handlers for async operations
 * 6. Migration: Database schema definition
 * 
 * ## Best Practices
 * 
 * - Keep controllers thin, move logic to services
 * - Use validators for all input validation
 * - Emit events for async operations
 * - Use dependency injection where possible
 * - Write tests for all endpoints
 * - Document API endpoints
 * 
 * ## Adding a New Module
 * 
 * To add a new module:
 * 1. Create controller in `app/controllers/{module}/`
 * 2. Create model in `app/models/`
 * 3. Create service in `app/services/` (if needed)
 * 4. Create validator in `app/validators/`
 * 5. Create migration in `database/migrations/`
 * 6. Register routes in `start/routes.ts`
 * 7. Add event listeners in `start/events.ts` (if needed)
 * 8. Write tests in `tests/`
 */

export const STRUCTURE_INFO = {
  version: '1.0.0',
  modules: ['Auth', 'Reservations', 'Payments', 'QR Codes', 'IoT'],
  framework: 'AdonisJS v6',
  database: 'PostgreSQL',
  orm: 'Lucid',
}
