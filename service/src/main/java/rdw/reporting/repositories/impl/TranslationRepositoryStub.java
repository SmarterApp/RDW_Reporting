package rdw.reporting.repositories.impl;

import com.google.common.collect.ImmutableSet;
import org.springframework.stereotype.Repository;
import rdw.reporting.models.ImmutableTranslation;
import rdw.reporting.models.Translation;
import rdw.reporting.repositories.TranslationRepository;

import javax.validation.constraints.NotNull;
import java.util.Locale;
import java.util.Set;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.stream.Collectors.toSet;

@Repository
public class TranslationRepositoryStub implements TranslationRepository {

	private final ImmutableSet<Translation> stubTranslations = ImmutableSet.of(
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
			.collect(toSet());
	}
}
