package com.wecoms24.flow.auth;

import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthUserDetailsService implements UserDetailsService {

	@Autowired
	private UserDao userDao;
	
	@Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userDao.findById(username);
		if (user == null)
			throw new FlowException(FlowErrorCode.WRONG_AUTH_ID_OR_PASSWORD);
		
        return new AuthUserDetails(user);
    }
}
