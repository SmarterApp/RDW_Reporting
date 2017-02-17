package rdw.reporting.security;

import org.immutables.value.Value;

@Value.Immutable
@Value.Style(get = {"get*", "is*"})
public interface Tenancy {

	String getRoleId();
	@Value.Auxiliary String getName();
	@Value.Auxiliary String getLevel();
	@Value.Auxiliary String getClientId();
	@Value.Auxiliary String getClient();
	@Value.Auxiliary String getGroupOfStatesId();
	@Value.Auxiliary String getGroupOfStates();
	@Value.Auxiliary String getStateId();
	@Value.Auxiliary String getState();
	@Value.Auxiliary String getGroupOfDistrictsId();
	@Value.Auxiliary String getGroupOfDistricts();
	@Value.Auxiliary String getDistrictId();
	@Value.Auxiliary String getDistrict();
	@Value.Auxiliary String getGroupOfInstitutionsId();
	@Value.Auxiliary String getGroupOfInstitutions();
	@Value.Auxiliary String getInstitutionId();
	@Value.Auxiliary String getInstitution();

}
