pipeline {
    agent any

    stages {
         stage('Check Node') {
            steps {
                sh 'which node && node -v && npm -v'
            }
         }
        stage('Build') {
            steps {
                sh ''' 
                ls -la
                npm --version
                node --version
                npm ci
                npm run build
                ls -la
                '''
            }
        }
         stage('Docker Test') {
            steps {
                sh 'docker ps'
            }
         }  
        stage('Build Docker image') {
            steps {
                sh ''' 
                docker build -t $IMAGE_NAME:$IMAGE_TAG .
                docker images
                '''
            }
        }
    }
}
