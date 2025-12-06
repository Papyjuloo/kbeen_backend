# Structure du Projet Kbeen Backend

## 📁 Vue d'ensemble de la structure

```
kbeen_backend/
│
├── 📁 app/                                    # Code de l'application
│   │
│   ├── 📁 controllers/                        # Contrôleurs REST
│   │   ├── 📁 auth/
│   │   │   └── auth_controller.ts             # Authentification et gestion utilisateurs
│   │   ├── 📁 reservations/
│   │   │   └── reservations_controller.ts     # Gestion des réservations
│   │   ├── 📁 payments/
│   │   │   └── payments_controller.ts         # Gestion des paiements Stripe
│   │   ├── 📁 qr_codes/
│   │   │   └── qr_codes_controller.ts         # Génération et validation QR codes
│   │   └── 📁 iot/
│   │       └── iot_controller.ts              # Gestion des appareils IoT
│   │
│   ├── 📁 models/                             # Modèles de données (Lucid ORM)
│   │   ├── user.ts                            # Modèle utilisateur
│   │   ├── reservation.ts                     # Modèle réservation
│   │   ├── payment.ts                         # Modèle paiement
│   │   ├── qr_code.ts                         # Modèle QR code
│   │   └── iot_device.ts                      # Modèle appareil IoT
│   │
│   ├── 📁 services/                           # Services métier
│   │   ├── payment_service.ts                 # Intégration Stripe
│   │   ├── qr_code_service.ts                 # Génération de QR codes
│   │   └── iot_service.ts                     # Communication MQTT
│   │
│   ├── 📁 middleware/                         # Middleware HTTP
│   │   ├── auth_middleware.ts                 # Vérification authentification
│   │   ├── admin_middleware.ts                # Vérification rôle admin
│   │   └── guest_middleware.ts                # Accès invité uniquement
│   │
│   ├── 📁 validators/                         # Validation des requêtes (VineJS)
│   │   ├── auth_validator.ts                  # Validation auth (login, register)
│   │   └── reservation_validator.ts           # Validation réservations
│   │
│   ├── 📁 listeners/                          # Gestionnaires d'événements
│   │   ├── user_listener.ts                   # Événements utilisateur
│   │   ├── reservation_listener.ts            # Événements réservation
│   │   ├── payment_listener.ts                # Événements paiement
│   │   └── iot_listener.ts                    # Événements IoT
│   │
│   ├── 📁 exceptions/                         # Gestion des exceptions
│   │   └── handler.ts                         # Gestionnaire global d'erreurs
│   │
│   └── structure.ts                           # Documentation structure
│
├── 📁 config/                                 # Configuration de l'application
│   ├── app.ts                                 # Configuration générale
│   ├── auth.ts                                # Configuration authentification
│   ├── database.ts                            # Configuration base de données
│   ├── session.ts                             # Configuration sessions
│   ├── cors.ts                                # Configuration CORS
│   ├── payment.ts                             # Configuration Stripe
│   ├── iot.ts                                 # Configuration MQTT
│   └── qrcode.ts                              # Configuration QR codes
│
├── 📁 database/                               # Base de données
│   ├── 📁 migrations/                         # Migrations de schéma
│   │   ├── 001_create_users_table.ts
│   │   ├── 002_create_reservations_table.ts
│   │   ├── 003_create_payments_table.ts
│   │   ├── 004_create_qr_codes_table.ts
│   │   └── 005_create_iot_devices_table.ts
│   ├── 📁 seeders/                            # Données de test
│   └── 📁 factories/                          # Factories pour tests
│
├── 📁 start/                                  # Fichiers de démarrage
│   ├── routes.ts                              # Définition des routes API
│   ├── kernel.ts                              # Enregistrement middleware
│   ├── events.ts                              # Enregistrement événements
│   └── env.ts                                 # Validation variables d'environnement
│
├── 📁 bin/                                    # Scripts exécutables
│   ├── server.ts                              # Démarrage serveur HTTP
│   └── test.ts                                # Lancement des tests
│
├── 📁 tests/                                  # Tests
│   ├── 📁 functional/                         # Tests d'intégration
│   │   └── health.spec.ts
│   ├── 📁 unit/                               # Tests unitaires
│   └── bootstrap.ts                           # Configuration tests
│
├── 📁 docs/                                   # Documentation
│   ├── API.md                                 # Documentation API
│   └── ADR.md                                 # Architecture Decision Records
│
├── 📁 public/                                 # Fichiers statiques publics
├── 📁 resources/                              # Ressources (vues, etc.)
│   └── 📁 views/
│
├── .env.example                               # Exemple variables d'environnement
├── .gitignore                                 # Fichiers ignorés par Git
├── adonisrc.ts                               # Configuration AdonisJS
├── package.json                               # Dépendances Node.js
├── tsconfig.json                              # Configuration TypeScript
└── README.md                                  # Documentation principale

```

## 🎯 Organisation par Module

### 🔐 Module Auth
```
app/controllers/auth/auth_controller.ts
app/models/user.ts
app/validators/auth_validator.ts
app/middleware/auth_middleware.ts
app/listeners/user_listener.ts
database/migrations/001_create_users_table.ts
```

### 📅 Module Reservations
```
app/controllers/reservations/reservations_controller.ts
app/models/reservation.ts
app/validators/reservation_validator.ts
app/listeners/reservation_listener.ts
database/migrations/002_create_reservations_table.ts
```

### 💳 Module Payments
```
app/controllers/payments/payments_controller.ts
app/models/payment.ts
app/services/payment_service.ts
app/listeners/payment_listener.ts
config/payment.ts
database/migrations/003_create_payments_table.ts
```

### 📱 Module QR Code
```
app/controllers/qr_codes/qr_codes_controller.ts
app/models/qr_code.ts
app/services/qr_code_service.ts
config/qrcode.ts
database/migrations/004_create_qr_codes_table.ts
```

### 🌐 Module IoT
```
app/controllers/iot/iot_controller.ts
app/models/iot_device.ts
app/services/iot_service.ts
app/listeners/iot_listener.ts
config/iot.ts
database/migrations/005_create_iot_devices_table.ts
```

## 📋 Conventions de Nommage

### Fichiers
- Controllers: `*_controller.ts` (snake_case)
- Models: PascalCase (ex: `user.ts`, `iot_device.ts`)
- Services: `*_service.ts` (snake_case)
- Validators: `*_validator.ts` (snake_case)
- Listeners: `*_listener.ts` (snake_case)
- Middleware: `*_middleware.ts` (snake_case)

### Classes
- Controllers: `AuthController`, `ReservationsController`
- Models: `User`, `Reservation`, `IotDevice`
- Services: `PaymentService`, `QrCodeService`
- Middleware: `AuthMiddleware`, `AdminMiddleware`

### Méthodes (Controllers)
- RESTful standard: `index`, `store`, `show`, `update`, `destroy`
- Actions personnalisées: camelCase (`getQrCode`, `sendCommand`)

## 🔄 Flux de Données

```
Request → Routes → Middleware → Controller → Validator
                                     ↓
                                  Service ← Model
                                     ↓
                                 Response
                                     ↓
                                  Event → Listener
```

## 🗄️ Schéma de Base de Données

```
users
├── id (PK)
├── email
├── password
├── full_name
├── phone_number
├── role
└── is_active

reservations
├── id (PK)
├── user_id (FK → users)
├── resource_type
├── resource_id
├── start_date
├── end_date
├── status
├── amount
└── notes

payments
├── id (PK)
├── reservation_id (FK → reservations)
├── stripe_payment_intent_id
├── amount
├── currency
├── status
├── payment_method
└── metadata

qr_codes
├── id (PK)
├── reservation_id (FK → reservations)
├── code
├── data
├── is_active
├── scanned_at
└── expires_at

iot_devices
├── id (PK)
├── device_id
├── name
├── type
├── status
├── location
├── metadata
└── last_seen_at
```

## 🔗 Relations entre Modèles

```
User 1───M Reservation
         │
         ├── 1───1 Payment
         └── 1───1 QrCode

IotDevice (standalone)
```

## 🚀 Points d'Entrée

- **HTTP Server**: `bin/server.ts` → Port 3333
- **Tests**: `bin/test.ts`
- **Routes**: `start/routes.ts`
- **Health Check**: `GET /health`

## 📚 Ressources Supplémentaires

- [README.md](../README.md) - Documentation complète
- [docs/API.md](API.md) - Documentation API détaillée
- [docs/ADR.md](ADR.md) - Décisions d'architecture
