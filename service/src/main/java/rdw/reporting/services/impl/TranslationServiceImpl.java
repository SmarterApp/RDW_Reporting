package rdw.reporting.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rdw.reporting.models.Translation;
import rdw.reporting.repositories.TranslationRepository;
import rdw.reporting.services.TranslationService;

import javax.validation.constraints.NotNull;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.stream.Collectors.toMap;

@Service
public class TranslationServiceImpl implements TranslationService {

	private TranslationRepository repository;

	@Autowired
	public TranslationServiceImpl(@NotNull TranslationRepository repository) {
		checkNotNull(repository, "Argument \"repository\" must not be null");
		this.repository = repository;
	}

	public Set<Translation> getTranslations() {
		return repository.getTranslations();
	}

	public Map<String, String> getTranslationsForLocale(@NotNull Locale locale) {
		checkNotNull(locale, "Argument \"locale\" must not be null");
		return repository.getTranslationsForLocale(locale).stream()
			.collect(toMap(Translation::getCode, Translation::getMessage));
	}
}