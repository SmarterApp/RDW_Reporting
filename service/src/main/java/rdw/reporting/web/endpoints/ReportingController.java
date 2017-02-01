package rdw.reporting.web.endpoints;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import rdw.reporting.models.ICA;
import rdw.reporting.repositories.InterimComprehensiveQuery;

import java.util.*;

/**
 * Created on 1/19/17.
 */
@RestController
@RequestMapping("/report")
public class ReportingController {
    private final InterimComprehensiveQuery interimComprehensiveQuery;

    @Autowired
    JdbcTemplate jdbcTemplate;
    List<Map<String, Object>> result;

    @Autowired
    public ReportingController(InterimComprehensiveQuery interimComprehensiveQuery) {
        this.interimComprehensiveQuery = interimComprehensiveQuery;
    }

    /*Not happy at all with this function.  Will be changed*/
    @RequestMapping(value = "/ica/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ICA getICA(@PathVariable String id) {
        Optional<ICA> ica = interimComprehensiveQuery.getICAById(id);

        if (ica.isPresent()) {
            return ica.get();
        }
        else {
            throw new ICANotFoundException();
        }
    }

}
@ResponseStatus(value= HttpStatus.NOT_FOUND, reason="No such ICA")  // 404
class ICANotFoundException extends RuntimeException {
    public ICANotFoundException() {
    }
}
