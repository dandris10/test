package com.example.demo.repositories;

import com.example.demo.entities.Device;
import com.example.demo.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Example: JPA generate query by existing field
     */
    List<User> findAll();
    User save(User user);
    void deleteById(UUID id);
    Optional<User> findById(UUID id);

    /**
     * Example: Custom query
     */
    /* @Query(value = "SELECT p " +
            "FROM User u " +
            "WHERE u.name = :name " +
            "AND u.age >= 60  ")
    Optional<User> findSeniorsByName(@Param("name") String name);*/

}
