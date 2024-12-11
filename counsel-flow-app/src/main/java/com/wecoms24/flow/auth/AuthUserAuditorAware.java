package com.wecoms24.flow.auth;

import com.wecoms24.flow.user.User;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthUserAuditorAware implements AuditorAware<Long> {

	@Override
	public Optional<Long> getCurrentAuditor() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        
        if (!(authentication.getPrincipal() instanceof AuthUserDetails)) {
            return Optional.empty();
        }
        
        User loginUser = ((AuthUserDetails) authentication.getPrincipal()).getUser();
        
		return Optional.ofNullable(loginUser.getEntityId());
	}

}
