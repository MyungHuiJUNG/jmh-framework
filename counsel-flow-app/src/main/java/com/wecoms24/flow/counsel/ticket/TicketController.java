package com.wecoms24.flow.counsel.ticket;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(FlowAppConstants.REST_API_TICKET)
public class TicketController extends BaseWebCrudController<User, JwtTokenProvider, Ticket, Long, TicketDao, TicketSearchParameter, TicketService> {
	
	@GetMapping(value = "/download/excel", produces = { MediaType.APPLICATION_JSON_VALUE })
    public void detailExcelDownload(User loginUser, TicketSearchParameter searchParameter, HttpServletResponse response) throws Exception {
		entityService.ticketsExcelDownload(loginUser, searchParameter, response);
	}
}
