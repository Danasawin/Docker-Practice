pipeline {
    agent any

    environment {
        IMAGE_NAME_FRONTEND = "myapp-frontend"
        IMAGE_NAME_BACKEND = "myapp-backend"
    }

    stages {

        stage('Prepare Environment') {
            steps {
                script {
                    COMMIT_HASH = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.IMAGE_TAG = "build-${COMMIT_HASH}"
                    echo "Using image tag: ${env.IMAGE_TAG}"
                }
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
                        npm ci
                        npm run build
                    '''
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh '''
                        npm ci
                        # npm run build (if needed)
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
                                docker build --no-cache -t $IMAGE_NAME_FRONTEND:$IMAGE_TAG .
                            '''
                        }
                    }
                }

                stage('Build Backend Docker') {
                    steps {
                        dir('backend') {
                            sh '''
                                docker build --no-cache -t $IMAGE_NAME_BACKEND:$IMAGE_TAG .
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
                        gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                        gcloud auth configure-docker ${DOCKER_REG_URL}

                        docker tag $IMAGE_NAME_FRONTEND:$IMAGE_TAG ${DOCKER_REG_URL}/${DOCKER_REG_NAME}/${REG_REPO}/${IMAGE_NAME_FRONTEND}:${IMAGE_TAG}
                        docker tag $IMAGE_NAME_BACKEND:$IMAGE_TAG ${DOCKER_REG_URL}/${DOCKER_REG_NAME}/${REG_REPO}/${IMAGE_NAME_BACKEND}:${IMAGE_TAG}

                        docker push ${DOCKER_REG_URL}/${DOCKER_REG_NAME}/${REG_REPO}/${IMAGE_NAME_FRONTEND}:${IMAGE_TAG}
                        docker push ${DOCKER_REG_URL}/${DOCKER_REG_NAME}/${REG_REPO}/${IMAGE_NAME_BACKEND}:${IMAGE_TAG}

                        echo "IMAGE_TAG=${IMAGE_TAG}" > latest_tag.txt
                    '''
                }
            }
        }

        // Optional: archive tag file so the deploy pipeline can fetch it
        stage('Archive Tag Info') {
            steps {
                archiveArtifacts artifacts: 'latest_tag.txt', onlyIfSuccessful: true
            }
        }
    }
}
