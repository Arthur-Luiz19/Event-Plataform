package com.example.PlataformaEventos.auth.controllers;

import com.example.PlataformaEventos.auth.dtos.LoginRequestDto;
import com.example.PlataformaEventos.auth.dtos.LoginResponseDto;
import com.example.PlataformaEventos.auth.services.AuthService;
import com.example.PlataformaEventos.user.dtos.UserRequestDto;
import com.example.PlataformaEventos.user.dtos.UserResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@Valid @RequestBody UserRequestDto data) {
        UserResponseDto response = authService.register(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @Valid @RequestBody LoginRequestDto data
    ) {
        return ResponseEntity.ok(
                authService.login(data)
        );
    }
}
