package com.example.demo.entities;


import java.io.Serializable;
import java.util.UUID;

public class UserDeviceDTO implements Serializable{

    private static final long serialVersionUID = 1L;

    private UUID id;


    public UserDeviceDTO() {
    }

    public UserDeviceDTO(UUID user_id) {
        this.id = user_id;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

}
