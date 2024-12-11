package com.wecoms24.flow.counsel.ticket.callback;

import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.FlowDataJsonView;
import com.wecoms24.flow.core.template.controller.BaseWebCrudController;
import com.wecoms24.flow.user.User;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(FlowAppConstants.REST_API_CALLBACK_TICKET_HISTORY)
public class CallbackTicketController extends BaseWebCrudController<User, JwtTokenProvider, CallbackTicket, Long, CallbackTicketDao, CallbackTicketSearchParameter, CallbackTicketService> {
	
	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PutMapping(value = "/{entityId}/manual-distribute", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public CallbackTicket putByMessage(@PathVariable("entityId") Long entityId, @RequestBody CallbackTicketSearchParameter searchParam) {
		searchParam.getEntity().setEntityId(entityId);
		return entityService.manualDistributeCallbackTicket(getLoginUser(), searchParam);
	}

	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PutMapping(value = "/{entityId}/manual-distribute", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public CallbackTicket putByFormAndQueryParam(@PathVariable("entityId") Long entityId, CallbackTicketSearchParameter searchParam) {
		searchParam.getEntity().setEntityId(entityId);
		return entityService.manualDistributeCallbackTicket(getLoginUser(), searchParam);
	}
}
