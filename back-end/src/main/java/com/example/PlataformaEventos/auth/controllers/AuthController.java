package com.example.PlataformaEventos.auth.controllers;

import com.example.PlataformaEventos.auth.dtos.LoginRequestDto;
import com.example.PlataformaEventos.auth.dtos.LoginResponseDto;
import com.example.PlataformaEventos.auth.services.AuthService;
import com.example.PlataformaEventos.user.dtos.UserRequestDto;
import com.example.PlataformaEventos.user.dtos.UserResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Autenticação", description = "Registro e login com emissão de JWT")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "Registra um novo usuário",
            description = "Cria a conta com papel padrão CLIENT; o e-mail deve ser único."
    )
    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@Valid @RequestBody UserRequestDto data) {
        UserResponseDto response = authService.register(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
            summary = "Autentica e emite token JWT",
            description = "Retorna token e papel para o front montar a sessão e o redirecionamento por perfil."
    )
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @Valid @RequestBody LoginRequestDto data
    ) {
        return ResponseEntity.ok(
                authService.login(data)
        );
    }
}
