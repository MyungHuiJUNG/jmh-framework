package com.wecoms24.flow.counsel.ticket.channel;

import com.wecoms24.flow.core.template.annotation.Merge;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;


@Entity
@Getter
@Setter
@Table(name = "TICKET_CHANNEL", indexes = {
        @Index(name = "IDX_TICKET_EID", columnList = "TICKET_EID"),
        @Index(name = "IDX_TYPE_CODE", columnList = "TYPE_CD")
})
@AttributeOverride(name = "entityId", column = @Column(name = "TICKET_CHANNEL_EID"))
public class TicketChannel extends BaseAuditingUserIdSequenceAbstractEntity<Long> {

    @Merge
    @Column(name = "TICKET_EID")
    private Long ticketEntityId;

    @Merge
    @Column(name = "TYPE_CD", length = 10)
    private String typeCode;

    @Merge
    @Column(name = "EXTRA_DATA", length = 4000)
    private String extraData;

    @Merge
    @Column(name = "CONTACT_CD", length = 10)
    private String contactCode;

    @Merge
    @Column(name = "START_DATE", length = 14)
    private Date startDate;

    @Merge
    @Column(name = "END_DATE", length = 14)
    private Date endDate;

    @Merge
    @Column(name = "PROCESS_DATE", length = 14)
    private Date processDate;

    @Merge
    @Column(name = "CHANNEL_KEY", length = 50)
    private String key;
}