package com.wecoms24.flow.counsel.ticket;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.web.util.UriUtils;

import com.wecoms24.flow.FlowAppConstants;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class TicketExcelDownloader {
	private HttpServletResponse response;
    private String fileName;
    private String sheetName;
    private List<Column> headers;
    
    public TicketExcelDownloader(HttpServletResponse response) {
        this("", response);
    }
    
    public TicketExcelDownloader(String sheetName, HttpServletResponse response) {
        this.response = response;
        this.sheetName = sheetName;
        this.headers = new ArrayList<>();
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public void setSheetName(String sheetName) {
        this.sheetName = sheetName;
    }
    
    public void setHeaders(List<Column> headers) {
        this.headers = headers;
    }
    
    public void execute(int limit, int startHeaderRowIdx, DataListener listener) {
    	SXSSFWorkbook workbook = new SXSSFWorkbook(limit);
        Sheet sheet = workbook.createSheet(sheetName);
        sheet.setDefaultColumnWidth(15);
        setSheetHeaders(sheet, createHeaderStyle(workbook), startHeaderRowIdx);
        CellStyle cellStyle = createCellStyle(workbook);
        
        try {
            listener.setRows(limit, sheet, cellStyle);
            File originFile = new File(fileName);
            
            try (ByteArrayOutputStream bos = new ByteArrayOutputStream();
                 OutputStream outputStream = new FileOutputStream(originFile)) {
                
                workbook.write(bos);
                bos.writeTo(outputStream);
            }

            response.setHeader("Set-Cookie", "fileDownload=true; path=/");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + UriUtils.encode(fileName, FlowAppConstants.UTF_8_STRING_VALUE) + "\"");

            try (InputStream inputStream = new FileInputStream(originFile)) {
                IOUtils.copy(inputStream, response.getOutputStream());
            }

            if (originFile.exists() && originFile.delete()) {
            	log.info("Success Delete File...");
            } else {
            	log.info("Failed Delete File...");
            }
        } catch (Exception e) {
            response.setHeader("Set-Cookie", "fileDownload=false; path=/");
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("Content-Type", "text/html; charset=" + FlowAppConstants.UTF_8_STRING_VALUE);

            try (OutputStream out = response.getOutputStream()) {
                byte[] data = "".getBytes();
                out.write(data);
            } catch (IOException ioe) {
                ioe.printStackTrace();
            }
        } finally {
            try {
                workbook.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    
    private CellStyle createHeaderStyle(SXSSFWorkbook workbook) {
        Font font = workbook.createFont();
        font.setFontName(FlowAppConstants.EXCEL_FONT_NAME_ARIAL);
        font.setBold(true);
        font.setColor(HSSFColor.HSSFColorPredefined.WHITE.getIndex());
        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor(HSSFColor.HSSFColorPredefined.BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFont(font);
        return style;
    }
    
    private void setSheetHeaders(Sheet sheet, CellStyle style, int startRowIdx) {
        Row row = sheet.createRow(startRowIdx);
        Cell cell = null;
        for (int i = 0; i < headers.size(); i++) {
            Column column = headers.get(i);
            cell = row.createCell(column.getIndex());
            cell.setCellStyle(style);
            cell.setCellValue(column.getName());
            if (column.getCharacters() > 0)
                sheet.setColumnWidth(column.getIndex(), column.getCharacters() * 256);
        }
    }
    
    private CellStyle createCellStyle(SXSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }
    
    static class Column {
        private int index;
        private String name;
        private int characters;
        public Column(int index, String name, int characters) {
            this.index = index;
            this.name = name;
            this.characters = characters;
        }
        public int getIndex() {
            return index;
        }
        public void setIndex(int index) {
            this.index = index;
        }
        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }
        public int getCharacters() {
            return characters;
        }
        public void setCharacters(int characters) {
            this.characters = characters;
        }
    }
    
    static interface DataListener {
        void setRows(int limit, Sheet sheet, CellStyle style);
    }
}
