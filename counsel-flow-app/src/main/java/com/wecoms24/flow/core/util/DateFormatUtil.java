package com.wecoms24.flow.core.util;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.wecoms24.flow.FlowAppConstants;

public class DateFormatUtil {
    public static String formatDate(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat(FlowAppConstants.DATETIME_FORMAT_SPLIT_SYMBOL);
        return sdf.format(date);
    }
}
