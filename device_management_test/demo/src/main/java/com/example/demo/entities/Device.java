package com.example.demo.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;


import java.io.Serializable;
import java.util.UUID;

@Entity
public class Device  implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @UuidGenerator
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID device_id;


    @JsonProperty("name")
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "value", nullable = false)
    private double value;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;


    public Device() {
    }

    public Device(String name, double value, User user) {
        this.name = name;
        this.value = value;
        this.user = user;
    }

    public UUID getDevice_id() {
        return device_id;
    }

    public void setDevice_id(UUID id) {
        this.device_id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
