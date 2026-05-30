pipeline {
    agent any

    environment {
        REPO_DIR  = '/opt/paygate-ui'
        DIST_DIR  = '/var/www/ceptecash'
    }

    stages {
        stage('Pull') {
            steps {
                sh '''
                    cd ${REPO_DIR}
                    git pull origin main
                '''
            }
        }

        stage('Install') {
            steps {
                sh '''
                    cd ${REPO_DIR}
                    npm ci
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    cd ${REPO_DIR}
                    npm run build
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    sudo rsync -a --delete ${REPO_DIR}/dist/ ${DIST_DIR}/
                '''
            }
        }
    }

    post {
        failure {
            echo 'Frontend deploy FAILED!'
        }
        success {
            echo 'Frontend deploy OK.'
        }
    }
}
