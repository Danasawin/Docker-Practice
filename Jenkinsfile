pipeline {
    agent any

    environment {
        IMAGE_NAME_FRONTEND = "myapp-frontend"
        IMAGE_NAME_BACKEND  = "myapp-backend"
        IMAGE_TAG           = "${BUILD_NUMBER}"           // Jenkins build number
        LATEST_TAG          = "${params.Push_Tag}"        // parameter from Jenkins UI
        DOCKER_REG_URL      = "${params.DOCKER_REG_URL}"  // parameter from Jenkins UI
        DOCKER_REG_NAME     = "${params.DOCKER_REG_NAME}" // parameter from Jenkins UI
        REG_REPO            = "${params.REG_REPO}"        // parameter from Jenkins UI
    }

    stages {
        stage('Checkout Code') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        stage('Check Node & Docker') {
            steps {
                sh '''
                    which node && node -v && npm -v
                    docker --version
                    docker ps
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "Installing frontend dependencies..."
                        npm ci
                        echo "Building frontend..."
                        npm run build
                        ls -la
                    '''
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh '''
                        echo "Installing backend dependencies..."
                        npm ci
                        echo "Backend build (optional for JS)..."
                        ls -la
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Frontend Docker') {
                    steps {
                        dir('frontend') {
                            sh '''
                                echo "Building frontend Docker image..."
                                docker build --no-cache -t $IMAGE_NAME_FRONTEND:$IMAGE_TAG .
                                docker tag $IMAGE_NAME_FRONTEND:$IMAGE_TAG $IMAGE_NAME_FRONTEND:$LATEST_TAG
                                docker images | grep $IMAGE_NAME_FRONTEND
                            '''
                        }
                    }
                }

                stage('Backend Docker') {
                    steps {
                        dir('backend') {
                            sh '''
                                echo "Building backend Docker image..."
                                docker build --no-cache -t $IMAGE_NAME_BACKEND:$IMAGE_TAG .
                                docker tag $IMAGE_NAME_BACKEND:$IMAGE_TAG $IMAGE_NAME_BACKEND:$LATEST_TAG
                                docker images | grep $IMAGE_NAME_BACKEND
                            '''
                        }
                    }
                }
            }
        }

        stage('Push images to GAR') {
            steps {
                withCredentials([file(credentialsId: 'GCP-GAR', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh '''
                        echo "Authenticating with GCP..."
                        gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                        gcloud auth configure-docker $DOCKER_REG_URL

                        echo "Tagging images for GAR..."

                        # Frontend
                        docker tag $IMAGE_NAME_FRONTEND:$IMAGE_TAG $DOCKER_REG_URL/$DOCKER_REG_NAME/$REG_REPO/$IMAGE_NAME_FRONTEND:$IMAGE_TAG
                        docker tag $IMAGE_NAME_FRONTEND:$LATEST_TAG $DOCKER_REG_URL/$DOCKER_REG_NAME/$REG_REPO/$IMAGE_NAME_FRONTEND:$LATEST_TAG

                        # Backend
                        docker tag $IMAGE_NAME_BACKEND:$IMAGE_TAG $DOCKER_REG_URL/$DOCKER_REG_NAME/$REG_REPO/$IMAGE_NAME_BACKEND:$IMAGE_TAG
                        docker tag $IMAGE_NAME_BACKEND:$LATEST_TAG $DOCKER_REG_URL/$DOCKER_REG_NAME/$REG_REPO/$IMAGE_NAME_BACKEND:$LATEST_TAG

                        echo "Pushing frontend to GAR..."
                        docker push $DOCKER_REG_URL/$DOCKER_REG_NAME/$REG_REPO/$IMAGE_NAME_FRONTEND:$IMAGE_TAG
                        docker push $DOCKER_REG_URL/$DOCKER_REG_NAME/$REG_REPO/$IMAGE_NAME_FRONTEND:$LATEST_TAG

                        echo "Pushing backend to GAR..."
                        docker push $DOCKER_REG_URL/$DOCKER_REG_NAME/$REG_REPO/$IMAGE_NAME_BACKEND:$IMAGE_TAG
                        docker push $DOCKER_REG_URL/$DOCKER_REG_NAME/$REG_REPO/$IMAGE_NAME_BACKEND:$LATEST_TAG
                    '''
                }
            }
        }
        stage('Trigger Run Image Container Pipeline') {
    steps {
        script {
            // Use current build number or IMAGE_TAG as tag
            def tagToPass = env.BUILD_NUMBER

            // Trigger the downstream pipeline, passing IMAGE_TAG parameter
            build job: 'Run Image Container', parameters: [
                string(name: 'IMAGE_TAG', value: tagToPass)
            ]
        }
    }
}

    }
}
