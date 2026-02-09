#!/bin/bash
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="${BACKUP_DIR:-/var/backups/hela-site}"
mkdir -p "$BACKUP_DIR"

echo "Backing up database..."
cp prisma/dev.db "$BACKUP_DIR/database_$TIMESTAMP.db"

echo "Backing up uploads..."
tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" public/uploads/

# Keep only last 7 backups
echo "Cleaning old backups..."
ls -t "$BACKUP_DIR"/database_* 2>/dev/null | tail -n +8 | xargs rm -f 2>/dev/null || true
ls -t "$BACKUP_DIR"/uploads_* 2>/dev/null | tail -n +8 | xargs rm -f 2>/dev/null || true

echo "Backup complete: $TIMESTAMP"
echo "Location: $BACKUP_DIR"
