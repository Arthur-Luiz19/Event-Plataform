package com.example.PlataformaEventos.payment.controllers;

import com.example.PlataformaEventos.payment.dtos.PaymentRequestDto;
import com.example.PlataformaEventos.payment.dtos.PaymentResponseDto;
import com.example.PlataformaEventos.payment.services.PaymentService;
import com.example.PlataformaEventos.user.entities.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Pagamentos", description = "Pagamento simulado de reservas (sem provedor real)")
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(
            summary = "Processa o pagamento de uma reserva",
            description = "Aprova ou recusa de forma simulada. Na aprovação, a reserva vira CONFIRMED " +
                    "e os ingressos são gerados (1 por assento); na recusa, a reserva é cancelada " +
                    "e os assentos devolvidos ao mapa. O valor cobrado é o totalAmount congelado " +
                    "na criação da reserva."
    )
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
