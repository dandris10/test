package com.example.demo.controllers;


import com.example.demo.entities.Device;
import com.example.demo.services.DeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/devices")
public class DeviceController {

    private final DeviceService deviceService;
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    public ResponseEntity<List<Device>> getAllDevices(
            @RequestHeader(value = "X-User-Id", required = false) String authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole
    ){
        if("ROLE_USER".equals(userRole)) {
            System.out.println("User " + authenticatedUserId + " attempted to access all devices - 403");
            return ResponseEntity.ok(deviceService.getAllDevices());
        }

        if(authenticatedUserId == null){
            System.out.println("No user id found - 401");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(deviceService.getAllDevices());
    }

    // Get devices by user ID - users can ONLY access their own
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Device>> getDevicesByUserId(
            @PathVariable UUID userId,
            @RequestHeader(value = "X-User-Id", required = false) String authenticatedUserId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {


        System.out.println("Fetching devices for user: " + userId);
        System.out.println("User role: " + userRole);
        System.out.println("Authenticated user id: " + authenticatedUserId);


        // Admins can access any user's devices
        if ("ROLE_ADMIN".equals(userRole)) {
            System.out.println("Admin fetching devices for user: " + userId);
            return ResponseEntity.ok(deviceService.getDevicesByUserId(userId));
        }

        // Regular users can ONLY access their own devices
        if (authenticatedUserId == null || !userId.equals(UUID.fromString(authenticatedUserId))) {
            System.out.println("User " + authenticatedUserId + " attempted to access devices for user " + userId + " - 403");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        System.out.println("User " + authenticatedUserId + " fetching their own devices");
        return ResponseEntity.ok(deviceService.getDevicesByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Device> createDevice(@RequestBody Device device

    ){
        System.out.println("Device:" + device.getName() + " " + device.getValue());
        return ResponseEntity.ok(deviceService.inserDevice(device));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable UUID id){
        if(deviceService.getDeviceById(id).isEmpty()){
            return ResponseEntity.notFound().build();
        }

        deviceService.deleteDevice(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Device> updateDevice(@PathVariable UUID id, @RequestBody Device device){
        if(deviceService.getDeviceById(id).isEmpty()){
            return ResponseEntity.notFound().build();
        }

        device.setDevice_id(id);
        Device updatedDevice = deviceService.updateDevice(device);

        return ResponseEntity.ok(updatedDevice);
    }
}
