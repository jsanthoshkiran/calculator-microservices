pipeline {
  agent any

  environment {
    DOCKER_HUB = credentials('docker-hub-credentials')
    IMAGE_TAG = "${BUILD_NUMBER}"
    REPO_NAME = 'calculator-microservices'
  }

  stages {
    stage('Checkout') {
      steps {
        echo 'Step 1: Checking out code...'
        checkout scm
      }
    }

    stage('Build Images') {
      steps {
        echo 'Step 2: Building Docker images...'
        script {
          sh '''
            docker build -t ${DOCKER_HUB_USR}/${REPO_NAME}-gateway:${IMAGE_TAG} ./gateway
            docker build -t ${DOCKER_HUB_USR}/${REPO_NAME}-add:${IMAGE_TAG} ./add-service
            docker build -t ${DOCKER_HUB_USR}/${REPO_NAME}-subtract:${IMAGE_TAG} ./subtract-service
          '''
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        echo 'Step 3: Pushing to Docker Hub...'
        script {
          sh '''
            docker login -u ${DOCKER_HUB_USR} -p ${DOCKER_HUB_PSW}
            docker push ${DOCKER_HUB_USR}/${REPO_NAME}-gateway:${IMAGE_TAG}
            docker push ${DOCKER_HUB_USR}/${REPO_NAME}-add:${IMAGE_TAG}
            docker push ${DOCKER_HUB_USR}/${REPO_NAME}-subtract:${IMAGE_TAG}
          '''
        }
      }
    }

    stage('Verify') {
      steps {
        echo 'Pipeline completed successfully!'
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