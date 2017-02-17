package rdw.reporting.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rdw.reporting.model.Translation;
import rdw.reporting.repository.TranslationRepository;

import javax.validation.constraints.NotNull;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.google.common.base.Preconditions.checkNotNull;

@Service
public class TranslationServiceImpl implements TranslationService {

	private final TranslationRepository repository;

	@Autowired
	public TranslationServiceImpl(@NotNull TranslationRepository repository) {
		this.repository = checkNotNull(repository);
	}

	public Set<Translation> getTranslations() {
		return repository.getTranslations();
	}

	public Map<String, String> getTranslationsForLocale(@NotNull Locale locale) {
		return repository.getTranslationsForLocale(checkNotNull(locale)).stream()
			.collect(Collectors.toMap(Translation::getCode, Translation::getMessage));
	}

}
