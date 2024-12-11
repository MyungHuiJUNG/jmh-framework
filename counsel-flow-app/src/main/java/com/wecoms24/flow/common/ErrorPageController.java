package com.wecoms24.flow.common;

import com.wecoms24.flow.FlowAppConstants;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ErrorPageController implements ErrorController {

	@GetMapping({FlowAppConstants.EMPTY_PATH, FlowAppConstants.LOGIN_PATH, FlowAppConstants.ERROR_PATH, "/view/**"})
    public String index() {
        return FlowAppConstants.INDEX_HTML;
    }

	public String getErrorPath() {
        return FlowAppConstants.ERROR_PATH;
    }
}
