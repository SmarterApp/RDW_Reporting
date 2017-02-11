package rdw.reporting.model;

import org.immutables.value.Value;

import java.util.Set;

@Value.Immutable
public interface Group {

	long getId();
	@Value.Auxiliary String getName();
	@Value.Auxiliary Set<Student> getStudents();

}
