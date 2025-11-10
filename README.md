# Calculator Microservices - DevOps Workshop

A hands-on DevOps workshop project demonstrating microservices architecture with containerization and orchestration.

## Project Overview

This project implements a simple calculator system using microservices architecture:
- **API Gateway** routes requests to individual services
- **5 Microservices** handle operations: Add, Subtract, Multiply, Divide

## Architecture

```
┌─────────────────────────────────┐
│      API Gateway (Port 3000)    │
├─────────────────────────────────┤
    │        │        │        │
    ↓        ↓        ↓        ↓
  Add    Subtract  Multiply  Divide
 (3001)   (3002)    (3003)    (3004)
```

## Local Development

### Prerequisites
- Node.js 18+
- npm 9+
- Docker Desktop
- Kubernetes enabled in Docker Desktop

### Running Services Locally (Parallel Terminals)

Terminal 1: Gateway
```bash
cd gateway
npm install
npm start
```

Terminal 2: Add Service
```bash
cd add-service
npm install
npm start
```

Terminal 3: Subtract Service
```bash
cd subtract-service
npm install
npm start
```

Terminal 4: Multiply Service
```bash
cd multiply-service
npm install
npm start
```

Terminal 5: Divide Service
```bash
cd divide-service
npm install
npm start
```

### Testing Endpoints

Gateway Health:
```bash
curl http://localhost:3000/health
```

Gateway Info:
```bash
curl http://localhost:3000/info
```

Operations:
```bash
curl "http://localhost:3000/add?a=10&b=5"
curl "http://localhost:3000/subtract?a=10&b=3"
curl "http://localhost:3000/multiply?a=6&b=7"
curl "http://localhost:3000/divide?a=20&b=4"
```

## Docker

### Building Images

```powershell
# Gateway
docker build -t jsanthoshkiran/calculator-gateway:v1 ./gateway
docker push jsanthoshkiran/calculator-gateway:v1

# Add Service
docker build -t jsanthoshkiran/calculator-add:v1 ./add-service
docker push jsanthoshkiran/calculator-add:v1

# Subtract Service
docker build -t jsanthoshkiran/calculator-subtract:v1 ./subtract-service
docker push jsanthoshkiran/calculator-subtract:v1

# Multiply Service
docker build -t jsanthoshkiran/calculator-multiply:v1 ./multiply-service
docker push jsanthoshkiran/calculator-multiply:v1

# Divide Service
docker build -t jsanthoshkiran/calculator-divide:v1 ./divide-service
docker push jsanthoshkiran/calculator-divide:v1
```

### Running Containers

```powershell
docker run -p 3001:3001 jsanthoshkiran/calculator-add:v1
docker run -p 3002:3002 jsanthoshkiran/calculator-subtract:v1
docker run -p 3003:3003 jsanthoshkiran/calculator-multiply:v1
docker run -p 3004:3004 jsanthoshkiran/calculator-divide:v1
docker run -p 3000:3000 -e ADD_SERVICE_URL=http://host.docker.internal:3001 jsanthoshkiran/calculator-gateway:v1
```

## Kubernetes

### Deployment

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### Verification

```bash
kubectl get deployments
kubectl get pods
kubectl get svc
```

### Port Forward to Test

```bash
kubectl port-forward svc/calculator-gateway-service 3000:3000
```

### Scaling

```bash
kubectl scale deployment calculator-add --replicas=5
```

### Logs

```bash
kubectl logs -f deployment/calculator-gateway
```

## CI/CD Pipeline

Jenkins pipeline automatically:
1. Builds Docker images
2. Runs tests
3. Pushes to Docker Hub
4. Deploys to Kubernetes

## Learning Outcomes

- [x] Microservices architecture
- [x] Docker containerization
- [x] Kubernetes orchestration
- [x] CI/CD pipeline automation
- [x] GitHub version control workflow
- [x] Production-ready deployment

## License

MIT - DevOps Workshop Project
