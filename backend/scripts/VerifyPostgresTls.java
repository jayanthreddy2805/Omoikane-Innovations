import java.io.DataOutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.List;
import java.util.Properties;
import javax.net.ssl.SNIHostName;
import javax.net.ssl.SSLParameters;
import javax.net.ssl.SSLSocket;
import org.postgresql.ssl.DefaultJavaSSLFactory;
import org.postgresql.ssl.PGjdbcHostnameVerifier;

/**
 * Credential-free PostgreSQL TLS preflight using the application's pgJDBC driver.
 * Usage (JDK 21): java --class-path /path/to/postgresql.jar \
 *   scripts/VerifyPostgresTls.java <explicit-neon-hostname>
 * Sends SSLRequest only: no authentication, SQL, Flyway, writes or emails.
 * Run with the intended runtime trust store; a workspace pass does not prove
 * the deployed container's trust configuration.
 */
class VerifyPostgresTls {
    public static void main(String[] args) throws Exception {
        if (args.length != 1 || !args[0].matches("[a-z0-9.-]+\\.neon\\.tech")) {
            throw new IllegalArgumentException("Supply one explicit Neon hostname, without a URL or credentials");
        }
        String host = args[0];
        try (Socket raw = new Socket()) {
            raw.connect(new InetSocketAddress(host, 5432), 10000);
            raw.setSoTimeout(10000);
            DataOutputStream request = new DataOutputStream(raw.getOutputStream());
            request.writeInt(8);
            request.writeInt(80877103); // PostgreSQL SSLRequest, not StartupMessage.
            request.flush();
            if (raw.getInputStream().read() != 'S') {
                throw new IllegalStateException("Server did not accept PostgreSQL TLS negotiation");
            }
            DefaultJavaSSLFactory factory = new DefaultJavaSSLFactory(new Properties());
            try (SSLSocket tls = (SSLSocket) factory.createSocket(raw, host, 5432, true)) {
                SSLParameters parameters = tls.getSSLParameters();
                parameters.setServerNames(List.of(new SNIHostName(host)));
                parameters.setEndpointIdentificationAlgorithm("HTTPS");
                tls.setSSLParameters(parameters);
                tls.startHandshake(); // Default Java trust manager validates the chain.
                boolean validHost = PGjdbcHostnameVerifier.INSTANCE.verify(host, tls.getSession());
                boolean wrongHostRejected = !PGjdbcHostnameVerifier.INSTANCE.verify(
                        "hostname-check.invalid", tls.getSession());
                if (!validHost || !wrongHostRejected) {
                    throw new IllegalStateException("pgJDBC hostname verification failed its positive/negative checks");
                }
                System.out.printf(
                        "{\"certificateChainTrusted\":true,\"hostnameVerified\":true,"
                        + "\"wrongHostnameRejected\":true,\"protocol\":\"%s\","
                        + "\"driverVersion\":\"%s\",\"authenticated\":false,\"sqlExecuted\":false}%n",
                        tls.getSession().getProtocol(),
                        DefaultJavaSSLFactory.class.getPackage().getImplementationVersion());
            }
        }
    }
}
