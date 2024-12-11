package com.wecoms24.flow.counsel.ticket;


import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wecoms24.flow.FlowAppConstants;
import com.wecoms24.flow.core.exception.FlowErrorCode;
import com.wecoms24.flow.core.exception.FlowException;
import com.wecoms24.flow.core.template.service.AbstractBaseUserCrudEntityService;
import com.wecoms24.flow.core.util.DateFormatUtil;
import com.wecoms24.flow.core.websocket.FlowRedisMessageListener;
import com.wecoms24.flow.core.websocket.FlowRedisMessageSubscriber;
import com.wecoms24.flow.core.websocket.FlowWebSocketMessage;
import com.wecoms24.flow.counsel.ticket.channel.TicketChannelService;
import com.wecoms24.flow.counsel.ticket.history.TicketHistorySearchParameter;
import com.wecoms24.flow.counsel.ticket.history.TicketHistoryService;
import com.wecoms24.flow.counsel.type.CounselType;
import com.wecoms24.flow.counsel.type.CounselTypeDao;
import com.wecoms24.flow.counsel.type.CounselTypeSearchParameter;
import com.wecoms24.flow.settings.code.Code;
import com.wecoms24.flow.settings.code.CodeDao;
import com.wecoms24.flow.settings.code.CodeSearchParameter;
import com.wecoms24.flow.settings.code.CodeType;
import com.wecoms24.flow.user.User;
import com.wecoms24.flow.user.UserService;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
//@Primary
@AllArgsConstructor
public class TicketServiceImpl extends AbstractBaseUserCrudEntityService<User, Ticket, Long, TicketDao, TicketSearchParameter> implements TicketService, FlowRedisMessageListener, InitializingBean {

    private final TicketHistoryService ticketHistoryService;
    private final TicketChannelService ticketChannelService;
    private final UserService userService;
    private final CodeDao codeDao;
    private final CounselTypeDao counselTypeDao;
    private final FlowRedisMessageSubscriber subscriber;
    private final SimpMessagingTemplate messagingTemplate;
    private Map<String, String> statuses;
	private Map<String, String> ticketTypes;
	private Map<String, String> counselCategories;
	private Map<String, String> counselTypes;

    @PostConstruct
    public void init() {
        initCodes();
	}

    @Override
	public void afterPropertiesSet() throws Exception {
    	subscriber.addFlowRedisMessageListeners(this);
	}

    @Override
    public Ticket findOne(User loginUser, Long entityId) {
        return super.findOne(loginUser, entityId);
    }

    @Override
    public Ticket findOne(User loginUser, Ticket entity) {
        return super.findOne(loginUser, entity);
    }

    @Transactional
    @Override
    public Ticket update(User loginUser, Ticket entity) {
        Ticket persistEntity = entityDao.findOneByEntityId(entity.getEntityId());
        if (persistEntity == null) {
            throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
        }

        if (!Objects.equals(persistEntity.getTypeCode(), entity.getTypeCode())) {
            registForJobHistory(loginUser, persistEntity.getEntityId(),
                    persistEntity.getTypeCode(), entity.getTypeCode(),
                    "TYPE");
        }

		if (!Objects.equals(persistEntity.getProductType(), entity.getProductType())) {
			registForJobHistory(loginUser, persistEntity.getEntityId(),
					persistEntity.getProductType(), entity.getProductType(),
					"PRODUCT_TYPE");
		}

        if (!Objects.equals(persistEntity.getCounselTypeCodeLarge(), entity.getCounselTypeCodeLarge()) &&
                !entity.getCounselTypeCodeLarge().isEmpty()) {
            registForJobHistory(loginUser, persistEntity.getEntityId(),
                    persistEntity.getCounselTypeCodeLarge(), entity.getCounselTypeCodeLarge(),
                    "COUNSEL_TYPE_CODE_LARGE");
        }

        if (!Objects.equals(persistEntity.getCounselTypeCodeMedium(), entity.getCounselTypeCodeMedium()) &&
                !entity.getCounselTypeCodeMedium().isEmpty()) {
            registForJobHistory(loginUser, persistEntity.getEntityId(),
                    persistEntity.getCounselTypeCodeMedium(), entity.getCounselTypeCodeMedium(),
                    "COUNSEL_TYPE_CODE_MEDIUM");
        }

        if (!Objects.equals(persistEntity.getCounselTypeCodeSmall(), entity.getCounselTypeCodeSmall()) &&
                !entity.getCounselTypeCodeSmall().isEmpty()) {
            registForJobHistory(loginUser, persistEntity.getEntityId(),
                    persistEntity.getCounselTypeCodeSmall(), entity.getCounselTypeCodeSmall(),
                    "COUNSEL_TYPE_CODE_SMALL");
        }

        if (!Objects.equals(persistEntity.getStatusCode(), entity.getStatusCode())) {
        	String prevStatusCode = persistEntity.getStatusCode();
        	String newStatusCode = entity.getStatusCode();
            registForJobHistory(loginUser, persistEntity.getEntityId(),
            		prevStatusCode, newStatusCode,
                    "STATUS");

            setProcessDatesByModifyStatusCode(entity, prevStatusCode, newStatusCode);
        }

        if (!Objects.equals(persistEntity.getCounselCategoryCode(), entity.getCounselCategoryCode())) {
            registForJobHistory(loginUser, persistEntity.getEntityId(),
                    persistEntity.getCounselCategoryCode(), entity.getCounselCategoryCode(),
                    "COUNSEL_CATEGORY_CODE");
        }

		if (!Objects.equals(persistEntity.getInquiry(), entity.getInquiry())) {
			registForJobHistory(loginUser, persistEntity.getEntityId(),
					persistEntity.getInquiry(), entity.getInquiry(),
					"INQUIRY");
		}

        if (!Objects.equals(persistEntity.getContents(), entity.getContents())) {
            registForJobHistory(loginUser, persistEntity.getEntityId(),
                    persistEntity.getContents(), entity.getContents(),
                    "CONTENTS");
        }

        if (!Objects.equals(persistEntity.getTel(), entity.getTel())) {
            registForJobHistory(loginUser, persistEntity.getEntityId(),
                    persistEntity.getTel(), entity.getTel(),
                    "TEL");
        }

        if (!Objects.equals(persistEntity.getCustomerName(), entity.getCustomerName())) {
            registForJobHistory(loginUser, persistEntity.getEntityId(),
                    persistEntity.getCustomerName(), entity.getCustomerName(),
                    "CUSTOMER_NAME");
        }

        if (persistEntity.getManager() != null && entity.getManager() != null &&
				!Objects.equals(persistEntity.getManager().getEntityId(), entity.getManager().getEntityId())) {
            User prevUser = userService.findOne(loginUser, persistEntity.getManager().getEntityId());
            User newUser = userService.findOne(loginUser, entity.getManager().getEntityId());
            if (prevUser == null || newUser == null) {
                throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
            }
            registForJobHistory(loginUser, persistEntity.getEntityId(),
                    prevUser.getName(), newUser.getName(),
                    "MANAGER_EID");
        }

        if (persistEntity.getCallbackReservationDate() != null && entity.getCallbackReservationDate() != null
                && persistEntity.getCallbackReservationDate().compareTo(entity.getCallbackReservationDate()) != 0) {
            registForJobHistory(loginUser, persistEntity.getEntityId(),
                    DateFormatUtil.formatDate(persistEntity.getCallbackReservationDate()),
                    DateFormatUtil.formatDate(entity.getCallbackReservationDate()),
                    "CALLBACK_RESERVATION_DATE");
        }

        return super.update(loginUser, entity);
    }

    @Override
    public void delete(User loginUser, Long entityId) {
        Ticket persistEntity = entityDao.findOneByEntityId(entityId);

        if (persistEntity == null) {
            throw new FlowException(FlowErrorCode.WRONG_RESOURCE_NO);
        }

        if (!super.entityDao.getRealDeleteDefaultValue()) {
            ticketHistoryService.deleteTicketHistory(entityId);
            ticketChannelService.deleteTicketChannel(entityId);
        }

        super.delete(loginUser, persistEntity);
    }

	@Override
	public void ticketsExcelDownload(User loginUser, TicketSearchParameter searchParameter, HttpServletResponse response) {
		List<TicketExcelDownloader.Column> headers = new ArrayList<>();
		headers.add(new TicketExcelDownloader.Column(0, FlowAppConstants.TICKET_EXCEL_DOWNLOAD_COLUMN_EID, 20));
		headers.add(new TicketExcelDownloader.Column(1, FlowAppConstants.TICKET_EXCEL_DOWNLOAD_COLUMN_PROCESS_CD, 20));
		headers.add(new TicketExcelDownloader.Column(2, FlowAppConstants.TICKET_EXCEL_DOWNLOAD_COLUMN_TYPE_CD, 20));
		headers.add(new TicketExcelDownloader.Column(3, FlowAppConstants.TICKET_EXCEL_DOWNLOAD_COLUMN_CATEGORY_CD, 20));
		headers.add(new TicketExcelDownloader.Column(4, FlowAppConstants.TICKET_EXCEL_DOWNLOAD_COLUMN_CREATED_DT, 20));
		headers.add(new TicketExcelDownloader.Column(5, FlowAppConstants.TICKET_EXCEL_DOWNLOAD_COLUMN_COUNSEL_TYPE_L, 20));
		headers.add(new TicketExcelDownloader.Column(6, FlowAppConstants.TICKET_EXCEL_DOWNLOAD_COLUMN_COUNSEL_TYPE_M, 20));
		headers.add(new TicketExcelDownloader.Column(7, FlowAppConstants.TICKET_EXCEL_DOWNLOAD_COLUMN_COUNSEL_TYPE_S, 20));
		headers.add(new TicketExcelDownloader.Column(8, FlowAppConstants.TICKET_EXCEL_DOWNLOAD_COLUMN_TEL, 20));
		headers.add(new TicketExcelDownloader.Column(9, FlowAppConstants.TICKET_EXCEL_DOWNLOAD_COLUMN_MANAGER, 20));
		headers.add(new TicketExcelDownloader.Column(10, FlowAppConstants.TICKET_EXCEL_DOWNLOAD_COLUMN_CREATOR, 20));

		TicketExcelDownloader downloader = new TicketExcelDownloader(response);
		downloader.setFileName(FlowAppConstants.TICKET_EXCEL_FILA_NAME_PREFIX + new SimpleDateFormat(FlowAppConstants.DATETIME_FORMAT_WITHOUT_SYMBOL).format(new Date()) + FlowAppConstants.EXCEL_EXTENSION);
		downloader.setSheetName(FlowAppConstants.TICKET_EXCEL_SHEET_NAME);
		downloader.setHeaders(headers);
		downloader.execute(100000, 0, new TicketExcelDownloader.DataListener() {
			@Override
			public void setRows(int limit, Sheet sheet, CellStyle style) {
				List<Ticket> foundTickets = entityDao.find(searchParameter);
				int current = 0;
				if (foundTickets != null && !foundTickets.isEmpty()) {
					for (Ticket ticket : foundTickets) {
                        current++;
                        setRowByDetailExcelDownload(sheet, style, current, ticket);
					}
				}
			}
		});
	}

	public void registForJobHistory(User loginUser, Long entityId, String prevData, String newData, String type) {
        TicketHistorySearchParameter ticketHistorySearchParameter = new TicketHistorySearchParameter();
        ticketHistorySearchParameter.setTicketEntityId(entityId);
        ticketHistorySearchParameter.setPrevData(prevData);
        ticketHistorySearchParameter.setNewData(newData);
        ticketHistoryService.registForJobHistory(loginUser, ticketHistorySearchParameter, type);
    }

    private void setProcessDatesByModifyStatusCode(Ticket entity, String prevStatusCode, String newStatusCode) {
		Date currentDate = new Date();
		switch (prevStatusCode) {
		case "TICKET_UNPROCESSED":
			if ("TICKET_IN_PROCESS".equalsIgnoreCase(newStatusCode)) {
				entity.setStartDate(currentDate);
			} else if ("TICKET_COMPLETED".equalsIgnoreCase(newStatusCode)) {
				entity.setStartDate(currentDate);
				entity.setEndDate(currentDate);
			}
			break;

		case "TICKET_IN_PROCESS":
			if ("TICKET_UNPROCESSED".equalsIgnoreCase(newStatusCode)) {
				entity.setStartDate(null);
			} else if ("TICKET_COMPLETED".equalsIgnoreCase(newStatusCode)) {
				entity.setEndDate(currentDate);
			}
			break;
		case "TICKET_COMPLETED":
			if ("TICKET_UNPROCESSED".equalsIgnoreCase(newStatusCode)) {
				entity.setStartDate(null);
				entity.setEndDate(null);
			} else if ("TICKET_IN_PROCESS".equalsIgnoreCase(newStatusCode)) {
				entity.setEndDate(null);
			}
			break;
		}
	}

	private void setRowByDetailExcelDownload(Sheet sheet, CellStyle style, int current, Ticket ticket) {
		Row row = sheet.createRow(current);

		Cell cell = null;

		cell = row.createCell(0);
		cell.setCellStyle(style);
		cell.setCellValue(ticket.getEntityId() != null ? String.valueOf(ticket.getEntityId()) : "");

		cell = row.createCell(1);
		cell.setCellStyle(style);
		cell.setCellValue(ticket.getStatusCode() != null && statuses.get(ticket.getStatusCode()) != null ? statuses.get(ticket.getStatusCode()) : "");

		cell = row.createCell(2);
		cell.setCellStyle(style);
		cell.setCellValue(ticket.getTypeCode() != null && ticketTypes.get(ticket.getTypeCode()) != null ? ticketTypes.get(ticket.getTypeCode()) : "");

		cell = row.createCell(3);
		cell.setCellStyle(style);
		cell.setCellValue(ticket.getCounselCategoryCode() != null && counselCategories.get(ticket.getCounselCategoryCode()) != null ? counselCategories.get(ticket.getCounselCategoryCode()) : "");

		cell = row.createCell(4);
		cell.setCellStyle(style);
		cell.setCellValue(ticket.getCreatedDate() != null ? new SimpleDateFormat(FlowAppConstants.DATETIME_FORMAT_SPLIT_SYMBOL).format(ticket.getCreatedDate()) : "");

		cell = row.createCell(5);
		cell.setCellStyle(style);
		cell.setCellValue(ticket.getCounselTypeCodeLarge() != null && counselTypes.get(ticket.getCounselTypeCodeLarge()) != null ? counselTypes.get(ticket.getCounselTypeCodeLarge()) : "");

		cell = row.createCell(6);
		cell.setCellStyle(style);
		cell.setCellValue(ticket.getCounselTypeCodeMedium() != null && counselTypes.get(ticket.getCounselTypeCodeMedium()) != null ? counselTypes.get(ticket.getCounselTypeCodeMedium()) : "");

		cell = row.createCell(7);
		cell.setCellStyle(style);
		cell.setCellValue(ticket.getCounselTypeCodeSmall() != null  && counselTypes.get(ticket.getCounselTypeCodeSmall()) != null ? counselTypes.get(ticket.getCounselTypeCodeSmall()) : "");

		cell = row.createCell(8);
		cell.setCellStyle(style);
		cell.setCellValue(ticket.getTel() != null ? ticket.getTel() : "");

		cell = row.createCell(9);
		cell.setCellStyle(style);
		cell.setCellValue(ticket.getManagerUserName() != null ? ticket.getManagerUserName() : "");

		cell = row.createCell(10);
		cell.setCellStyle(style);
		cell.setCellValue(ticket.getCreatedByUserName() != null ? ticket.getCreatedByUserName() : "");
	}

	private void initCodes() {
		statuses = getChildrenCodeNamesByTopParentCodeValue(FlowAppConstants.TICKET_PROCESS_STATUS_SYSTEM_CODE);
		ticketTypes = getChildrenCodeNamesByTopParentCodeValue(FlowAppConstants.TICKET_TYPE_SYSTEM_CODE);
		counselCategories = getChildrenCodeNamesByTopParentCodeValue(FlowAppConstants.TICKET_COUNSEL_CATEGORY_SYSTEM_CODE);
		counselTypes = getChildrenCodeNamesByCounselTypes();
	}

	private Map<String, String> getChildrenCodeNamesByTopParentCodeValue(String parentCode) {
		CodeSearchParameter searchParameter = new CodeSearchParameter();
		searchParameter.getEntity().setCodeType(CodeType.SYSTEM);
		searchParameter.getEntity().setCode(parentCode);
		Code foundCode = codeDao.findOne(searchParameter);
		Map<String, String> codes = new HashMap<>();
		if (foundCode != null && foundCode.getChildren() != null && foundCode.getChildren().isEmpty() == false) {
			setCodes(codes, foundCode.getChildren());
		}
		return codes;
	}

	private void setCodes(Map<String, String> codes, List<Code> children) {
		for (Code code : children) {
			codes.put(code.getCode(), code.getName());

			if (code.getChildren() != null && code.getChildren().isEmpty() == false)
				setCodes(codes, code.getChildren());
		}
	}

	private Map<String, String> getChildrenCodeNamesByCounselTypes() {
		CounselTypeSearchParameter searchParameter = new CounselTypeSearchParameter();
		searchParameter.setIsTopCode(false);
		List<CounselType> foundCounselTypes = counselTypeDao.find(searchParameter);
		Map<String, String> counselTypes = new HashMap<>();
		if (foundCounselTypes != null && foundCounselTypes.isEmpty() == false) {
			for (CounselType foundCounselType: foundCounselTypes) {
				counselTypes.put(foundCounselType.getCode(), foundCounselType.getName());
			}
		}
		return counselTypes;
	}

	@Override
	public void onMessageByRedis(String topic, FlowWebSocketMessage webSocketMessage) {
		if (FlowAppConstants.REDIS_TOPIC_TRANSMIT_TICKET.equalsIgnoreCase(topic) == false || Ticket.class.getName().equalsIgnoreCase(webSocketMessage.getClassName()) == false)
			return;

		try {
            ObjectMapper objectMapper = new ObjectMapper();
            messagingTemplate.convertAndSend(topic + "/" + webSocketMessage.getReceiver().getId(), objectMapper.writeValueAsString(webSocketMessage));
        } catch (Exception e) {
            e.printStackTrace();
        }
	}
}
