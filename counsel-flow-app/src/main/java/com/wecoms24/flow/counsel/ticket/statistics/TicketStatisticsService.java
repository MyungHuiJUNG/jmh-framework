package com.wecoms24.flow.counsel.ticket.statistics;

import java.util.List;

public interface TicketStatisticsService {
	List<TicketStatisticsByCounselTypeData> statisticsByCounselType(TicketStatisticsSearchParameter searchParameter);
	List<TicketStatisticsByUserData> statisticsByUser(TicketStatisticsSearchParameter searchParameter);
	List<TicketBoardByCallbackData> callbackTicketBoardByUser(TicketStatisticsSearchParameter searchParameter);
}
