#!/bin/bash

set -euo pipefail

############################################################
# GitLens-AI Production Deployment Script
############################################################

PROJECT_DIR="$HOME/GitLens-AI"
DEPLOYMENT_DIR="$PROJECT_DIR/.deployment"
LOG_FILE="$DEPLOYMENT_DIR/deploy.log"

NEW_IMAGE_TAG="${1:-}"

COMPOSE=(
    docker
    compose
    --env-file
    .env.production
    -f
    docker-compose.prod.yml
)

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
# Validate Image Tag
############################################################

validate_image_tag() {

    if [ -z "$NEW_IMAGE_TAG" ]; then
        error "Image tag argument is required."
        exit 1
    fi

    if [[ ! "$NEW_IMAGE_TAG" =~ ^[a-f0-9]{7,40}$ ]]; then
        error "Invalid image tag: $NEW_IMAGE_TAG"
        exit 1
    fi

    log "Deploying image tag: $NEW_IMAGE_TAG"
}

############################################################
# Get Current Image Tag
############################################################

get_current_image_tag() {

    grep '^IMAGE_TAG=' .env.production | cut -d '=' -f2
}

############################################################
# Set Image Tag
############################################################

set_image_tag() {

    local current_tag

    current_tag=$(get_current_image_tag)

    log "Current deployed image tag: $current_tag"

    sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$NEW_IMAGE_TAG/" .env.production

    log "Updated deployment image tag to: $NEW_IMAGE_TAG"
}

############################################################
# Deploy
############################################################

deploy() {

    log "Pulling Docker images..."

    "${COMPOSE[@]}" pull

    log "Stopping existing containers..."

    "${COMPOSE[@]}" down

    log "Starting application..."

    "${COMPOSE[@]}" up -d
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

    validate_image_tag

    set_image_tag

    deploy

    health_check

    cleanup

    log "Deployment completed successfully."

    echo
    echo "========================================"
    echo " Deployment Completed Successfully"
    echo "========================================"
}

main