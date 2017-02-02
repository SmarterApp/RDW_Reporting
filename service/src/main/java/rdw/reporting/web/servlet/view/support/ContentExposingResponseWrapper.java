package rdw.reporting.web.servlet.view.support;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * This class wraps an HttpServletResponse and captures the content written to its OutputStream.
 * This is useful when additional processing of output stream bytes is needed before committing it to the response.
 */
public class ContentExposingResponseWrapper extends HttpServletResponseWrapper {

	private final StringWriter stringWriter;
	private final PrintWriter printWriter;

	public ContentExposingResponseWrapper(HttpServletResponse response) {
		super(response);
		this.stringWriter = new StringWriter();
		this.printWriter = new PrintWriter(stringWriter);
	}

	@Override
	public PrintWriter getWriter() throws IOException {
		return printWriter;
	}

	public String getContent() {
		return this.stringWriter.toString();
	}

}
