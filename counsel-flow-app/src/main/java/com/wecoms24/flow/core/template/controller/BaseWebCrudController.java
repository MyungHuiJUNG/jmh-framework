package com.wecoms24.flow.core.template.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.auth.AuthUserDetails;
import com.wecoms24.flow.auth.jwt.JwtTokenProvider;
import com.wecoms24.flow.core.template.FlowDataJsonView;
import com.wecoms24.flow.core.template.dao.BaseCrudEntityDao;
import com.wecoms24.flow.core.template.entity.BaseEntity;
import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;
import com.wecoms24.flow.core.template.service.BaseUserCrudEntityService;
import com.wecoms24.flow.user.User;

import jakarta.servlet.http.HttpServletRequest;

public abstract class BaseWebCrudController<USER_ENTITY extends User, TOKEN_PROVIDER extends JwtTokenProvider, ENTITY_TYPE extends BaseEntity<ENTITY_ID>, ENTITY_ID, ENTITY_DAO extends BaseCrudEntityDao<ENTITY_TYPE, ENTITY_ID, SEARCH_PARAMETER>, SEARCH_PARAMETER extends BaseEntitySearchParameter<ENTITY_TYPE, ENTITY_ID>, ENTITY_SERVICE extends BaseUserCrudEntityService<USER_ENTITY, ENTITY_TYPE, ENTITY_ID, ENTITY_DAO, SEARCH_PARAMETER> > extends BaseWebController {
	@Autowired
	protected ENTITY_SERVICE entityService;
	
	@Autowired
	protected TOKEN_PROVIDER tokenProvider;

	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public ENTITY_TYPE postByMessage(@RequestBody SEARCH_PARAMETER entityParam) {
		return entityService.regist(getLoginUser(), entityParam.getEntity());
	}

	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PostMapping(value = "", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public ENTITY_TYPE postByFomAndQueryParam(SEARCH_PARAMETER entityParam) {
		return entityService.regist(getLoginUser(), entityParam.getEntity());
	}

	@JsonView({ FlowDataJsonView.ListEntityView.class })
	@PostMapping(value = "/multiple", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public List<ENTITY_TYPE> postEntitiesByMessage(@RequestBody SEARCH_PARAMETER entityParam) {
		return entityService.regist(getLoginUser(), entityParam.getEntities());
	}

	@JsonView({ FlowDataJsonView.ListEntityView.class })
	@PostMapping(value = "/multiple", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public List<ENTITY_TYPE> postEntitiesByFomAndQueryParam(SEARCH_PARAMETER entityParam) {
		return entityService.regist(getLoginUser(), entityParam.getEntities());
	}
	
	@JsonView({ FlowDataJsonView.PagingContentsView.class })
	@GetMapping(value = "", params = { "page", "size" }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public Slice<ENTITY_TYPE> getBySlice(SEARCH_PARAMETER searchParam) {
		return entityService.findSlice(getLoginUser(), searchParam);
	}
	
	@GetMapping(value = "/totalCount", produces = { MediaType.APPLICATION_JSON_VALUE })
	public Long findTotalCount(SEARCH_PARAMETER searchParam) {
		return entityService.findTotalCount(getLoginUser(), searchParam);
	}
	
	@JsonView({ FlowDataJsonView.PagingContentsView.class })
	@GetMapping(value = "", params = { "page", "size", "isPaging" }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public Page<ENTITY_TYPE> getByPaging(SEARCH_PARAMETER searchParameter) {
		return entityService.findPaging(getLoginUser(), searchParameter);
	}

	@JsonView({ FlowDataJsonView.ListEntityView.class })
	@GetMapping(value = "", produces = { MediaType.APPLICATION_JSON_VALUE })
	public List<ENTITY_TYPE> getAllBySearchParam(SEARCH_PARAMETER searchParam) {
		return entityService.find(getLoginUser(), searchParam);
	}

	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@GetMapping(value = "/{entityId}",  produces = { MediaType.APPLICATION_JSON_VALUE })
	public ENTITY_TYPE getOneBySearchParam(@PathVariable("entityId") ENTITY_ID entityId, SEARCH_PARAMETER searchParam) {
		searchParam.getEntity().setEntityId(entityId);
		return entityService.findOne(getLoginUser(), searchParam.getEntity());
	}

	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PutMapping(value = "/{entityId}", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public ENTITY_TYPE putByMessage(@PathVariable("entityId") ENTITY_ID entityId, @RequestBody SEARCH_PARAMETER searchParam) {
		searchParam.getEntity().setEntityId(entityId);
		return entityService.update(getLoginUser(), searchParam.getEntity());
	}

	@JsonView({ FlowDataJsonView.SingleEntityView.class })
	@PutMapping(value = "/{entityId}", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public ENTITY_TYPE putByFormAndQueryParam(@PathVariable("entityId") ENTITY_ID entityId, SEARCH_PARAMETER searchParam) {
		searchParam.getEntity().setEntityId(entityId);
		return entityService.update(getLoginUser(), searchParam.getEntity());
	}
	
	@JsonView({ FlowDataJsonView.ListEntityView.class })
	@PutMapping(value = "/multiple", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public List<ENTITY_TYPE> putEntitiesByMessage(@RequestBody SEARCH_PARAMETER entityParam) {
		return entityService.update(getLoginUser(), entityParam.getEntities());
	}

	@JsonView({ FlowDataJsonView.ListEntityView.class })
	@PutMapping(value = "/multiple", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE })
	public List<ENTITY_TYPE> putEntitiesByFomAndQueryParam(SEARCH_PARAMETER entityParam) {
		return entityService.update(getLoginUser(), entityParam.getEntities());
	}
	
	@DeleteMapping(value = "/{entityId}", produces = { MediaType.APPLICATION_JSON_VALUE })
	public void deleteOneBySearchParameter(@PathVariable("entityId") ENTITY_ID entityId, SEARCH_PARAMETER searchParam) {
		searchParam.getEntity().setEntityId(entityId);
		entityService.delete(getLoginUser(), searchParam.getEntity().getEntityId());
	}

	@DeleteMapping(value = "", produces = { MediaType.APPLICATION_JSON_VALUE })
	public void deleteAllBySearchParameter(SEARCH_PARAMETER searchParam) {
		entityService.delete(getLoginUser(), searchParam.getEntityIds());
	}

	public String getTokenBySevletRequest(HttpServletRequest request) {
		return tokenProvider.resolveAccessToken(request);
	}
	
	@SuppressWarnings("unchecked")
	public USER_ENTITY getLoginUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof AuthUserDetails) {
        	AuthUserDetails userDetails = (AuthUserDetails) authentication.getPrincipal();
            return (USER_ENTITY) userDetails.getUser();
        }
        
        return null;
	}
}
