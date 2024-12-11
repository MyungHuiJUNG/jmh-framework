package com.wecoms24.flow.counsel.ticket;

import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.type.descriptor.jdbc.LongVarcharJdbcType;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import com.wecoms24.flow.core.template.FlowDataJsonView;
import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.counsel.customer.CustomerInfo;
import com.wecoms24.flow.counsel.ticket.channel.TicketChannel;
import com.wecoms24.flow.counsel.ticket.history.TicketHistory;
import com.wecoms24.flow.user.User;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(callSuper = true)
@Table(name = "TICKET_TM",
        indexes = {
                @Index(name = "IDX_TICKET_REG_DATE", columnList = "CREATE_DATE, ENTITY_STATUS"),
                @Index(name = "IDX_TICKET_REG_DATE_STATUS", columnList = "CREATE_DATE, STATUS, ENTITY_STATUS"),
                @Index(name = "IDX_TICKET_REG_DATE_TYPE", columnList = "CREATE_DATE, TYPE, ENTITY_STATUS")
        }
)
@AttributeOverride(name = "entityId", column = @Column(name = "TICKET_EID"))
public class Ticket extends BaseAuditingUserIdSequenceAbstractEntity<Long> {

    @Merge
    @Column(name = "STATUS")
    private String statusCode;

    @Merge
    @Column(name = "TYPE")
    private String typeCode;

    @Merge
    @Column(name = "COUNSEL_CATEGORY_CODE")
    private String counselCategoryCode;

    @Merge
    @Column(name = "COUNSEL_TYPE_CODE_LARGE")
    private String counselTypeCodeLarge;

    @Merge
    @Column(name = "COUNSEL_TYPE_CODE_MEDIUM")
    private String counselTypeCodeMedium;

    @Merge
    @Column(name = "COUNSEL_TYPE_CODE_SMALL")
    private String counselTypeCodeSmall;

    @SearchLike
    @Merge
    @Column(name = "TEL")
    private String tel;

    @SearchLike
    @Merge
    @Column(name = "CUSTOMER_NAME")
    private String customerName;

    @SearchLike
    @Merge
    @Column(name = "PRODUCT_TYPE")
    private String productType;

    @Merge
    @Lob
    @JdbcType(LongVarcharJdbcType.class)
    @Column(name = "INQUIRY")
    private String inquiry;

    @ManyToOne
    @JoinColumn(name = "CUSTOMER_INFO_EID")
    private CustomerInfo customerInfo;

    @Merge
    @Lob
    @JdbcType(LongVarcharJdbcType.class)
    @Column(name = "CONTENTS")
    private String contents;

    @Merge
    @Column(name = "INBOUND_PATH")
    private String inboundPath;

    @Merge
    @Column(name = "CALLBACK_RESERVATION_DATE")
    private Date callbackReservationDate;

    @Merge(ignoreNull = false)
    @Column(name = "START_DATE")
    private Date startDate;

    @Merge(ignoreNull = false)
    @Column(name = "END_DATE")
    private Date endDate;

    @Merge
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MANAGER_EID")
    private User manager;

    @Merge
    @Column(name = "IS_MANUAL_CREATED", length = 1, columnDefinition = "varchar(1) default 'N'")
    private String isManualCreated;

    @Fetch(FetchMode.SUBSELECT)
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "TICKET_EID", foreignKey = @ForeignKey(name = "none"))
    @SQLRestriction("entity_status <> 'DELETE'")
    @Builder.Default
    private Set<TicketChannel> channels = new LinkedHashSet<>();

    @JsonView({FlowDataJsonView.SingleEntityView.class})
    @Fetch(FetchMode.SUBSELECT)
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "TICKET_EID", foreignKey = @ForeignKey(name = "none"), updatable = false, insertable = false)
    @SQLRestriction("entity_status <> 'DELETE'")
    @Builder.Default
    private Set<TicketHistory> histories = new LinkedHashSet<>();

    @JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.SingleEntityView.class })
    @Formula("(SELECT u.USER_ID FROM USER_TM u WHERE u.USER_EID = MANAGER_EID)")
    private String managerUserId;

    @JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.SingleEntityView.class })
    @Formula("(SELECT u.USER_NAME FROM USER_TM u WHERE u.USER_EID = MANAGER_EID)")
    private String managerUserName;

    @JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.SingleEntityView.class })
    @Formula("(SELECT u.USER_ID FROM USER_TM u WHERE u.USER_EID = CREATE_BY)")
    private String createdByUserId;

    @JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.SingleEntityView.class })
    @Formula("(SELECT u.USER_NAME FROM USER_TM u WHERE u.USER_EID = CREATE_BY)")
    private String createdByUserName;

    @JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.SingleEntityView.class })
    @Formula("(SELECT u.USER_ID FROM USER_TM u WHERE u.USER_EID = MODIFIED_BY)")
    private String lastModifiedByUserId;

    @JsonView({ FlowDataJsonView.ListEntityView.class, FlowDataJsonView.SingleEntityView.class })
    @Formula("(SELECT u.USER_NAME FROM USER_TM u WHERE u.USER_EID = MODIFIED_BY)")
    private String lastModifiedByUserName;
}
