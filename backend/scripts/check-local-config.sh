#!/bin/sh
# Check the local Spring properties file without executing it or printing secrets.
set -eu

backend_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
env_file="$backend_dir/.env"

if [ ! -f "$env_file" ]; then
  printf '%s\n' 'backend/.env is missing. Copy backend/.env.example and set your database values.' >&2
  exit 1
fi

check_property() {
  key=$1
  value=$(sed -n "s/^[[:space:]]*$key[[:space:]]*=[[:space:]]*//p" "$env_file" | tail -n 1 | tr -d '\r' | sed 's/[[:space:]]*$//')
  if [ -z "$value" ]; then
    printf '%s\n' "$key is missing or empty in backend/.env." >&2
    exit 1
  fi
  case "$value" in
    \"*\"|\'*\')
      printf '%s\n' "$key has surrounding quotes. Remove them: Spring reads .env as a properties file and treats quotes as part of the value." >&2
      exit 1
      ;;
  esac
  if [ "$key" = DATABASE_URL ]; then
    case "$value" in
      jdbc:postgresql://*) ;;
      *)
        printf '%s\n' 'DATABASE_URL must begin with jdbc:postgresql:// (the Neon postgresql:// URL needs the jdbc: prefix).' >&2
        exit 1
        ;;
    esac
  fi
}

check_property DATABASE_URL
check_property DATABASE_USERNAME
check_property DATABASE_PASSWORD
printf '%s\n' 'Local database configuration format looks valid. Run ./mvnw spring-boot:run from backend/ to verify the connection.'
