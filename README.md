# SHOTR Server


## Demo

Visit our [Demo Application](https://shotr-mocha.vercel.app/)

## Related Repositories

The SHOTR project repositories
- Frontend: [SHOTR Frontend Repository](https://github.com/hari-uc/shotr-fe)
- Backend Server: (you are here)

## Tech Stack

- **Backend Framework:** Node.js with Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Caching Layer:** Redis with ioredis
- **Authentication:** Secure Google Sign-In with Server JWT

## Features

- **Authentication**
  - Google Sign-In
  - JWT-based server authentication
  
- **Performance & Security**
  - Redis caching
  - Rate limiting

## Database Schema

 [database schema diagram](https://imgur.com/VNgXpP7).

## API Documentation

Channels:
- **Swagger Documentation:** [Browse API Documentation](https://new-slug-intensely.ngrok-free.app/api/docs/)
- **Postman Collection:** [Import Collection](https://www.getpostman.com/collections/6d2d5f34-9c4d-41fe-855b-19d713e75e4f)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Docker
- Node.js (LTS version)
- Yarn Package Manager

### Installation Steps

1. Clone the Repository
   ```bash
   git clone https://github.com/hari-uc/shotr
   cd shotr-server
   ```

2. Set Up Environment Variables
   ```bash
   cp .env.example .env
   ```
   Remember to update the `.env` file with your specific configuration values.

3. Install Dependencies
   ```bash
   yarn install
   ```

### Production Deployment

Launch the application using Docker Compose:

```bash
sudo docker compose up -d
```