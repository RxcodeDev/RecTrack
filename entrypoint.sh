#!/bin/sh
# Fix permissions on Docker named volumes (mounted as root on first creation).
# This script runs as root, chowns the runtime-writable dirs, then drops to
# the unprivileged nextjs user for the actual application process.
chown -R nextjs:nodejs /app/data /app/public/uploads
exec su-exec nextjs "$@"
