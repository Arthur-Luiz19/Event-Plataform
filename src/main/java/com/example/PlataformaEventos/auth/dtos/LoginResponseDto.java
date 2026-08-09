package com.example.PlataformaEventos.auth.dtos;

import com.example.PlataformaEventos.user.enums.Roles;

import java.util.UUID;

public record LoginResponseDto(
        String token,
        UUID userId,
        String name,
        String email,
        Roles role
) {
}
