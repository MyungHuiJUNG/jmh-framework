package com.wecoms24.flow.counsel.notice;

import com.wecoms24.flow.core.template.entity.BaseEntitySearchParameter;

public class NoticeSearchParameter extends BaseEntitySearchParameter<Notice, Long> {
    private String keyword;

    public NoticeSearchParameter() {
        super(Notice.class);
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }
}
