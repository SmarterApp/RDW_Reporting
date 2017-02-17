package rdw.reporting.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

	@RequestMapping(value = {"/", "/groups", "/groups/{id}/students"})
	public String index() {
		return "forward:/index.html";
	}

}