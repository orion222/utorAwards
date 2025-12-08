# UTORAwards

UTORAwards is a comprehensive campus engagement platform that allows student participation through events, rewards, and leaderboards. Students can discover events, earn points for attendance, redeem rewards, and compete on leaderboards while building a vibrant campus community. Administrative functionality is also implemented, allowing users of higher roles to see the extended layouts and have extra capabilities to facilitate UTORAwards.

## Project Architecture

### Frontend Architecture
The frontend is built as a **Single Page Application (SPA)** using React with a component-based architecture:

- **Layout System**: Nested routing with [`AppLayout`](frontend/src/components/layout/AppLayout/index.jsx) providing consistent header and sidebar navigation
- **Protected Routes**: Role-based access control through [`ProtectedClearanceRoute`](frontend/src/components/routes/ProtectedClearanceRoute.jsx) and [`ProtectedOrganizerRoute`](frontend/src/components/routes/ProtectedOrganizerRoute.jsx)
- **State Management**: React Context for global state (user authentication, wallet, toasts) with React Query for server state
- **Component Library**: Reusable UI components using Material-UI (MUI) design system
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts and container queries

### Backend Architecture
The backend follows a **RESTful API** design with layered architecture:

- **Controllers**: Handle HTTP requests and responses ([`userController.js`](backend/controllers/userController.js), [`eventController.js`](backend/controllers/eventController.js))
- **Services**: Business logic layer ([`userService.js`](backend/services/userService.js), [`eventService.js`](backend/services/eventService.js))
- **Routes**: API endpoint definitions with middleware ([`userRoutes.js`](backend/routes/userRoutes.js))
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Middleware**: JWT authentication, rate limiting, CORS, file uploads

### Database Design
- **Users**: Authentication, roles, points, verification status
- **Events**: Campus events with RSVP system, capacity management
- **Transactions**: Point tracking (purchases, redemptions, transfers, awards)
- **Promotions**: Time-based point multipliers and bonuses
- **Relationships**: Many-to-many for event attendance, user promotions

## Technology Stack

### Frontend Stack
- **React 18** - Core UI framework with hooks and functional components
- **React Router DOM** - Client-side routing with nested layouts
- **Material-UI (MUI)** - Component library and design system
- **Emotion** - CSS-in-JS styling solution
- **React Query (TanStack Query)** - Server state management and caching
- **React Hook Form** - Form handling with Yup validation
- **Axios** - HTTP client for API communication
- **Vite** - Fast development server and build tool
- **Day.js** - Date manipulation and formatting

### Backend Stack
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for REST API
- **Prisma** - Database ORM and migration tool
- **SQLite** - Development database (file-based)
- **PostgreSQL** - Production database (Railway deployment)
- **JWT (jsonwebtoken)** - Authentication and authorization
- **bcrypt** - Password hashing and verification
- **Multer** - File upload handling (avatars)
- **Nodemailer** - Email notifications (password reset)
- **express-rate-limit** - API rate limiting
- **CORS** - Cross-origin request handling
- **Zod** - Runtime type validation

### Development & Deployment
- **Development**: Vite dev server (frontend) + Nodemon (backend)
- **Production**: Vercel (frontend static hosting) + Railway (backend PaaS)
- **Database**: SQLite (local) → PostgreSQL (production)
- **Environment**: Node.js 18+, npm package management
- **Email**: Gmail SMTP with app passwords
- **File Storage**: Local filesystem (uploads directory)

### Key Features
- **Authentication**: JWT-based with role-based access (regular, cashier, manager, superuser)
- **Event Management**: Create, publish, RSVP system with capacity limits
- **Point System**: Earn, transfer, redeem points with transaction history
- **Promotions**: Automatic and one-time point bonuses
- **Leaderboards**: Campus-wide ranking system with privacy controls
- **Admin Dashboard**: User management, transaction oversight
- **Mobile Responsive**: Optimized for all device sizes
- **QR Code Integration**: Digital wallet with QR codes for transactions

### Third Party APIS
- **GeoApify**: A geocoding api that integrates with our events, allowing users to use real locations around the world. 

## Demo Accounts

All demo acounts use the password `Password@123`. Use the utorids below to login as each role.
- `supuser`
- `manager1`
- `cashier1`
- `reguser1`