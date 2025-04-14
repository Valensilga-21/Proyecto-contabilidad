package com.sena.lcdsena.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.sena.lcdsena.service.viajeService;

@Component
public class task {

    @Autowired
    private viajeService viajeService;

    @Scheduled(cron = "0 0 6 * * *")
    public void ejecutarRecordatorios() {
        viajeService.enviarRecordatoriosPendientes();
    }

    @Scheduled(cron = "0 0 6 * * *")
    public void enviarRecordatoriosPrevios() {
        viajeService.enviarRecordatoriosPendientes();
    }

}
