package com.example.PlataformaEventos.auth.dtos;

import com.example.PlataformaEventos.user.enums.Roles;
import java.util.UUID;

public record JWTUserData(
        UUID userId,
        String email,
        Roles role
) {
}
