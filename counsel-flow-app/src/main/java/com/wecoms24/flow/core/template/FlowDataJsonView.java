package com.wecoms24.flow.core.template;

public interface FlowDataJsonView {
	public interface RootView {
	}
	
	public interface IgnoreView {
	}

	public interface ListEntityView extends RootView {
	}

	public interface PagingContentsView extends ListEntityView {
	}

	public interface SingleEntityView extends RootView {
	}

	public interface AssociationParentView extends RootView {
	}

	public interface AssociationChildView extends RootView {
	}
}
