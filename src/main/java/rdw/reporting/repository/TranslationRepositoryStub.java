package rdw.reporting.repository;

import com.google.common.collect.Sets;
import org.springframework.stereotype.Repository;
import rdw.reporting.model.ImmutableTranslation;
import rdw.reporting.model.Translation;

import javax.validation.constraints.NotNull;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import static com.google.common.base.Preconditions.checkNotNull;

@Repository
public class TranslationRepositoryStub implements TranslationRepository {

	private final Set<Translation> stubTranslations = Sets.newHashSet(
		ImmutableTranslation.builder().code("HELLO").locale(Locale.ENGLISH).message("Hello World").build(),
		ImmutableTranslation.builder().code("HELLO").locale(Locale.JAPANESE).message("こんにちは世界").build()
	);

	public Set<Translation> getTranslations() {
		return stubTranslations;
	}

	public Set<Translation> getTranslationsForLocale(@NotNull Locale locale) {
		checkNotNull(locale, "Argument \"locale\" must not be null");
		return stubTranslations.stream()
			.filter(translation -> locale.equals(translation.getLocale()))
			.collect(Collectors.toSet());
	}

}
