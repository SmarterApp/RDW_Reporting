package rdw.reporting.model;

import org.immutables.value.Value;

@Value.Immutable
public interface Student {

	long getId();
	@Value.Auxiliary String getSsid();
	@Value.Auxiliary String getFirstName();
	@Value.Auxiliary String getLastName();

}
