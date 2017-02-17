package rdw.reporting.config;

import org.immutables.value.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "saml")
@Value.Modifiable
@Value.Style(passAnnotations = {Component.class, ConfigurationProperties.class})
public interface SAMLProperties {

	/**
	 * The full file path to the Java KeyStore (JKS) file.
	 */
	String getKeyStoreFile();

	/**
	 * Password for the JKS File.
	 */
	String getKeyStorePassword();

	/**
	 * Private key alias in JKS used for SAML signing.
	 */
	String getPrivateKeyEntryAlias();

	/**
	 * Private kel alias password. May be same as JKS file password.
	 */
	String getPrivateKeyEntryPassword();

	/**
	 * Identity provider metadata URL.
	 */
	String getIdpMetadataUrl();

	/**
	 * Service Provider entity id as registered in the IDP circle of trust.
	 */
	String getSpEntityId();

}