package rdw.reporting.repository.impl;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Sets;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import rdw.reporting.model.*;
import rdw.reporting.repository.GroupRepository;
import rdw.reporting.security.User;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static com.google.common.base.Preconditions.checkNotNull;

@Repository
public class GroupRepositoryImpl implements GroupRepository {

	private final NamedParameterJdbcTemplate jdbcTemplate;
	private final String getGroupSummaries;
	private final String getGroup;


    Environment env;

    private ConfigurableApplicationContext applicationContext;

	@Autowired
	public GroupRepositoryImpl(
		@NotNull NamedParameterJdbcTemplate jdbcTemplate,
		@NotNull @Value("${group.getGroupSummaries.sql}") String getGroupSummaries,
		@NotNull @Value("${group.getGroup.sql}") String getGroup) {
		this.jdbcTemplate = checkNotNull(jdbcTemplate);
		this.getGroupSummaries = checkNotNull(getGroupSummaries);
		this.getGroup = checkNotNull(getGroup);
    }

	public Set<GroupSummary> getGroupSummaries(@NotNull User user) {
		return Sets.newHashSet(
			jdbcTemplate.query(
					getGroupSummaries,
				ImmutableMap.of("user_login", user.getUsername()),
				(RowMapper<GroupSummary>) (row, i) -> ImmutableGroupSummary.builder()
					.id(row.getLong("id"))
					.name(row.getString("name"))
					.size(row.getLong("size"))
					.build()
			)
		);
	}

	public Optional<Group> getGroup(@NotNull User user, long id) {
		final ImmutableGroup.Builder group = ImmutableGroup.builder().id(id);
		final List<Student> students = jdbcTemplate.query(
			getGroup,
			ImmutableMap.of(
				"id", id,
				"user_login", user.getUsername()
			),
			(row, index) -> {
				group.name(row.getString("group_name"));
				return ImmutableStudent.builder()
					.id(row.getLong("id"))
					.ssid(row.getString("ssid"))
					.firstName(row.getString("first_name"))
					.lastName(row.getString("last_or_surname"))
					.build();
			}
		);
		if (students.isEmpty()) {
			return Optional.empty();
		}
		return Optional.of(group.students(students).build());
	}

}
