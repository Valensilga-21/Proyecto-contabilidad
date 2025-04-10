package com.sena.lcdsena.model;

public class respuestaPdf {

    public String status;
    public String message;

    public respuestaPdf(String status) {
        super();

        this.status = status;
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
