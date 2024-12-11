package com.wecoms24.flow.counsel.ticket.statistics;

import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wecoms24.flow.counsel.ticket.TicketDao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

@Service
public class TicketStatisticsServiceImpl implements TicketStatisticsService {
	
	@Autowired
	private TicketDao ticketDao;

	@SuppressWarnings("unchecked")
	@Override
	public List<TicketStatisticsByCounselTypeData> statisticsByCounselType(TicketStatisticsSearchParameter searchParameter) {
		EntityManager entityManager = ticketDao.getEntityManager();
		String nativeQuery = "SELECT"
				+ "  COUNSEL_TYPE_PATH"
				+ ", COUNSEL_TYPE_CODE_LARGE"
				+ ", COUNSEL_TYPE_CODE_MEDIUM"
				+ ", COUNSEL_TYPE_CODE_SMALL"
				+ ", COUNT(DISTINCT T1.TICKET_EID) AS TOTAL_TICKET_CNT"
				+ ", SUM(IF(T1.STATUS='TICKET_UNPROCESSED', 1, 0)) AS TICKET_UNPROCESSED_CNT"
				+ ", SUM(IF(T1.STATUS='TICKET_IN_PROCESS', 1, 0)) AS TICKET_IN_PROCESS_CNT"
				+ ", SUM(IF(T1.STATUS='TICKET_COMPLETED', 1, 0)) AS TICKET_COMPLETED_CNT"
				+ ", SUM(T1.TRANSMIT_TICKET_CNT) AS TRANSMIT_TICKET_CNT"
				+ " FROM ("
				+ " SELECT TICKET_EID"
				+ ", CONCAT_WS('.', COUNSEL_TYPE_CODE_LARGE, IFNULL(NULLIF(COUNSEL_TYPE_CODE_MEDIUM, ''), NULL), IFNULL(NULLIF(COUNSEL_TYPE_CODE_SMALL, ''), NULL)) AS COUNSEL_TYPE_PATH"
				+ ", IFNULL(T1.COUNSEL_TYPE_CODE_LARGE, '')  AS COUNSEL_TYPE_CODE_LARGE, IFNULL(T1.COUNSEL_TYPE_CODE_MEDIUM, '') AS COUNSEL_TYPE_CODE_MEDIUM"
				+ ", IFNULL(T1.COUNSEL_TYPE_CODE_SMALL, '')  AS COUNSEL_TYPE_CODE_SMALL"
				+ ", (SELECT COUNT(T2.TICKET_HISTORY_EID) FROM ticket_history_tm T2 WHERE T1.TICKET_EID = T2.TICKET_EID AND T2.ENTITY_STATUS != 'DELETE' AND T2.TYPE_CD = 'MANAGER_EID') AS TRANSMIT_TICKET_CNT"
				+ ", T1.STATUS"
				+ " FROM ticket_tm T1"
				+ " WHERE T1.ENTITY_STATUS != 'DELETE'"
				+ " AND DATE_FORMAT(T1.CREATE_DATE, '%Y-%m-%d') >= DATE_FORMAT(:fromDate, '%Y-%m-%d')"
				+ " AND DATE_FORMAT(T1.CREATE_DATE, '%Y-%m-%d') <= DATE_FORMAT(:toDate, '%Y-%m-%d')"
				+ ") T1";
		
		if (searchParameter.getCounselTypePath() != null && searchParameter.getCounselTypePath().isEmpty() == false)
			nativeQuery += " WHERE T1.COUNSEL_TYPE_PATH LIKE :counselTypePath";
				
		nativeQuery += " GROUP BY COUNSEL_TYPE_PATH, COUNSEL_TYPE_CODE_LARGE, COUNSEL_TYPE_CODE_MEDIUM, COUNSEL_TYPE_CODE_SMALL";
		
		Query query = entityManager.createNativeQuery(nativeQuery);
		query.setParameter("fromDate", searchParameter.getFromDate());
        query.setParameter("toDate", searchParameter.getToDate());
        if (searchParameter.getCounselTypePath() != null && !searchParameter.getCounselTypePath().isEmpty())
            query.setParameter("counselTypePath", searchParameter.getCounselTypePath() + "%");
		
		List<Object[]> finds = query.getResultList();
		List<TicketStatisticsByCounselTypeData> results = new LinkedList<>();
		for(Object[] find : finds) {
			
			TicketStatisticsByCounselTypeData ticketStatisticsByUserData = TicketStatisticsByCounselTypeData.builder()
					.fromDate(searchParameter.getFromDate())
					.toDate(searchParameter.getToDate())
					.counselTypeCodePath(find[0] != null ? (String)find[0] : null)
					.counselTypeCodeLarge(find[1] != null ? (String)find[1] : null)
					.counselTypeCodeMedium(find[2] != null ? (String)find[2] : null)
					.counselTypeCodeSmall(find[3] != null ? (String)find[3] : null)
					.totalTicketCount(find[4] != null ? ((Number) find[4]).intValue() : 0)
			        .unprocessedTicketCount(find[5] != null ? ((Number) find[5]).intValue() : 0)
			        .inProcessTicketCount(find[6] != null ? ((Number) find[6]).intValue() : 0)
			        .completedTicketCount(find[7] != null ? ((Number) find[7]).intValue() : 0)
			        .transmitTicketCount(find[8] != null ? ((Number) find[8]).intValue() : 0)
					.build();
			
			results.add(ticketStatisticsByUserData);
		}
		
		return results;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<TicketStatisticsByUserData> statisticsByUser(TicketStatisticsSearchParameter searchParameter) {
		EntityManager entityManager = ticketDao.getEntityManager();
		String nativeQuery = "SELECT"
				+ "  T1.USER_EID"
				+ ", T1.CTI_EXTENSION"
				+ ", T1.USER_ID"
				+ ", T1.USER_NAME"
				+ ", T1.ORG_EID"
				+ ", T1.ORG_PATH"
				+ ", COUNT(DISTINCT T1.TICKET_EID) AS TOTAL_TICKET_CNT"
				+ ", SUM(IF(T1.STATUS='TICKET_UNPROCESSED', 1, 0)) AS TICKET_UNPROCESSED_CNT"
				+ ", SUM(IF(T1.STATUS='TICKET_IN_PROCESS', 1, 0)) AS TICKET_IN_PROCESS_CNT"
				+ ", SUM(IF(T1.STATUS='TICKET_COMPLETED', 1, 0)) AS TICKET_COMPLETED_CNT"
				+ ", SUM(T1.TRANSMIT_TICKET_CNT) AS TRANSMIT_TICKET_CNT"
				+ " FROM ("
				+ " SELECT T1.TICKET_EID"
				+ ", T2.USER_EID"
				+ ", T2.CTI_EXTENSION"
				+ ", T2.USER_ID"
				+ ", T2.USER_NAME"
				+ ", T3.ORG_EID"
				+ ", T3.PATH             AS ORG_PATH"
				+ ", T1.STATUS"
				+ ", (SELECT COUNT(TH.TICKET_HISTORY_EID) FROM ticket_history_tm TH WHERE T1.TICKET_EID = TH.TICKET_EID AND TH.ENTITY_STATUS != 'DELETE' AND TH.TYPE_CD = 'MANAGER_EID') AS TRANSMIT_TICKET_CNT"
				+ " FROM ticket_tm T1"
				+ " LEFT JOIN user_tm T2 ON T1.MANAGER_EID = T2.USER_EID AND T2.ENTITY_STATUS != 'DELETE'"
				+ " LEFT JOIN org_users OU ON T2.USER_EID = OU.USER_EID"
				+ " LEFT JOIN organization_tm T3 ON T3.ORG_EID = OU.ORG_EID AND T3.ENTITY_STATUS != 'DELETE'"
				+ " WHERE T1.ENTITY_STATUS != 'DELETE'"
				+ " AND DATE_FORMAT(T1.CREATE_DATE, '%Y-%m-%d') >= DATE_FORMAT(:fromDate, '%Y-%m-%d')"
				+ " AND DATE_FORMAT(T1.CREATE_DATE, '%Y-%m-%d') <= DATE_FORMAT(:toDate, '%Y-%m-%d')";
		
		if (searchParameter.getOrganizationPath() != null && searchParameter.getOrganizationPath().isEmpty() == false)
			nativeQuery += " AND T3.PATH LIKE :organizationPath";
		
		if (searchParameter.getUserEntityId() != null && searchParameter.getUserEntityId() > 0)
			nativeQuery += " AND T2.USER_EID = :userEntityId";
		
		if (searchParameter.getCtiExtension() != null && searchParameter.getCtiExtension().isEmpty() == false)
			nativeQuery += " AND T2.CTI_EXTENSION LIKE :ctiExtension";
		
		nativeQuery += ") T1 GROUP BY USER_EID";
		Query query = entityManager.createNativeQuery(nativeQuery);
		query.setParameter("fromDate", searchParameter.getFromDate());
        query.setParameter("toDate", searchParameter.getToDate());
        if (searchParameter.getOrganizationPath() != null && searchParameter.getOrganizationPath().isEmpty() == false)
        	query.setParameter("organizationPath", searchParameter.getOrganizationPath() + "%");
        
        if (searchParameter.getUserEntityId() != null && searchParameter.getUserEntityId() > 0)
        	query.setParameter("userEntityId", searchParameter.getUserEntityId());
        
        if (searchParameter.getCtiExtension() != null && searchParameter.getCtiExtension().isEmpty() == false)
        	query.setParameter("ctiExtension", searchParameter.getCtiExtension() + "%");
        
        List<Object[]> finds = query.getResultList();
		List<TicketStatisticsByUserData> results = new LinkedList<>();
		for(Object[] find : finds) {
			
			String[] organizationPath = null;
			if (find[5] != null) {
				organizationPath = String.valueOf(find[5]).split("\\.");
			}
			
			TicketStatisticsByUserData ticketStatisticsByUserData = TicketStatisticsByUserData.builder()
					.fromDate(searchParameter.getFromDate())
					.toDate(searchParameter.getToDate())
					.userEntityId(find[0] != null ? (Long)find[0] : null)
					.ctiExtension(find[1] != null ? (String)find[1] : null)
					.userId(find[2] != null ? (String)find[2] : null)
					.userName(find[3] != null ? (String)find[3] : null)
					.organizationEntityId(find[4] != null ? (Long)find[4] : null)
					.organizationCodeLarge(organizationPath != null && organizationPath.length > 0 ? organizationPath[0] : "")
					.organizationCodeMedium(organizationPath != null && organizationPath.length > 1 ? organizationPath[1] : "")
					.organizationCodeSmall(organizationPath != null && organizationPath.length > 2 ? organizationPath[2] : "")
					.totalTicketCount(find[6] != null ? ((Number) find[6]).intValue() : 0)
			        .unprocessedTicketCount(find[7] != null ? ((Number) find[7]).intValue() : 0)
			        .inProcessTicketCount(find[8] != null ? ((Number) find[8]).intValue() : 0)
			        .completedTicketCount(find[9] != null ? ((Number) find[9]).intValue() : 0)
			        .transmitTicketCount(find[10] != null ? ((Number) find[10]).intValue() : 0)
					.build();
			
			results.add(ticketStatisticsByUserData);
		}
		
		return results;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<TicketBoardByCallbackData> callbackTicketBoardByUser(TicketStatisticsSearchParameter searchParameter) {
		EntityManager entityManager = ticketDao.getEntityManager();
		String nativeQuery = "SELECT"
				+ "  T1.USER_EID"
				+ ", T1.USER_ID"
				+ ", T1.USER_NAME"
				+ ", COUNT(DISTINCT T2.TICKET_EID) AS TOTAL_CALLBACK_TICKET_CNT"
				+ " FROM user_tm T1"
				+ " LEFT JOIN ticket_tm T2 ON T2.MANAGER_EID = T1.USER_EID"
				+ " AND T2.TYPE = 'CALLBACK_TICKET'"
				+ " AND DATE_FORMAT(T2.CREATE_DATE, '%Y-%m-%d') >= DATE_FORMAT(:fromDate, '%Y-%m-%d')"
				+ " AND DATE_FORMAT(T2.CREATE_DATE, '%Y-%m-%d') <= DATE_FORMAT(:toDate, '%Y-%m-%d')"
				+ " AND T2.ENTITY_STATUS != 'DELETE'"
				+ " WHERE T1.ENTITY_STATUS != 'DELETE'"
				+ " GROUP BY T1.USER_EID, T1.USER_ID, T1.USER_NAME";
		
		Query query = entityManager.createNativeQuery(nativeQuery);
		query.setParameter("fromDate", searchParameter.getFromDate());
        query.setParameter("toDate", searchParameter.getToDate());
        
        List<Object[]> finds = query.getResultList();
		List<TicketBoardByCallbackData> results = new LinkedList<>();
		for(Object[] find : finds) {
			TicketBoardByCallbackData ticketBoardByCallbackData = TicketBoardByCallbackData.builder()
					.userEntityId((Long)find[0])
					.userId((String)find[1])
					.userName((String)find[2])
					.callbackTicketCount(((Number) find[3]).intValue())
					.build();
			
			results.add(ticketBoardByCallbackData);
		}
		return results;
	}

}
