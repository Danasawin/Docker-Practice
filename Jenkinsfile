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
        
        stage('Test') {
            steps {
                sh ''' 
                npm run test
                '''
            }
        }
    }
}
