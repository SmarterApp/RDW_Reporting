package rdw.reporting.security;

import com.google.common.base.Splitter;
import com.google.common.collect.Sets;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.saml.SAMLCredential;
import org.springframework.security.saml.userdetails.SAMLUserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class SAMLUserDetailsServiceImpl implements SAMLUserDetailsService {

	public Object loadUserBySAML(SAMLCredential credential) throws UsernameNotFoundException {

		final List<Tenancy> tenancyChain = Stream.of(credential.getAttributeAsStringArray("sbacTenancyChain"))
			.map(rawTenancy -> {
				final List<String> values = Splitter.on("|").trimResults().splitToList(rawTenancy);
				return ImmutableTenancy.builder()
					.roleId(values.get(1))
					.name(values.get(2))
					.level(values.get(3))
					.clientId(values.get(4))
					.client(values.get(5))
					.groupOfStatesId(values.get(6))
					.groupOfStates(values.get(7))
					.stateId(values.get(8))
					.state(values.get(9))
					.groupOfDistrictsId(values.get(10))
					.groupOfDistricts(values.get(11))
					.districtId(values.get(12))
					.district(values.get(13))
					.groupOfInstitutionsId(values.get(14))
					.groupOfInstitutions(values.get(15))
					.institutionId(values.get(16))
					.institution(values.get(17))
					.build();
			})
			.collect(Collectors.toList());

		/*
			TODO: map sbacTenancyChain to authorities (roles and permissions)
		 */

		return ImmutableUser.builder()
			.id(credential.getAttributeAsString("sbacUUID"))
			.email(credential.getAttributeAsString("mail"))
			.givenName(credential.getAttributeAsString("givenName"))
			.tenancyChain(tenancyChain)
			.username(credential.getNameID().getValue())
			.password("[REDACTED]")
			.enabled(true)
			.credentialsNonExpired(true)
			.accountNonExpired(true)
			.accountNonLocked(true)
			.authorities(Sets.newHashSet(new SimpleGrantedAuthority("ROLE_USER")))
			.build();
	}

}