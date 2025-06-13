pipeline {
    agent any

    stages {
        stage('Build') {
            agent{
                docker{
                    image 'node:18-alpine'
                    reuseNode True
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
