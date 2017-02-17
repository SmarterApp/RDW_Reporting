package rdw.reporting.security;

import org.immutables.value.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Value.Immutable
@Value.Style(get = {"get*", "is*"})
public interface User extends UserDetails {

	String getId();
	@Value.Auxiliary String getEmail();
	@Value.Auxiliary String getGivenName();
	@Value.Auxiliary List<Tenancy> getTenancyChain();
	@Value.Auxiliary String getPassword();
	@Value.Auxiliary String getUsername();
	@Value.Auxiliary Collection<GrantedAuthority> getAuthorities();
	@Value.Auxiliary boolean isAccountNonExpired();
	@Value.Auxiliary boolean isAccountNonLocked();
	@Value.Auxiliary boolean isCredentialsNonExpired();
	@Value.Auxiliary boolean isEnabled();

}
