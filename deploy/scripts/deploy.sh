#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/opt/automation-sites/linkriseup"
COMPOSE_FILE="docker-compose.vps.yml"
SERVICE="linkriseup"

cd "$PROJECT_DIR"

echo "[1/4] Pulling latest code..."
git pull --ff-only origin main

echo "[2/4] Building image..."
docker compose -f "$COMPOSE_FILE" build "$SERVICE"

echo "[3/4] Starting container..."
docker compose -f "$COMPOSE_FILE" up -d "$SERVICE"

echo "[4/4] Status..."
docker compose -f "$COMPOSE_FILE" ps

echo "Done: deployment complete."
