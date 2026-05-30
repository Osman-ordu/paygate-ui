pipeline {
    agent any

    parameters {
        string(
            name: 'BRANCH',
            defaultValue: 'main',
            description: 'Deploy edilecek branch (örn: main, feature/xyz)'
        )
        string(
            name: 'ROLLBACK_TO',
            defaultValue: '',
            description: 'Rollback: önceki commit SHA gir (örn: a1b2c3d). Boş bırakırsan BRANCH deploy edilir.'
        )
    }

    environment {
        REPO_DIR      = '/opt/paygate-ui'
        RELEASES_DIR  = '/var/www/releases'
        LIVE_LINK     = '/var/www/ceptecash'
        KEEP_RELEASES = '10'
    }

    stages {

        stage('Rollback') {
            when { expression { params.ROLLBACK_TO?.trim() } }
            steps {
                script {
                    def tag = params.ROLLBACK_TO.trim()
                    echo "Rolling back frontend to ${tag}"
                    sh """
                        [ -d "${RELEASES_DIR}/${tag}" ] || \
                            (echo "HATA: ${RELEASES_DIR}/${tag} bulunamadi!" && exit 1)
                        ln -sfn ${RELEASES_DIR}/${tag} ${LIVE_LINK}
                        echo "Live: ${RELEASES_DIR}/${tag}"
                    """
                }
            }
        }

        stage('Pull') {
            when { expression { !params.ROLLBACK_TO?.trim() } }
            steps {
                sh """
                    cd ${REPO_DIR}
                    git fetch origin
                    git checkout ${params.BRANCH}
                    git reset --hard origin/${params.BRANCH}
                """
            }
        }

        stage('Install') {
            when { expression { !params.ROLLBACK_TO?.trim() } }
            steps {
                sh "cd ${REPO_DIR} && npm ci"
            }
        }

        stage('Build') {
            when { expression { !params.ROLLBACK_TO?.trim() } }
            steps {
                script {
                    env.GIT_SHA = sh(
                        script: "cd ${REPO_DIR} && git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                    echo "Building branch ${params.BRANCH} @ ${env.GIT_SHA}"
                    sh """
                        cd ${REPO_DIR}
                        VITE_API_BASE_URL=https://ceptecash.com/api npm run build
                        mkdir -p ${RELEASES_DIR}/${env.GIT_SHA}
                        cp -r dist/. ${RELEASES_DIR}/${env.GIT_SHA}/
                    """
                }
            }
        }

        stage('Deploy') {
            when { expression { !params.ROLLBACK_TO?.trim() } }
            steps {
                sh "ln -sfn ${RELEASES_DIR}/${GIT_SHA} ${LIVE_LINK}"
            }
        }

        stage('Verify') {
            steps {
                sh "curl -sf -o /dev/null https://ceptecash.com && echo 'Site OK' || echo 'Site kontrolu basarisiz'"
            }
        }

        stage('Cleanup Old Releases') {
            when { expression { !params.ROLLBACK_TO?.trim() } }
            steps {
                sh """
                    ls -t ${RELEASES_DIR} | tail -n +\$(( ${KEEP_RELEASES} + 1 )) | xargs -r -I{} rm -rf ${RELEASES_DIR}/{} || true
                """
            }
        }
    }

    post {
        success {
            script {
                def version = params.ROLLBACK_TO?.trim()
                    ? "ROLLBACK to ${params.ROLLBACK_TO}"
                    : "DEPLOY ${params.BRANCH} @ ${env.GIT_SHA}"
                echo "OK: Frontend ${version}"
            }
        }
        failure {
            echo 'FAILED — rollback icin ROLLBACK_TO parametresiyle tekrar calistir.'
        }
    }
}
