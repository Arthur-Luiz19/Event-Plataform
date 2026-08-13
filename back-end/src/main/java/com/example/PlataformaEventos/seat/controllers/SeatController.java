package com.example.PlataformaEventos.seat.controllers;

import com.example.PlataformaEventos.seat.dto.SeatResponseDto;
import com.example.PlataformaEventos.seat.services.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/events/{eventId}/seats")
    public ResponseEntity<List<SeatResponseDto>> listByEvent(@PathVariable UUID eventId) {
        return ResponseEntity.ok(seatService.listByEvent(eventId));
    }
}
