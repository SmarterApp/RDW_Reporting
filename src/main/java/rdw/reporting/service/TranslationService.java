package rdw.reporting.service;

import rdw.reporting.model.Translation;

import javax.validation.constraints.NotNull;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

public interface TranslationService {

	/**
	 * @return All ranslations
	 */
	Set<Translation> getTranslations();

	/**
	 * @param locale The locale by which the translations will be filtered
	 * @return Translations for a specific locale indexed by the message code
	 */
	Map<String, String> getTranslationsForLocale(@NotNull Locale locale);

}
