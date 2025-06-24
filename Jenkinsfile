pipeline {
    agent any

    environment {
        IMAGE_NAME_FRONTEND = "myapp-frontend"
        IMAGE_TAG_FRONTEND = "latest"
        IMAGE_NAME_BACKEND = "myapp-backend"
        IMAGE_TAG_BACKEND = "latest"
    }

    stages {

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
                        # If using TypeScript: npm run build
                        ls -la
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend Docker') {
                    steps {
                        dir('frontend') {
                            sh '''
                                docker build --no-cache -t $IMAGE_NAME_FRONTEND:$IMAGE_TAG_FRONTEND .
                                docker images | grep $IMAGE_NAME_FRONTEND
                            '''
                        }
                    }
                }

                stage('Build Backend Docker') {
                    steps {
                        dir('backend') {
                            sh '''
                                docker build --no-cache -t $IMAGE_NAME_BACKEND:$IMAGE_TAG_BACKEND .
                                docker images | grep $IMAGE_NAME_BACKEND
                            '''
                        }
                    }
                }
            }
        }

     stage('Push image to GAR') {
    steps {
        withCredentials([file(credentialsId: 'GCP-GAR', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
            sh '''
                echo "Authenticating with GCP..."
                gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                gcloud auth configure-docker asia-southeast1-docker.pkg.dev

                echo "Tagging images for GAR..."
                docker tag $IMAGE_NAME_FRONTEND:$IMAGE_TAG_FRONTEND ${DOCKER_REG_URL}/${DOCKER_REG_NAME}/${REG_REPO}/$IMAGE_NAME_FRONTEND:$IMAGE_TAG_FRONTEND
                docker tag $IMAGE_NAME_BACKEND:$IMAGE_TAG_BACKEND asia-southeast1-docker.pkg.dev/tdg-sec-non-prod-bnxe/docker-images/$IMAGE_NAME_BACKEND:$IMAGE_TAG_BACKEND

                echo "Pushing frontend to GAR..."
                docker push asia-southeast1-docker.pkg.dev/tdg-sec-non-prod-bnxe/docker-images/$IMAGE_NAME_FRONTEND:$IMAGE_TAG_FRONTEND

                echo "Pushing backend to GAR..."
                docker push asia-southeast1-docker.pkg.dev/tdg-sec-non-prod-bnxe/docker-images/$IMAGE_NAME_BACKEND:$IMAGE_TAG_BACKEND
            '''
        }
    }
}

    }
}
