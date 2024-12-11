package com.wecoms24.flow.settings.menu;

public enum MenuActionType {
	TAB,
	POPUP,
	WINDOW,
	NONE;
	
	public static MenuActionType valueBy(String value) {
		try {
			return valueOf(value);
		} catch (Exception e) {
		}
		return null;
	}
}
