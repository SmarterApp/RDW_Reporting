package rdw.reporting.models;

import org.immutables.value.Value;

import javax.validation.constraints.NotNull;
import java.util.Locale;

@Value.Immutable
public interface Translation {

	@NotNull String getCode();
	@NotNull Locale getLocale();
	@Value.Auxiliary String getMessage();

}
