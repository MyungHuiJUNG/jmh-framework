package com.wecoms24.flow.auth;

import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.user.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@RequiredArgsConstructor
public class AuthUserDetails implements UserDetails {
	private static final long serialVersionUID = 1L;
	
	private final User user;
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
    	if (user.getRoleGroup() == null) {
            return Collections.singleton(new SimpleGrantedAuthority(FlowAppConstants.GUEST_ROLE_GROUP));
        }

    	if (user.getRoleGroup().getUsable() == false) {
    		throw new FlowException(FlowErrorCode.DISABLED_PERMISSION_GROUP);
    	}
    	
    	Set<String> roles = Set.of(user.getRoleGroup().getName());
        return roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toSet());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
