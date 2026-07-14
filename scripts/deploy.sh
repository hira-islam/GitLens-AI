#!/bin/bash

set -euo pipefail

############################################################
# GitLens-AI Production Deployment Script
############################################################

PROJECT_DIR="$HOME/GitLens-AI"
DEPLOYMENT_DIR="$PROJECT_DIR/.deployment"
LOG_FILE="$DEPLOYMENT_DIR/deploy.log"

COMPOSE="docker compose --env-file .env.production -f docker-compose.prod.yml"

############################################################
# Logging
############################################################

log() {

    mkdir -p "$DEPLOYMENT_DIR"
    touch "$LOG_FILE"

    echo "[INFO] $1"
    echo "$(date '+%F %T') [INFO] $1" >> "$LOG_FILE"
}

error() {

    mkdir -p "$DEPLOYMENT_DIR"
    touch "$LOG_FILE"

    echo "[ERROR] $1"
    echo "$(date '+%F %T') [ERROR] $1" >> "$LOG_FILE"
}

############################################################
# Validation
############################################################

validate() {

    cd "$PROJECT_DIR"

    log "Validating production environment..."

    REQUIRED_FILES=(
        ".env.production"
        ".env.backend"
        "docker-compose.prod.yml"
    )

    for file in "${REQUIRED_FILES[@]}"
    do
        if [ ! -f "$file" ]; then
            error "Missing required file: $file"
            exit 1
        fi
    done

    log "Checking Docker installation..."

    if ! command -v docker >/dev/null 2>&1; then
        error "Docker is not installed."
        exit 1
    fi

    if ! docker compose version >/dev/null 2>&1; then
        error "Docker Compose is unavailable."
        exit 1
    fi

    log "Validation completed successfully."
}

############################################################
# Deployment
############################################################

deploy() {

    log "Pulling Docker images..."

    $COMPOSE pull

    log "Stopping existing containers..."

    $COMPOSE down

    log "Starting application..."

    $COMPOSE up -d
}

############################################################
# Health Check
############################################################

health_check() {

    log "Waiting for application startup..."

    sleep 10

    log "Running application health check..."

    curl --fail http://localhost/api/health >/dev/null

    log "Health check passed."
}

############################################################
# Cleanup
############################################################

cleanup() {

    log "Cleaning unused Docker images..."

    docker image prune -f

    log "Docker cleanup completed."
}

############################################################
# Main
############################################################

main() {

    echo "========================================"
    echo " GitLens-AI Production Deployment"
    echo "========================================"

    validate

    deploy

    health_check

    cleanup

    log "Deployment completed successfully."

    echo ""
    echo "========================================"
    echo " Deployment Completed Successfully"
    echo "========================================"
}

main