package com.sena.LCDSena.util;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import com.sena.LCDSena.model.usuario;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleXlsReportConfiguration;
import net.sf.jasperreports.export.XlsxReportConfiguration;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;

@Service
public class usuarioReporte {
    public byte[] exportToPdf(List<usuario> list) throws JRException, FileNotFoundException {
        JasperPrint jasperPrint = getReport(list);
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    public byte[] exportToXls(List<usuario> list) throws JRException, FileNotFoundException {
        ByteArrayOutputStream byteArray = new ByteArrayOutputStream();
        JRXlsxExporter exporter = new JRXlsxExporter();
    
        // Configuración del exportador
        SimpleExporterInput exporterInput = new SimpleExporterInput(getReport(list));
        SimpleOutputStreamExporterOutput exporterOutput = new SimpleOutputStreamExporterOutput(byteArray);
        
        exporter.setExporterInput(exporterInput);
        exporter.setExporterOutput(exporterOutput);
    
        // Configuración adicional (opcional)
        SimpleXlsReportConfiguration configuration = new SimpleXlsReportConfiguration();
        configuration.setOnePagePerSheet(true); // Ejemplo de configuración
        exporter.setConfiguration((XlsxReportConfiguration) configuration);
    
        exporter.exportReport();
        return byteArray.toByteArray();
    }

    private JasperPrint getReport(List<usuario> list) throws FileNotFoundException, JRException {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("usuariosData", new JRBeanCollectionDataSource(list));

        JasperPrint report = JasperFillManager.fillReport(JasperCompileManager.compileReport(
                ResourceUtils.getFile("classpath:usuariosReport.jrxml")
                        .getAbsolutePath()),
                params, new JREmptyDataSource());

        return report;
    }
}
