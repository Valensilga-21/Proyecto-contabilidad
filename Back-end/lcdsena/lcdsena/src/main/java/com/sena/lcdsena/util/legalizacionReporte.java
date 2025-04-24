package com.sena.lcdsena.util;

import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import com.sena.lcdsena.model.legalizacion;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

@Service
public class legalizacionReporte {
    public byte[] exportToPdf(List<legalizacion> list) throws JRException, FileNotFoundException {
        JasperPrint jasperPrint = getReport(list);
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    private JasperPrint getReport(List<legalizacion> list) throws FileNotFoundException, JRException {
        Map<String, Object> params = new HashMap<>();
        JRBeanCollectionDataSource tableDataSource = new JRBeanCollectionDataSource(list);
        params.put("legalizacionData", tableDataSource); // 👈 este es el cambio clave
    
        JasperReport jasperReport = JasperCompileManager.compileReport(
                ResourceUtils.getFile("classpath:legalizacionesReport.jrxml").getAbsolutePath());
    
        // Pasamos un EmptyDataSource porque el data real lo usa el subDataset
        return JasperFillManager.fillReport(jasperReport, params, new net.sf.jasperreports.engine.JREmptyDataSource());
    }
    
}
