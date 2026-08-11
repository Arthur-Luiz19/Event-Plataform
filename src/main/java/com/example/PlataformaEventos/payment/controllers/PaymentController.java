package com.example.PlataformaEventos.payment.controllers;

import com.example.PlataformaEventos.payment.dtos.PaymentRequestDto;
import com.example.PlataformaEventos.payment.dtos.PaymentResponseDto;
import com.example.PlataformaEventos.payment.services.PaymentService;
import com.example.PlataformaEventos.user.entities.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponseDto> process(
            @Valid @RequestBody PaymentRequestDto request,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        PaymentResponseDto response =
                paymentService.process(request, user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}
