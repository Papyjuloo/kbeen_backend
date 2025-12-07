# Kbeen Backend - AdonisJS

Backend API pour Kbeen avec Auth, Reservations, Payments, QR Code et IoT.

## 🏗️ Architecture et Structure du Projet

Cette structure suit les meilleures pratiques d'AdonisJS et organise le code de manière modulaire et maintenable.

### 📁 Structure des Dossiers

```
kbeen_backend/
├── app/
│   ├── controllers/          # Contrôleurs organisés par module
│   │   ├── auth/
│   │   │   └── auth_controller.ts
│   │   ├── reservations/
│   │   │   └── reservations_controller.ts
│   │   ├── payments/
│   │   │   └── payments_controller.ts
│   │   ├── qr_codes/
│   │   │   └── qr_codes_controller.ts
│   │   └── iot/
│   │       └── iot_controller.ts
│   ├── models/               # Modèles Lucid ORM
│   │   ├── user.ts
│   │   ├── reservation.ts
│   │   ├── payment.ts
│   │   ├── qr_code.ts
│   │   └── iot_device.ts
│   ├── services/             # Logique métier et services externes
│   │   ├── payment_service.ts
│   │   ├── qr_code_service.ts
│   │   └── iot_service.ts
│   ├── middleware/           # Middleware personnalisés
│   │   ├── auth_middleware.ts
│   │   ├── admin_middleware.ts
│   │   └── guest_middleware.ts
│   ├── validators/           # Validateurs VineJS
│   │   ├── auth_validator.ts
│   │   └── reservation_validator.ts
│   ├── listeners/            # Gestionnaires d'événements
│   │   ├── user_listener.ts
│   │   ├── reservation_listener.ts
│   │   ├── payment_listener.ts
│   │   └── iot_listener.ts
│   └── exceptions/           # Exceptions personnalisées
├── config/                   # Fichiers de configuration
│   ├── app.ts
│   ├── auth.ts
│   ├── database.ts
│   ├── session.ts
│   ├── cors.ts
│   ├── payment.ts
│   ├── iot.ts
│   └── qrcode.ts
├── database/
│   ├── migrations/           # Migrations de base de données
│   │   ├── 001_create_users_table.ts
│   │   ├── 002_create_reservations_table.ts
│   │   ├── 003_create_payments_table.ts
│   │   ├── 004_create_qr_codes_table.ts
│   │   └── 005_create_iot_devices_table.ts
│   ├── seeders/              # Données de test
│   └── factories/            # Factories pour les tests
├── start/                    # Fichiers de démarrage
│   ├── routes.ts             # Définition des routes
│   ├── kernel.ts             # Middleware global
│   ├── events.ts             # Enregistrement des événements
│   └── env.ts                # Validation des variables d'environnement
├── tests/                    # Tests
│   ├── unit/
│   └── functional/
├── bin/                      # Scripts d'exécution
│   ├── server.ts
│   └── test.ts
├── public/                   # Fichiers statiques
├── resources/
│   └── views/                # Templates (si nécessaire)
├── .env.example              # Exemple de variables d'environnement
├── .gitignore
├── adonisrc.ts              # Configuration AdonisJS
├── package.json
└── tsconfig.json

```

## 🚀 Modules Principaux

### 1. 🔐 Module Auth (Authentication)
Gestion complète de l'authentification et des utilisateurs.

**Fonctionnalités :**
- Inscription utilisateur
- Connexion/Déconnexion
- Gestion du profil
- Récupération de mot de passe
- Middleware d'authentification
- Gestion des rôles (user/admin)

**Fichiers clés :**
- `app/controllers/auth/auth_controller.ts`
- `app/models/user.ts`
- `app/validators/auth_validator.ts`
- `app/middleware/auth_middleware.ts`
- `database/migrations/001_create_users_table.ts`

**Routes :**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
PUT    /api/v1/auth/profile
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

### 2. 📅 Module Reservations
Gestion des réservations de ressources.

**Fonctionnalités :**
- Création de réservations
- Consultation des réservations
- Modification et annulation
- Confirmation de réservation
- Génération de QR code par réservation

**Fichiers clés :**
- `app/controllers/reservations/reservations_controller.ts`
- `app/models/reservation.ts`
- `app/validators/reservation_validator.ts`
- `database/migrations/002_create_reservations_table.ts`

**Routes :**
```
GET    /api/v1/reservations
POST   /api/v1/reservations
GET    /api/v1/reservations/:id
PUT    /api/v1/reservations/:id
DELETE /api/v1/reservations/:id
POST   /api/v1/reservations/:id/cancel
POST   /api/v1/reservations/:id/confirm
GET    /api/v1/reservations/:id/qr-code
```

### 3. 💳 Module Payments
Intégration avec Stripe pour les paiements.

**Fonctionnalités :**
- Création de Payment Intent
- Confirmation de paiement
- Gestion des webhooks Stripe
- Remboursements
- Historique des paiements

**Fichiers clés :**
- `app/controllers/payments/payments_controller.ts`
- `app/models/payment.ts`
- `app/services/payment_service.ts`
- `config/payment.ts`
- `database/migrations/003_create_payments_table.ts`

**Routes :**
```
POST   /api/v1/payments/create-intent
POST   /api/v1/payments/confirm
GET    /api/v1/payments/:id
GET    /api/v1/payments/reservation/:reservationId
POST   /api/v1/payments/webhook
POST   /api/v1/payments/refund/:id
```

### 4. 📱 Module QR Code
Génération et validation de QR codes.

**Fonctionnalités :**
- Génération de QR codes
- Validation de QR codes
- Scan de QR codes
- Gestion de l'expiration
- Association avec les réservations

**Fichiers clés :**
- `app/controllers/qr_codes/qr_codes_controller.ts`
- `app/models/qr_code.ts`
- `app/services/qr_code_service.ts`
- `config/qrcode.ts`
- `database/migrations/004_create_qr_codes_table.ts`

**Routes :**
```
GET    /api/v1/qr-codes/generate
POST   /api/v1/qr-codes/validate
GET    /api/v1/qr-codes/:code
POST   /api/v1/qr-codes/:code/scan
```

### 5. 🌐 Module IoT
Gestion des appareils IoT via MQTT.

**Fonctionnalités :**
- Enregistrement d'appareils IoT
- Communication MQTT
- Envoi de commandes aux appareils
- Monitoring du statut des appareils
- Gestion des événements IoT

**Fichiers clés :**
- `app/controllers/iot/iot_controller.ts`
- `app/models/iot_device.ts`
- `app/services/iot_service.ts`
- `config/iot.ts`
- `database/migrations/005_create_iot_devices_table.ts`

**Routes :**
```
GET    /api/v1/iot/devices
POST   /api/v1/iot/devices
GET    /api/v1/iot/devices/:id
PUT    /api/v1/iot/devices/:id
DELETE /api/v1/iot/devices/:id
POST   /api/v1/iot/devices/:id/command
GET    /api/v1/iot/devices/:id/status
GET    /api/v1/iot/devices/:id/logs
```

## 📦 Installation

### Prérequis
- Node.js >= 20.x
- PostgreSQL >= 14
- Redis (optionnel pour les sessions)
- MQTT Broker (pour l'IoT)

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/Papyjuloo/kbeen_backend.git
cd kbeen_backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos configurations :
```env
# Application
APP_KEY=générer_une_clé_avec_node_ace_generate:key
NODE_ENV=development

# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=kbeen

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# MQTT
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_CLIENT_ID=kbeen-backend
```

4. **Générer la clé d'application**
```bash
node ace generate:key
```

5. **Créer la base de données**
```bash
createdb kbeen
```

6. **Exécuter les migrations**
```bash
node ace migration:run
```

7. **Démarrer le serveur**
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3333`

## 🧪 Tests

```bash
# Exécuter tous les tests
npm test

# Tests avec couverture
npm run test:coverage
```

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev              # Démarrer en mode watch

# Production
npm run build           # Compiler le projet
npm start               # Démarrer en production

# Database
node ace migration:run       # Exécuter les migrations
node ace migration:rollback  # Annuler la dernière migration
node ace migration:fresh     # Réinitialiser la DB

# Linting & Formatage
npm run lint            # Vérifier le code
npm run format          # Formater le code
npm run typecheck       # Vérifier les types TypeScript
```

## 🏗️ Conventions de Code

### Structure des Controllers
- Un contrôleur par ressource principale
- Méthodes RESTful standard : `index`, `store`, `show`, `update`, `destroy`
- Méthodes personnalisées en camelCase

### Models
- Relations Lucid clairement définies
- Méthodes utilitaires dans le modèle
- Serialization pour masquer les champs sensibles

### Services
- Logique métier complexe isolée dans les services
- Services réutilisables et testables
- Gestion des APIs externes (Stripe, MQTT)

### Validators
- Validation avec VineJS
- Validators séparés par module
- Messages d'erreur clairs

## 🔒 Sécurité

- ✅ Authentification basée sur les sessions
- ✅ Hashing des mots de passe avec Argon2
- ✅ Validation des entrées avec VineJS
- ✅ CORS configuré
- ✅ Protection CSRF
- ✅ Rate limiting (à implémenter)

## 📊 Base de Données

### Schéma
- **users** : Utilisateurs et authentification
- **reservations** : Réservations de ressources
- **payments** : Transactions Stripe
- **qr_codes** : QR codes générés
- **iot_devices** : Appareils IoT enregistrés

### Relations
- User → hasMany → Reservations
- Reservation → hasOne → Payment
- Reservation → hasOne → QrCode

## 🔄 Événements

Le système d'événements permet de découpler la logique :

**User Events:**
- `user:registered`
- `user:login`

**Reservation Events:**
- `reservation:created`
- `reservation:confirmed`
- `reservation:cancelled`

**Payment Events:**
- `payment:succeeded`
- `payment:failed`
- `payment:refunded`

**IoT Events:**
- `iot:device:connected`
- `iot:device:disconnected`
- `iot:device:error`

## 📚 Documentation API

Une fois le serveur démarré, vous pouvez tester les endpoints :

**Health Check:**
```bash
curl http://localhost:3333/health
```

**Créer un utilisateur:**
```bash
curl -X POST http://localhost:3333/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

## 🚀 Déploiement

### Variables d'environnement en production
```env
NODE_ENV=production
APP_KEY=votre_clé_sécurisée
HOST=0.0.0.0
PORT=3333
```

### Build pour production
```bash
npm run build
npm start
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT.

## 👥 Auteurs

- Kbeen Team

## 🆘 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.