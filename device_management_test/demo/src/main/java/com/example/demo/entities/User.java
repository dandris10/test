package com.example.demo.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;


import java.io.Serializable;
import java.util.UUID;

@Entity
public class User  implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "user_id", nullable = false)
    private UUID id;


    public User() {
    }

    public User(UUID user_id) {
        this.id = user_id;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {  // Changed from setUser_id()
        this.id = id;
    }

}
