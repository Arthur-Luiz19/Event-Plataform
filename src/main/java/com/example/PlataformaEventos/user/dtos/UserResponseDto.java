package com.example.PlataformaEventos.user.dtos;

import com.example.PlataformaEventos.user.entities.User;
import com.example.PlataformaEventos.user.enums.Roles;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponseDto(UUID userId,
                              String name,
                              String email,
                              Roles role,
                              LocalDateTime createdAt) {

    public UserResponseDto(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}