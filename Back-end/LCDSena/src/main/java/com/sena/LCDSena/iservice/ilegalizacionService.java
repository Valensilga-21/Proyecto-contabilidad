package com.sena.LCDSena.iservice;

import com.sena.LCDSena.model.legalizacion;

public interface ilegalizacionService {

    public String save (legalizacion legalizacion);
    public int guardarpdfJson(legalizacion legalizacion);
}
