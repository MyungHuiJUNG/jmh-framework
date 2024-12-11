package com.wecoms24.flow.user;

import com.wecoms24.flow.core.template.FlowDataJsonView;

public abstract class UserJsonView {

	public interface UserSingleEntityView {
	};

	public interface UserListEntityView extends FlowDataJsonView.ListEntityView, FlowDataJsonView.PagingContentsView {
	};
}
