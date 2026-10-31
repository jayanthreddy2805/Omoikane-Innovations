# Omoikane Innovations — Backend API

Spring Boot 3.4 backend service providing the contact form API for Omoikane Innovations.

## Features
- **Endpoint**: `POST /api/contact` for contact form submissions.
- **Persistence**: PostgreSQL database with Spring Data JPA.
- **Database Migrations**: Flyway automatic schema versioning (`V1__create_contact_submissions.sql`).
- **Input Validation**: Jakarta Bean Validation (`@NotBlank`, `@Email`, `@Size`) with field length constraints.
- **Safe Responses**: Consistent JSON response envelop (`ContactResponse`) and `GlobalExceptionHandler` preventing internal error or stack trace leakage.
- **Rate Limiting**: In-memory token bucket rate limiting via Bucket4j (5 submissions/min per client IP).
- **CORS Protection**: Restricted to configured frontend origins (no wildcard CORS).
- **Email Notifications**: Async confirmation emails via Resend HTTPS API, with graceful failure fallback (submissions are saved even if email fails or credentials are unset).

---

## Prerequisites

1. **Java 21 JDK** (e.g. Eclipse Temurin 21 or Oracle JDK 21)
2. **Apache Maven 3.9+** (or use the included Maven Wrapper `mvnw` / `mvnw.cmd` once Java 21 is set in `JAVA_HOME`)
3. **PostgreSQL 14+**

---

## Local Database Setup

1. Start your local PostgreSQL server.
2. Create a database and user:
   ```sql
   CREATE DATABASE omoikane;
   CREATE USER omoikane WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE omoikane TO omoikane;
   ```
   *(On PostgreSQL 15+, also grant schema privileges if required: `GRANT ALL ON SCHEMA public TO omoikane;`)*

3. Schema migrations will run automatically on application startup using Flyway. Hibernate DDL generation is disabled in production (`spring.jpa.hibernate.ddl-auto=validate`).

---

## Environment Configuration

Copy `.env.example` to `.env` (or set system environment variables):

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `SERVER_PORT` | `8080` | HTTP port for the Spring Boot server |
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/omoikane` | JDBC connection URL |
| `DATABASE_USERNAME` | `omoikane` | PostgreSQL username |
| `DATABASE_PASSWORD` | *(empty)* | PostgreSQL password |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated list of allowed frontend origins |
| `RESEND_API_KEY` | *(empty)* | Resend API key (`re_...`). Leave blank to skip email sending |
| `RESEND_FROM_EMAIL` | *(empty)* | Sender email address verified in Resend |
| `RATE_LIMIT_RPM` | `5` | Submissions allowed per minute per client IP |

### Resend Email Setup
- **Testing without a custom domain:** Resend provides a sandbox test address `onboarding@resend.dev`. Note that in testing mode, Resend only allows sending to the email address registered to your Resend account.
- **Production:** Verify your custom sending domain in the Resend dashboard (e.g. `notifications@omoikaneinnovations.com`) and configure `RESEND_FROM_EMAIL` with that address.
- If `RESEND_API_KEY` or `RESEND_FROM_EMAIL` is omitted, the API will log an informational notice and gracefully skip email delivery without interrupting the user submission.

---

## Rate Limiting & Architecture Notes

- The rate limiter uses **Bucket4j** with an in-memory token bucket per client IP.
- **Single-instance note:** An in-memory rate limiter maintains buckets in the local JVM heap. If running multiple application instances behind a load balancer, client limits will be local to each instance. For multi-node deployments, configure a centralized cache (such as Redis) with Bucket4j.
- **IP Resolution:** The filter uses `request.getRemoteAddr()` (the TCP peer address) rather than blindly trusting spoofable headers like `X-Forwarded-For`. When deploying behind a trusted reverse proxy (e.g., Nginx, AWS ALB), enable Spring's native forward header strategy:
  ```properties
  server.forward-headers-strategy=NATIVE
  ```

---

## Building and Running the Backend

### Build and Test
```bash
# Run tests (uses H2 in-memory test database, no PostgreSQL needed)
./mvnw clean test

# Package JAR
./mvnw clean package -DskipTests
```

### Run
```bash
# Using Maven:
./mvnw spring-boot:run

# Or run the packaged JAR:
java -jar target/api-0.0.1-SNAPSHOT.jar
```

---

## Running the Frontend

In a separate terminal:
```bash
cd ../frontend
npm install
npm run dev
```

The Next.js frontend runs on `http://localhost:3000` and submits contact requests to `http://localhost:8080/api/contact` (or `NEXT_PUBLIC_API_BASE_URL` if set).

---

## API Documentation

### `POST /api/contact`

Submits an enquiry from the contact form.

#### Request Headers
```http
Content-Type: application/json
Accept: application/json
```

#### Request Body
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "company": "Aerospace Corp",
  "phone": "+919876543210",
  "message": "We would like to discuss UAV flight control systems."
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | **Yes** | Max 255 chars, not blank |
| `email` | string | **Yes** | Valid email format, max 255 chars |
| `company` | string | No | Max 255 chars |
| `phone` | string | No | Max 50 chars |
| `message` | string | **Yes** | Max 5000 chars, not blank |

#### Responses

- **`201 Created`**: Submission successful.
  ```json
  {
    "success": true,
    "message": "Your enquiry has been submitted successfully."
  }
  ```

- **`400 Bad Request`**: Validation failure or invalid JSON.
  ```json
  {
    "success": false,
    "message": "email: Invalid email format; name: Name is required"
  }
  ```

- **`429 Too Many Requests`**: Rate limit exceeded (> 5 requests/min per IP).
  ```json
  {
    "success": false,
    "message": "Too many requests. Please try again later."
  }
  ```

---

## Testing Examples

### PowerShell
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

$body = @{
    name = "Test User"
    email = "test@example.com"
    company = "Test Org"
    phone = "+919876543210"
    message = "Testing contact endpoint submission."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/contact" -Method Post -Headers $headers -Body $body
```

### curl
```bash
curl -i -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Org",
    "phone": "+919876543210",
    "message": "Testing contact endpoint submission."
  }'
```
