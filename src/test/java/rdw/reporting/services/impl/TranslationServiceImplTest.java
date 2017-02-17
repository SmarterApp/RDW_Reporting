package rdw.reporting.services.impl;

import com.google.common.collect.Sets;
import org.junit.Before;
import org.junit.Test;
import rdw.reporting.model.ImmutableTranslation;
import rdw.reporting.model.Translation;
import rdw.reporting.repository.TranslationRepository;
import rdw.reporting.service.TranslationService;
import rdw.reporting.service.TranslationServiceImpl;

import java.util.Locale;
import java.util.Set;

import static java.util.stream.Collectors.toMap;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


public class TranslationServiceImplTest {

	private static final Set<Translation> englishTranslations = Sets.newHashSet(
		ImmutableTranslation.builder().locale(Locale.ENGLISH).code("a").message("A").build(),
		ImmutableTranslation.builder().locale(Locale.ENGLISH).code("b").message("B").build()
	);
	private static final Set<Translation> japaneseTranslations = Sets.newHashSet(
		ImmutableTranslation.builder().locale(Locale.JAPANESE).code("c").message("C").build()
	);
	private Set<Translation> translations;
	private TranslationRepository repository;
	private TranslationService service;

	@Before
	public void before(){
		repository = mock(TranslationRepository.class);
		service = new TranslationServiceImpl(repository);
		translations = Sets.newHashSet();
		translations.addAll(englishTranslations);
		translations.addAll(japaneseTranslations);
		when(repository.getTranslations()).thenReturn(translations);
		when(repository.getTranslationsForLocale(Locale.ENGLISH)).thenReturn(englishTranslations);
		when(repository.getTranslationsForLocale(Locale.JAPANESE)).thenReturn(japaneseTranslations);
	}

	@Test
	public void getTranslations_returns_all_translations() throws Exception {
		assertThat(service.getTranslations(), equalTo(translations));
	}

	@Test
	public void getTranslationsForLocale_english_returns_just_english() throws Exception {
		assertThat(service.getTranslationsForLocale(Locale.ENGLISH),
			equalTo(englishTranslations.stream().collect(toMap(Translation::getCode, Translation::getMessage))));
	}

	@Test
	public void getTranslationsForLocale_japanese_returns_just_japanese() throws Exception {
		assertThat(service.getTranslationsForLocale(Locale.JAPANESE),
			equalTo(japaneseTranslations.stream().collect(toMap(Translation::getCode, Translation::getMessage))));
	}

}