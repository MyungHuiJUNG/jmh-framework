package com.wecoms24.flow.counsel.ticket.callback;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wecoms24.flow.core.template.annotation.SearchLike;
import com.wecoms24.flow.core.template.entity.BaseAuditingUserIdSequenceAbstractEntity;
import com.wecoms24.flow.counsel.ticket.Ticket;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "CALLBACK_TICKET", indexes = {
        @Index(name = "IDX_TICKET_REG_DATE", columnList = "CREATE_DATE, ENTITY_STATUS"),
        @Index(name = "IDX_REPRESENT_NUMBER", columnList = "REPRESENT_NUMBER"),
        @Index(name = "IDX_REPRESENT_NUMBER_NAME", columnList = "REPRESENT_NUMBER_NAME")
})
@AttributeOverride(name = "entityId", column = @Column(name = "CALLBACK_TICKET_EID"))
public class CallbackTicket extends BaseAuditingUserIdSequenceAbstractEntity<Long> {

    @SearchLike
    @Column(name = "REPRESENT_NUMBER")
    private String representNumber;

    @SearchLike
    @Column(name = "REPRESENT_NUMBER_NAME")
    private String representNumberName;

    @Column(name = "INBOUND_PATH_CODE")
    private String inboundPathCode;

    @SearchLike
    @Column(name = "RECEPTION_NUMBER", nullable = false)
    private String receptionNumber;

    @Column(name = "CALLBACK_NUMBER", nullable = false)
    private String callbackNumber;
    
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TICKET_EID", nullable = true)
    private Ticket ticket;
}
