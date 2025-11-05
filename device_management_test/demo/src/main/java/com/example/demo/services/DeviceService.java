package com.example.demo.services;

import com.example.demo.entities.Device;
import com.example.demo.entities.User;
import com.example.demo.repositories.DeviceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeviceService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceService.class);
    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    //Get all devices in the database
    public List<Device> getAllDevices(){
        return deviceRepository.findAll();
    }

    //Insert a device into the database
    public Device inserDevice(Device device){
        return deviceRepository.save(device);
    }

    //Delete a device
    public void deleteDevice(UUID id){
        deviceRepository.deleteById(id);
    }

    public List<Device> getDevicesByUserId(UUID id){
        return deviceRepository.findAllByUserId(id);
    }

    public Device updateDevice(Device device){
        return deviceRepository.save(device);
    }

    public Optional<Device> getDeviceById(UUID id){
        return deviceRepository.findById(id);
    }

}
