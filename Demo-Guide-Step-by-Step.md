# DevOps Workshop - Complete Demo Guide with Step-by-Step Instructions

**Target Audience:** AI & DS Students | **Date:** 13-14 NOV 2025 | **Platform:** Windows 11 + Docker Desktop

---

## **DEMO GUIDE: HANDS-ON SESSION FLOW**

### **Overview**
This guide provides step-by-step instructions for demonstrating each concept live during the workshop. Each demo is designed for 15-20 minutes with clear command execution and expected outputs.

---

## **DAY 1 DEMOS**

---

### **DEMO 1: GitHub Repository Setup (10 min)**

**Objective:** Show students how to create a project repository with Issues and Project Board

**Prerequisites:**
- GitHub account created
- Logged into GitHub.com

**Step-by-Step:**

**1. Create Repository**
- Go to github.com → Click "+" icon → New repository
- **Name:** `calculator-microservices`
- **Description:** "A DevOps workshop project with microservices-based calculator"
- **Public:** ✓ (important for Docker Hub integration)
- **Initialize with README:** ✓
- **Add .gitignore:** Select "Node"
- Click "Create repository"

**Expected Output:**
```
✓ Repository created at github.com/YOUR-USERNAME/calculator-microservices
✓ README.md auto-generated
✓ .gitignore configured for Node.js
```

**2. Create Project Board**
- Inside repository → Click "Projects" tab → "New project"
- **Name:** "Calculator Development"
- **Template:** Table
- Click "Create project"

**3. Create Custom Columns**
- Click project settings
- Add columns: "Backlog" → "In Progress" → "Code Review" → "Testing" → "Done"

**4. Create Issues**
- Go to "Issues" tab
- **Issue #1:** "Setup Gateway Server" [Label: feature] [Assignee: Yourself]
- **Issue #2:** "Add Addition Microservice" [Label: feature]
- **Issue #3:** "Add Subtraction Microservice" [Label: feature]
- **Issue #4:** "Create Dockerfiles" [Label: documentation]
- **Issue #5:** "Push to Docker Hub" [Label: deployment]

**5. Link Issues to Project Board**
- Open each issue
- Click "Projects" on right sidebar
- Assign to "Calculator Development"
- Drag to "Backlog" column

**Talking Points:**
- Issues track work; PRs enforce code review
- Project Board gives visibility to entire team
- Labels organize by type (feature/bug/docs)
- This is how real DevOps teams coordinate

**Key Metrics to Highlight:**
- "We'll complete all 5 issues by day's end"
- "Each issue represents a deliverable microservice"

---

### **DEMO 2: Git Clone & Local Branching (10 min)**

**Objective:** Show the local Git workflow with branches and commits

**Setup:**
- Have VS Code open
- Terminal ready (PowerShell or Git Bash)

**Step-by-Step:**

**1. Clone Repository**
```powershell
# Navigate to documents or dev folder
cd D:\dev  # or your preferred location

# Clone your repository
git clone -b feature/jenkins-setup https://github.com/jsanthoshkiran/calculator-microservices.git

# Navigate into directory
cd calculator-microservices

# Verify remote
git remote -v
# Output should show origin pointing to your repo
```

**2. Create Feature Branch**
```powershell
# Create and switch to feature branch
git checkout -b feature/setup-gateway

# Verify you're on correct branch
git status
# Output: On branch feature/setup-gateway

# Create project structure
mkdir gateway add-service subtract-service multiply-service divide-service
```

**3. Create Initial Files**
```powershell
# Create placeholder for gateway
echo "Gateway setup" > gateway/server.js

# Stage changes
git add gateway/

# Commit with meaningful message
git commit -m "feat: Create gateway service structure

- Add gateway directory
- Initialize server.js placeholder
- Closes #1"

# Verify commit
git log --oneline
# Output: abc1234 feat: Create gateway service structure
```

**4. Push to Remote**
```powershell
# Push feature branch to GitHub
git push origin feature/setup-gateway

# Output shows: remote: Create a pull request for 'feature/setup-gateway'
```

**Expected GitHub Update:**
- New branch appears in GitHub
- Option to create Pull Request automatically shown

**Talking Points:**
- Commit messages follow convention: `type: message`
- Closes #issue automatically links to GitHub Issue
- Feature branches keep main branch clean
- Each branch represents one feature

**Demonstrate:**
- Show GitHub branch list
- Show Pull Request notification
- Click "Compare & pull request"

---

### **DEMO 3: Docker Image Build & Run (15 min)**

**Objective:** Build a Docker image from Dockerfile and run containers locally

**Prerequisites:**
- Docker Desktop running (verify icon in system tray)
- Have gateway code ready

**Step-by-Step:**

**1. Verify Docker Installation**
```powershell
# Check Docker version
docker --version
# Output: Docker version 24.0.x, build xxxxx

# Check Docker daemon status
docker info
# Output: Should show running containers, images, etc.
```

**2. Create Gateway Dockerfile**
Create `gateway/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error()})"

CMD ["node", "server.js"]
```

**Live Narration During Build:**
- "This Dockerfile is like a recipe for creating images"
- "FROM: Start with Node.js 18 Alpine (lightweight)"
- "WORKDIR: Set /app as working directory"
- "COPY: Copy our code into container"
- "RUN: Install dependencies inside container"
- "EXPOSE: Document port 3000"
- "HEALTHCHECK: Kubernetes uses this to verify service health"
- "CMD: Default command when container starts"

**3. Create Gateway Code**
Create `gateway/package.json`:
```json
{
  "name": "calculator-gateway",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

Create `gateway/server.js`:
```javascript
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Gateway is healthy' });
});

app.get('/add', (req, res) => {
  const a = parseFloat(req.query.a) || 0;
  const b = parseFloat(req.query.b) || 0;
  res.json({ result: a + b });
});

app.listen(3000, () => {
  console.log('Gateway listening on port 3000');
});
```

**4. Build Docker Image**
```powershell
cd gateway

# Build with tag
docker build -t calculator-gateway:v1 .

# Output shows:
# Step 1/8 : FROM node:18-alpine
# Step 2/8 : WORKDIR /app
# ...
# Step 8/8 : CMD ["node", "server.js"]
# Successfully built abc1234def567
# Successfully tagged calculator-gateway:v1
```

**Point Out to Students:**
- "Each STEP is a layer. Docker caches these layers for speed."
- "Next time we build, unchanged steps use cache"

**5. Verify Image Created**
```powershell
# List Docker images
docker images | grep calculator

# Output:
# REPOSITORY             TAG    IMAGE ID      CREATED       SIZE
# calculator-gateway     v1     abc1234def    2 minutes ago  200MB
```

**6. Run Container Locally**
```powershell
# Run container
docker run -v D:/DockerUser/.docker:/root/.docker -p 3000:3000 -d --name calc-gateway-1 calculator-gateway:v1

# Output: (container ID)

# Verify it's running
docker ps

# Output:
# CONTAINER ID  IMAGE                    STATUS              PORTS
# abc123456789  calculator-gateway:v1    Up 2 seconds        0.0.0.0:3000->3000/tcp
```

**7. Test Endpoint**
```powershell
# From another terminal or use curl
curl http://localhost:3000/health

# Output: {"status":"Gateway is healthy"}

# Test calculation
curl "http://localhost:3000/add?a=10&b=5"

# Output: {"result":15}
```

**Live Demonstration:**
- Open browser: http://localhost:3000/health
- Show JSON response
- Execute several calculations with different parameters

**8. Inspect Container**
```powershell
# View logs
docker logs calc-gateway-1
# Output: Gateway listening on port 3000

# Access container shell
docker exec -it calc-gateway-1 /bin/sh
# Inside container: ls, npm list, etc.

# Exit container
exit
```

**9. Stop and Remove**
```powershell
# Stop container
docker stop calc-gateway-1

# Remove container
docker rm calc-gateway-1

# Verify removal
docker ps -a
```

**Talking Points Throughout:**
- "The image is immutable—same everywhere"
- "The container is the running process"
- "Port mapping: host:3000 → container:3000"
- "-d means detached (background)"
- "We can run multiple containers from same image"

**Key Takeaway:**
"Once an image is built and tested locally, you can run it identically on any machine—dev, test, staging, production."

---

### **DEMO 4: Docker Hub Push (10 min)**

**Objective:** Push images to Docker Hub for global distribution

**Prerequisites:**
- Docker Hub account created at hub.docker.com
- Docker Desktop running
- Docker image built locally

**Step-by-Step:**

**1. Login to Docker Hub**
```powershell
# Login to Docker Hub
docker login

# Prompts for username/password
# Output: Login Succeeded
```

**2. Tag Image with Docker Hub Username**
```powershell
# Tag image with your Docker Hub username
docker tag calculator-gateway:v1 YOURUSERNAME/calculator-gateway:v1

# Verify tag
docker images | grep calculator
# Output shows both local and tagged versions
```

**3. Push to Docker Hub**
```powershell
# Push image
docker push YOURUSERNAME/calculator-gateway:v1

# Output shows layer upload:
# abc1234 Pushing 50MB
# def5678 Pushing 100MB
# ...
# Successfully pushed
```

**Live Verification:**
- Open hub.docker.com
- Navigate to Repositories
- Show image now available globally
- Show image details: tags, layers, pull command

**4. Demonstrate Global Availability**
```powershell
# Remove local image
docker rmi calculator-gateway:v1

# Pull from Docker Hub (from any computer with internet)
docker pull YOURUSERNAME/calculator-gateway:v1

# Run it immediately
docker run -p 3001:3000 YOURUSERNAME/calculator-gateway:v1
```

**Talking Points:**
- "Docker Hub is like GitHub for containers"
- "Anyone in the world can now pull your image"
- "This is how we distribute software in production"
- "Images are versioned and immutable"

---

### **DEMO 5: Complete Microservices Locally (20 min)**

**Objective:** Run all 5 calculator microservices and show them working together

**Setup:** Have 5 terminal windows open side-by-side

**Step-by-Step:**

**1. Prepare All Services**
In main directory, ensure all 5 services have:
- `package.json`
- `server.js`
- `Dockerfile`

**2. Build All Images (Sequential)**
```powershell
cd gateway && docker build -t calculator-gateway:v1 .
cd ../add-service && docker build -t calculator-add:v1 .
cd ../subtract-service && docker build -t calculator-subtract:v1 .
cd ../multiply-service && docker build -t calculator-multiply:v1 .
cd ../divide-service && docker build -t calculator-divide:v1 .
```

**Live Commentary:**
- "Notice each builds quickly because layers are cached"
- "Multi-stage Dockerfiles keep images small"

**3. Run All Containers**

Terminal 1: Gateway
```powershell
docker run -v D:/DockerUser/.docker:/root/.docker -p 3000:3000 -d --name calc-gateway \
  -e ADD_SERVICE_URL=http://localhost:3001 \
  -e SUB_SERVICE_URL=http://localhost:3002 \
  -e MUL_SERVICE_URL=http://localhost:3003 \
  -e DIV_SERVICE_URL=http://localhost:3004 \
  calculator-gateway:v1


docker run -p 3000:3000 -d --name calc-gateway \
  -e ADD_SERVICE_URL=http://localhost:3001 \
  -e SUB_SERVICE_URL=http://localhost:3002 \
  -e MUL_SERVICE_URL=http://localhost:3003 \
  -e DIV_SERVICE_URL=http://localhost:3004 \
  calculator-gateway:v1
```

Terminal 2: Add Service
```powershell
docker run -p 3001:3001 -d --name calc-add calculator-add:v1
```

Terminal 3: Subtract Service
```powershell
docker run -p 3002:3002 -d --name calc-subtract calculator-subtract:v1
```

Terminal 4: Multiply Service
```powershell
docker run -p 3003:3003 -d --name calc-multiply calculator-multiply:v1
```

Terminal 5: Divide Service
```powershell
docker run -p 3004:3004 -d --name calc-divide calculator-divide:v1
```

**4. Test the System**
```powershell
# Test gateway health
curl http://localhost:3000/health

# Test individual operations
curl "http://localhost:3000/add?a=10&b=5"
# Output: {"result":15}

curl "http://localhost:3000/subtract?a=10&b=3"
# Output: {"result":7}

curl "http://localhost:3000/multiply?a=6&b=7"
# Output: {"result":42}

curl "http://localhost:3000/divide?a=20&b=4"
# Output: {"result":5}

# Test error handling
curl "http://localhost:3000/divide?a=10&b=0"
# Output: {"error":"Division by zero"}
```

**5. View System Topology**
```powershell
# Show all running containers
docker ps

# Show networks (containers communicate)
docker network ls

# Show logs from all services
docker logs calc-gateway
docker logs calc-add
# ... etc
```

**Live Visual Demonstration:**
- Open browser tabs for each endpoint
- Click through operations showing results
- Refresh to show consistent responses
- Show Docker Desktop UI with all containers running

**Key Talking Points:**
- "This is a complete microservices system"
- "Each service is independent and scalable"
- "Gateway routes requests to services"
- "Services communicate over HTTP"
- "If one service fails, others continue"

---

## **DAY 2 DEMOS**

---

### **DEMO 6: Jenkins Setup in Docker (15 min)**

**Objective:** Launch Jenkins automation server and configure pipeline

**Prerequisites:**
- Docker Desktop running
- Port 8080 available

**Step-by-Step:**

**1. Launch Jenkins Container**

java -jar --enable-future-java jenkins.war

```powershell
# Pull Jenkins image
# docker pull jenkins/jenkins:lts -- deprecated
docker pull jenkins/jenkins:lts-jdk17

# Run Jenkins with persistence
docker run -d -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock --name jenkins-demo jenkins/jenkins:lts-jdk17


docker run -d -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home --name jenkins-demo jenkins/jenkins:lts-jdk17

# Monitor startup
docker logs -f jenkins-demo
```

**2. Get Initial Admin Password**
```powershell
# Extract password from logs
docker exec jenkins-demo cat /var/jenkins_home/secrets/initialAdminPassword

# Output: (copy this password)
```

**3. Initial Configuration (Web UI)**
- Open browser: http://localhost:8080
- Paste admin password
- Click "Install suggested plugins" (5-10 min)
- Create admin user:
  - Username: admin
  - Password: devops2025
- Confirm URL: http://localhost:8080
- Click "Start using Jenkins"

**4. Install Required Plugins**
- Manage Jenkins → Plugin Manager
- Search and install:
  - GitHub Integration
  - Docker plugin
  - Kubernetes plugin
  - Blue Ocean (nice UI)
- Restart Jenkins

**5. Add Docker Hub Credentials**
- Manage Jenkins → Manage Credentials
- Click "(global)" domain
- Add Credentials:
  - Kind: Username with password
  - Username: YOUR-DOCKER-HUB-USERNAME
  - Password: YOUR-DOCKER-HUB-TOKEN (generate at hub.docker.com)
  - ID: docker-hub-credentials
- Click OK

**Live UI Tour:**
- Show Jenkins Dashboard
- Explain job concepts
- Show plugin ecosystem
- Discuss pipeline stages

---

### **DEMO 7: Create Jenkins Pipeline Job (15 min)**

**Objective:** Define a Jenkins pipeline that builds and deploys calculator services

**Step-by-Step:**

**1. Create New Pipeline Job**
- Jenkins Dashboard → New Item
- Name: `calculator-ci-cd`
- Type: Pipeline
- Click OK

**2. Configure Pipeline Settings**
```
Definition: Pipeline script from SCM
SCM: Git
Repository URL: https://github.com/YOUR-USERNAME/calculator-microservices.git
Credentials: (leave empty if public)
Branch: */main
Script path: Jenkinsfile
```
- Click Save

**3. Create Jenkinsfile in Repository**

Create file: `Jenkinsfile`
```groovy
pipeline {
    agent any

    environment {
        REPO_NAME = 'calculator-microservices'
        IMAGE_TAG = "${env.BUILD_NUMBER}" // Correct Jenkins variable reference
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', 
                                                  usernameVariable: 'DOCKER_HUB_USR', 
                                                  passwordVariable: 'DOCKER_HUB_PSW')]) {
                    bat '''
                        docker login -u %DOCKER_HUB_USR% -p %DOCKER_HUB_PSW%
                        docker build -t %DOCKER_HUB_USR%/%REPO_NAME%-gateway:%IMAGE_TAG% ./gateway
                        docker push %DOCKER_HUB_USR%/%REPO_NAME%-gateway:%IMAGE_TAG%
                        
                        docker build -t %DOCKER_HUB_USR%/%REPO_NAME%-add:%IMAGE_TAG% ./add-service
                        docker push %DOCKER_HUB_USR%/%REPO_NAME%-add:%IMAGE_TAG%
                        
                        docker build -t %DOCKER_HUB_USR%/%REPO_NAME%-subtract:%IMAGE_TAG% ./subtract-service
                        docker push %DOCKER_HUB_USR%/%REPO_NAME%-subtract:%IMAGE_TAG%
                    '''
                }
            }
        }

        stage('Verify') {
            steps {
                echo 'Pipeline completed successfully!'
                echo 'Triggering code verification...'
            }
        }
    }

    post {
        always {
            echo 'Cleaning workspace...'
            cleanWs()
        }
        success {
            echo '✓ Build succeeded'
        }
        failure {
            echo '✗ Build failed'
        }
    }
}
```

**4. Commit and Push Jenkinsfile**
```powershell
git add Jenkinsfile
git commit -m "ci: Add Jenkins pipeline configuration"
git push origin feature/jenkins-setup
```

**5. Test Pipeline Trigger**
- Create Pull Request for feature branch
- Merge to main
- Jenkins should automatically trigger
- Watch build progress on Jenkins UI
- Check output logs

**Live Narration:**
- "Each stage is a step in the pipeline"
- "Environment variables store credentials safely"
- "Post section handles success/failure"
- "Blue Ocean plugin provides nice visualization"

---

### **DEMO 8: Kubernetes Deployment Setup (20 min)**

**Objective:** Deploy calculator services to local Kubernetes cluster

**Prerequisites:**
- Docker Desktop with Kubernetes enabled
- kubectl available
- Services built and pushed to Docker Hub

**Step-by-Step:**

**1. Verify Kubernetes Cluster**
```powershell
# Check cluster info
kubectl cluster-info

# Get nodes
kubectl get nodes
# Output: Docker Desktop node listed

# Get namespaces
kubectl get namespace
# Output: default, kube-system, etc.
```

**2. Create Kubernetes Manifests**

Create file: `k8s/deployment.yaml` (truncated for demo)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: calculator-gateway
spec:
  replicas: 2
  selector:
    matchLabels:
      app: calculator-gateway
  template:
    metadata:
      labels:
        app: calculator-gateway
    spec:
      containers:
      - name: gateway
        image: YOURUSERNAME/calculator-gateway:latest
        ports:
        - containerPort: 3000
        env:
        - name: ADD_SERVICE_URL
          value: "http://calculator-add-service:3001"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: calculator-add
spec:
  replicas: 2
  selector:
    matchLabels:
      app: calculator-add
  template:
    metadata:
      labels:
        app: calculator-add
    spec:
      containers:
      - name: add-service
        image: YOURUSERNAME/calculator-add:latest
        ports:
        - containerPort: 3001
```

Create file: `k8s/service.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: calculator-gateway-service
spec:
  type: NodePort
  selector:
    app: calculator-gateway
  ports:
  - port: 3000
    targetPort: 3000
    nodePort: 30000
---
apiVersion: v1
kind: Service
metadata:
  name: calculator-add-service
spec:
  type: ClusterIP
  selector:
    app: calculator-add
  ports:
  - port: 3001
    targetPort: 3001
```

**3. Apply Manifests**
```powershell
# Apply deployments
kubectl apply -f k8s/deployment.yaml

# Output:
# deployment.apps/calculator-gateway created
# deployment.apps/calculator-add created

# Apply services
kubectl apply -f k8s/service.yaml

# Output:
# service/calculator-gateway-service created
# service/calculator-add-service created
```

**4. Verify Deployment**
```powershell
# Check deployments
kubectl get deployments
# Output: Shows all deployments with replicas

# Check pods
kubectl get pods
# Output: Shows all pods running

# Check services
kubectl get svc
# Output: Shows all services with IPs
```

**Live Monitoring:**
- Watch pods come up: `kubectl get pods -w`
- Show pods transitioning from Pending → Running
- Explain each pod name and status

**5. Check Pod Details**
```powershell
# Describe deployment
kubectl describe deployment calculator-gateway

# Get pod logs
kubectl logs deployment/calculator-gateway

# Check resource usage
kubectl top pods
```

**6. Port Forward to Test**
```powershell
# Forward gateway port to localhost
kubectl port-forward svc/calculator-gateway-service 3000:3000

# In another terminal, test endpoint
curl http://localhost:3000/health
# Output: {"status":"Gateway is healthy"}
```

**Key Talking Points:**
- "Deployment ensures pods are always running"
- "If a pod fails, Kubernetes replaces it"
- "Service provides stable IP for communication"
- "kubectl is our interface to Kubernetes"

**7. Demonstrate Scaling**
```powershell
# Scale add service to 5 replicas
kubectl scale deployment calculator-add --replicas=5

# Watch new pods come up
kubectl get pods -w

# Show load distribution
kubectl describe svc calculator-add-service
```

**8. Demonstrate Healing**
```powershell
# Kill a pod
kubectl delete pod <pod-name>

# Watch Kubernetes immediately replace it
kubectl get pods -w
```

**Wow Factor:**
- "We didn't manually restart anything"
- "Kubernetes automatically healed the failure"
- "This is production reliability"

---

### **DEMO 9: Complete End-to-End CI/CD Flow (25 min)**

**Objective:** Show complete pipeline: code commit → build → push → deploy

**Setup:**
- Jenkins running
- Kubernetes running
- Calculator services ready

**Step-by-Step:**

**1. Modify Code**
```powershell
# Make a small change to gateway
# Edit gateway/server.js, change version or add endpoint

git checkout -b feature/add-endpoint
git add gateway/server.js
git commit -m "feat: Add new endpoint for status

Implements /status endpoint for cluster status monitoring"
git push origin feature/add-endpoint
```

**2. Create Pull Request**
- Go to GitHub
- Click "Create Pull Request"
- Add description
- Click "Create Pull Request"

**Live Commentary:**
- "Webhook triggers Jenkins automatically"
- "Pipeline starts without manual intervention"
- "Let's watch it happen..."

**3. Watch Jenkins Execute**
```powershell
# Open http://localhost:8080/job/calculator-ci-cd/
# Watch in real-time as stages execute
```

**Live UI Tour:**
- Checkout stage (Green ✓)
- Build Images stage (In Progress)
- Show Docker builds happening
- Push to Docker Hub (Green ✓)

**Expected Timeline:**
- Checkout: 2 sec
- Build: 30-45 sec (first time, faster with cache)
- Push: 15-20 sec

**4. Merge PR & Trigger Deployment**
- Approve PR
- Click "Merge pull request"
- Confirm merge

**Jenkins Pipeline Triggers Automatically:**
- Stage 1: Checkout new code
- Stage 2: Build images
- Stage 3: Push to Docker Hub
- Stage 4: Update Kubernetes

**5. Watch Kubernetes Rollout**
```powershell
# In terminal, watch deployment update
kubectl rollout status deployment/calculator-gateway

# Shows:
# deployment "calculator-gateway" successfully rolled out

# Check new pod version
kubectl get pods -o wide
# Shows new image versions deployed

# View pod events
kubectl describe deployment calculator-gateway
# Shows update strategy and new pod creation
```

**6. Test New Version**
```powershell
# Port forward
kubectl port-forward svc/calculator-gateway-service 3000:3000

# Test in browser
curl http://localhost:3000/status
# Returns new endpoint response

# Verify zero downtime
# While updating, gateway was available throughout
```

**Complete Pipeline Visualization:**
```
Developer          GitHub            Jenkins          Docker Hub       Kubernetes
   |                 |                  |                 |                |
   |--commit------→|                  |                 |                |
   |                 |--webhook-----→|                 |                |
   |                 |                 |--build------→|                |
   |                 |                 |--push----→  |                |
   |                 |                 |---deploy------------------→|
   |                 |                 |                 |                |
   |←-----status-----←---------------←←←───────────────←←|
```

**Timing:**
- Code commit: 0 sec
- Webhook propagation: 1 sec
- Jenkins build: 45 sec
- Docker Hub push: 20 sec
- Kubernetes rollout: 10 sec
- **Total: ~76 seconds from commit to live production**

**Wow Factor Talking Points:**
- "No manual steps"
- "No human error"
- "Fully automated"
- "Same process for new features or bug fixes"
- "Developers focus on coding, not deployment"

**7. Show Rollback Capability**
```powershell
# View rollout history
kubectl rollout history deployment/calculator-gateway

# Rollback to previous version if needed
kubectl rollout undo deployment/calculator-gateway

# Watch pods restart with old image
kubectl get pods -w
```

**End-to-End Summary:**
This single demo ties together everything learned in 2 days:
- GitHub workflow (branching, PRs)
- Docker containerization
- Jenkins CI/CD automation
- Kubernetes orchestration

---

## **TROUBLESHOOTING DURING DEMOS**

### **Docker Issues**

**Problem:** "Cannot connect to Docker daemon"
```powershell
# Solution: Ensure Docker Desktop is running
# Check system tray, click Docker icon, verify running
# Restart Docker if needed
```

**Problem:** "Port already in use"
```powershell
# Find process using port
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F

# Or use different port: docker run -p 3001:3000 ...
```

**Problem:** Image won't build
```powershell
# Clear Docker cache
docker system prune -a

# Try build again with no cache
docker build --no-cache -t name:tag .
```

### **Kubernetes Issues**

**Problem:** Pods stuck in Pending
```powershell
# Check pod events
kubectl describe pod <pod-name>

# Check node resources
kubectl top nodes
kubectl describe nodes

# Might be insufficient resources; reduce replica count
```

**Problem:** Service not accessible
```powershell
# Verify service exists
kubectl get svc

# Check endpoints
kubectl get endpoints

# Port forward for testing
kubectl port-forward svc/service-name 3000:3000
```

### **Jenkins Issues**

**Problem:** Jenkins won't start
```powershell
# Check port not in use
netstat -ano | findstr :8080

# Check Docker logs
docker logs jenkins-demo

# Restart Jenkins
docker restart jenkins-demo
```

**Problem:** Pipeline fails
```powershell
# Check Jenkins logs
docker logs jenkins-demo

# Check pipeline script errors
# Jenkinsfile syntax issues show in Jenkins UI
```

---

## **DEMO SUMMARY CHECKLIST**

### **Day 1 Deliverables**
- [x] GitHub repository with Issues and Project Board
- [x] Feature branch workflow demonstrated
- [x] 5 microservices coded
- [x] 5 Docker images built successfully
- [x] All images pushed to Docker Hub
- [x] All 5 containers running locally
- [x] System tested with sample calculations

### **Day 2 Deliverables**
- [x] Jenkins deployed and configured
- [x] Pipeline job created with Jenkinsfile
- [x] GitHub webhook configured (automatic triggers)
- [x] Kubernetes deployment manifests created
- [x] All services deployed to Kubernetes cluster
- [x] Full CI/CD pipeline tested end-to-end
- [x] Demonstrated scaling and self-healing

---

**End of Complete Demo Guide**
