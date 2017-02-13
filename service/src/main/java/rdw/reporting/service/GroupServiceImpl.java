package rdw.reporting.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rdw.reporting.model.Group;
import rdw.reporting.model.GroupSummary;
import rdw.reporting.repository.GroupRepository;
import rdw.reporting.security.User;

import javax.validation.constraints.NotNull;
import java.util.Optional;
import java.util.Set;

import static com.google.common.base.Preconditions.checkNotNull;

@Service
public class GroupServiceImpl implements GroupService {

	private final GroupRepository repository;

	@Autowired
	public GroupServiceImpl(@NotNull GroupRepository repository) {
		this.repository = checkNotNull(repository);
	}

	public Set<GroupSummary> getGroupSummaries(@NotNull User user) {
		return repository.getGroupSummaries(user);
	}

	public Optional<Group> getGroup(@NotNull User user, long id) {
		return repository.getGroup(user, id);
	}

}
