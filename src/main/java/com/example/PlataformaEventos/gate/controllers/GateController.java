package com.example.PlataformaEventos.gate.controllers;

import com.example.PlataformaEventos.gate.dtos.GateValidationRequestDto;
import com.example.PlataformaEventos.gate.dtos.GateValidationResponseDto;
import com.example.PlataformaEventos.gate.services.GateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gate")
@RequiredArgsConstructor
public class GateController {

    private final GateService gateService;

    @PostMapping("/validate")
    public ResponseEntity<GateValidationResponseDto> validateTicket(
            @Valid @RequestBody GateValidationRequestDto request
    ) {

        return ResponseEntity.ok(
                gateService.validateTicket(request.code())
        );
    }
}