package com.example.PlataformaEventos.gate.controllers;

import com.example.PlataformaEventos.gate.dtos.GateValidationRequestDto;
import com.example.PlataformaEventos.gate.dtos.GateValidationResponseDto;
import com.example.PlataformaEventos.gate.services.GateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Portaria", description = "Validação de ingressos na entrada da sessão")
@RestController
@RequestMapping("/gate")
@RequiredArgsConstructor
public class GateController {

    private final GateService gateService;

    @Operation(
            summary = "Valida um ingresso (QR ou digitação)",
            description = "Marca o ingresso como USED na primeira validação válida. " +
                    "Segunda leitura do mesmo código é recusada."
    )
    @PostMapping("/validate")
    public ResponseEntity<GateValidationResponseDto> validateTicket(
            @Valid @RequestBody GateValidationRequestDto request
    ) {

        return ResponseEntity.ok(
                gateService.validateTicket(request.code(), request.eventId())
        );
    }
}