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

write_log() {

    local level="$1"
    local message="$2"

    mkdir -p "$DEPLOYMENT_DIR"
    touch "$LOG_FILE"

    local timestamp
    timestamp=$(date '+%F %T')

    echo "[$level] $message"
    echo "$timestamp [$level] $message" >> "$LOG_FILE"
}

log_info() {
    write_log "INFO" "$1"
}

log_success() {
    write_log "SUCCESS" "$1"
}

log_warn() {
    write_log "WARN" "$1"
}

log_error() {
    write_log "ERROR" "$1"
}

############################################################
# Validation
############################################################

validate() {

    cd "$PROJECT_DIR"

    log_info "Validating production environment..."

    REQUIRED_FILES=(
        ".env.production"
        ".env.backend"
        "docker-compose.prod.yml"
    )

    for file in "${REQUIRED_FILES[@]}"
    do
        if [ ! -f "$file" ]; then
            log_error "Missing required file: $file"
            exit 1
        fi
    done

    if ! command -v docker >/dev/null 2>&1; then
        log_error "Docker is not installed."
        exit 1
    fi

    if ! docker compose version >/dev/null 2>&1; then
        log_error "Docker Compose is unavailable."
        exit 1
    fi

    log_success "Environment validation completed."
}

############################################################
# Validate Image Tag
############################################################

validate_image_tag() {

    if [ -z "$NEW_IMAGE_TAG" ]; then
        log_error "Image tag argument is required."
        exit 1
    fi

    if [[ ! "$NEW_IMAGE_TAG" =~ ^[a-f0-9]{7,40}$ ]]; then
        log_error "Invalid image tag: $NEW_IMAGE_TAG"
        exit 1
    fi

    log_info "Target image tag: $NEW_IMAGE_TAG"
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

    log_info "Previous image tag: $current_tag"

    sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$NEW_IMAGE_TAG/" .env.production

    log_success "Deployment image tag updated."
}

############################################################
# Deploy
############################################################

deploy() {

    log_info "Pulling Docker images..."

    "${COMPOSE[@]}" pull

    log_success "Docker images pulled successfully."

    log_info "Stopping existing containers..."

    "${COMPOSE[@]}" down

    log_success "Existing containers stopped."

    log_info "Starting application..."

    "${COMPOSE[@]}" up -d

    log_success "Application started."
}

############################################################
# Health Check
############################################################

health_check() {

    log_info "Waiting for application startup..."

    sleep 10

    log_info "Running application health check..."

    curl --fail http://localhost/api/health >/dev/null

    log_success "Health check passed."
}

############################################################
# Cleanup
############################################################

cleanup() {

    log_info "Cleaning unused Docker images..."

    docker image prune -f

    log_success "Docker cleanup completed."
}

############################################################
# Main
############################################################

main() {

    echo "========================================"
    echo " GitLens-AI Production Deployment"
    echo "========================================"

    log_info "Deployment started."
    log_info "Timestamp : $(date '+%F %T')"
    log_info "Server    : $(hostname)"
    log_info "User      : $(whoami)"

    validate

    validate_image_tag

    set_image_tag

    deploy

    health_check

    cleanup

    log_success "Deployment completed successfully."

    echo
    echo "========================================"
    echo " Deployment Summary"
    echo "========================================"
    echo "Previous Image : $(grep '^IMAGE_TAG=' "$PROJECT_DIR/.deployment/previous_image_tag" 2>/dev/null || echo "Recorded during rollback implementation")"
    echo "Current Image  : $NEW_IMAGE_TAG"
    echo "Status         : SUCCESS"
    echo "Completed At   : $(date '+%F %T')"
    echo "========================================"
}

main