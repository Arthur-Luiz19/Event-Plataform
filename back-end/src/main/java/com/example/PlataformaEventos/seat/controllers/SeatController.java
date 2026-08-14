package com.example.PlataformaEventos.seat.controllers;

import com.example.PlataformaEventos.seat.dto.SeatResponseDto;
import com.example.PlataformaEventos.seat.services.SeatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Tag(name = "Assentos", description = "Grade de assentos e disponibilidade por evento")
@RestController
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @Operation(
            summary = "Lista os assentos de um evento com a situação atual",
            description = "Cada assento vem com o flag de reservado: assentos PENDING_PAYMENT e " +
                    "CONFIRMED aparecem ocupados no mapa."
    )
    @GetMapping("/events/{eventId}/seats")
    public ResponseEntity<List<SeatResponseDto>> listByEvent(@PathVariable UUID eventId) {
        return ResponseEntity.ok(seatService.listByEvent(eventId));
    }
}
