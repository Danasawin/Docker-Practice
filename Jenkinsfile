pipeline {
    agent any

    stages {
        stage('Build') {
            agent{
                docker{
                    image 'node:22-alpine'
                }
            }
            steps {
                sh ''' 
                npm --version
                node --version
                
                '''
            }
        }
    }
}
