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