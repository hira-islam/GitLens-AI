#!/bin/bash

set -euo pipefail

############################################################
# GitLens-AI Production Deployment Script
############################################################

PROJECT_DIR="$HOME/GitLens-AI"
DEPLOYMENT_DIR="$PROJECT_DIR/.deployment"
LOG_FILE="$DEPLOYMENT_DIR/deploy.log"
PREVIOUS_IMAGE_TAG_FILE="$DEPLOYMENT_DIR/previous_image_tag"

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
# Backup Current Image Tag
############################################################

backup_current_image_tag() {

    local current_tag

    current_tag=$(get_current_image_tag)

    echo "IMAGE_TAG=$current_tag" > "$PREVIOUS_IMAGE_TAG_FILE"

    log_success "Previous image tag backed up: $current_tag"
}

############################################################
# Restore Previous Image Tag
############################################################

restore_previous_image_tag() {

    if [ ! -f "$PREVIOUS_IMAGE_TAG_FILE" ]; then
        log_error "Rollback failed. Backup image tag not found."
        exit 1
    fi

    cp "$PREVIOUS_IMAGE_TAG_FILE" .env.production

    log_success "Previous image tag restored."
}

############################################################
# Rollback
############################################################

rollback() {

    log_warn "Health check failed."
    log_warn "Starting automatic rollback..."

    restore_previous_image_tag

    log_info "Stopping failed deployment..."

    "${COMPOSE[@]}" down

    log_success "Failed deployment stopped."

    log_info "Pulling previous Docker images..."

    "${COMPOSE[@]}" pull

    log_success "Previous Docker images pulled successfully."

    log_info "Starting previous application version..."

    "${COMPOSE[@]}" up -d --force-recreate --remove-orphans

    log_success "Previous application version started."

    log_info "Waiting for rollback startup..."

    sleep 10

    log_info "Running rollback health check..."

    if curl --fail http://localhost/api/ready >/dev/null; then

        log_success "Rollback completed successfully."

    else

        log_error "Rollback health check failed."
        log_error "Manual intervention required."

        exit 1

    fi
}

############################################################
# Deploy
############################################################

deploy() {

    log_info "Pulling Docker images..."

    "${COMPOSE[@]}" pull

    log_success "Docker images pulled successfully."

    set_image_tag

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

    if curl --fail http://localhost/api/ready >/dev/null; then

        log_success "Health check passed."

    else

        rollback

    fi
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

    backup_current_image_tag

    deploy

    health_check

    cleanup

    log_success "Deployment completed successfully."

    echo
    echo "========================================"
    echo " Deployment Summary"
    echo "========================================"
    echo "Previous Image : $(cut -d '=' -f2 "$PREVIOUS_IMAGE_TAG_FILE")"
    echo "Current Image  : $NEW_IMAGE_TAG"
    echo "Status         : SUCCESS"
    echo "Completed At   : $(date '+%F %T')"
    echo "========================================"
}

main