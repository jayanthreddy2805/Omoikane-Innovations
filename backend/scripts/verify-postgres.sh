#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
pg_bin=${PG_BINDIR:-$(pg_config --bindir)}
port=${READINESS_TEST_PORT:-55432}
[[ "$port" =~ ^[0-9]+$ ]] || { echo 'Invalid test port'; exit 1; }
fixture=$(mktemp -d "${TMPDIR:-/tmp}/omoikane-readiness.XXXXXX")
api_pid=
cleanup() {
  if [[ -n "$api_pid" ]]; then kill "$api_pid" 2>/dev/null || true; fi
  "$pg_bin/pg_ctl" -D "$fixture/data" -m immediate stop >/dev/null 2>&1 || true
  rm -rf -- "$fixture"
}
trap cleanup EXIT
"$pg_bin/initdb" -D "$fixture/data" --auth=trust --no-locale > "$fixture/init.log"
# No Unix socket and no public listener. This contains only synthetic test records.
"$pg_bin/pg_ctl" -D "$fixture/data" -l "$fixture/postgres.log" -o "-h 127.0.0.1 -p $port -k ''" start
"$pg_bin/createdb" -h 127.0.0.1 -p "$port" omoikane_readiness
args=(--batch-mode --no-transfer-progress -Dtest=PostgresReadinessIT)
if [[ -n ${MAVEN_SETTINGS_FILE:-} ]]; then args+=(-s "$MAVEN_SETTINGS_FILE"); fi
if [[ -n ${MAVEN_TEST_ARG_LINE:-} ]]; then args+=("-DargLine=$MAVEN_TEST_ARG_LINE"); fi
READINESS_TEST_DATABASE_URL="jdbc:postgresql://127.0.0.1:$port/omoikane_readiness" ./mvnw "${args[@]}" test


if [[ ${READINESS_RESTORE_REHEARSAL:-0} == 1 ]]; then
  # This cluster was created above on loopback and contains synthetic records only.
  # Production backups/restores are deliberately outside this script's scope.
  db_args=(-h 127.0.0.1 -p "$port" -U "$(id -un)")
  "$pg_bin/pg_dump" "${db_args[@]}" --format=custom --no-owner --no-acl \
    --file="$fixture/recovery.dump" omoikane_readiness
  "$pg_bin/createdb" "${db_args[@]}" omoikane_restore
  "$pg_bin/pg_restore" "${db_args[@]}" --exit-on-error --single-transaction --no-owner --no-acl \
    --dbname=omoikane_restore "$fixture/recovery.dump"
  for db in omoikane_readiness omoikane_restore; do
    "$pg_bin/psql" "${db_args[@]}" -XAt -v ON_ERROR_STOP=1 --dbname="$db" \
      --file=scripts/recovery-fingerprint.sql > "$fixture/$db.json"
  done
  diff -u "$fixture/omoikane_readiness.json" "$fixture/omoikane_restore.json"
  echo 'PASS isolated custom-format backup/restore: migrations, indexes, row counts and resume bytes match'
fi

if [[ ${READINESS_FRONTEND_E2E:-0} == 1 ]]; then
  # All production-sensitive configuration is overridden. No provider calls or retention jobs.
  "${JAVA_HOME:+$JAVA_HOME/bin/}java" -jar target/api-0.0.1-SNAPSHOT.jar \
    --spring.profiles.active=prod --spring.config.import= \
    "--spring.datasource.url=jdbc:postgresql://127.0.0.1:$port/omoikane_readiness" \
    "--spring.datasource.username=$(id -un)" --spring.datasource.password= \
    --app.admin.secret-key=readiness-test-only --app.cors.allowed-origins=http://127.0.0.1:3019 \
    --app.resend.api-key= --app.resend.from-email= --app.resend.admin-email= \
    --app.retention.enabled=false --app.email.worker-enabled=false \
    --app.rate-limit.requests-per-minute=1000 --server.address=127.0.0.1 --server.port=18080 > "$fixture/api.log" 2>&1 &
  api_pid=$!
  (cd ../frontend && BUSINESS_API_ORIGIN=http://127.0.0.1:18080 node scripts/verify-integrated-api.mjs)
fi
