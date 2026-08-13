package com.example.PlataformaEventos.reservation.controllers;

import com.example.PlataformaEventos.reservation.dtos.ReservationRequestDto;
import com.example.PlataformaEventos.reservation.dtos.ReservationResponseDto;
import com.example.PlataformaEventos.reservation.services.ReservationService;
import com.example.PlataformaEventos.user.entities.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponseDto> create(
            @Valid @RequestBody ReservationRequestDto data,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        ReservationResponseDto response =
                reservationService.createReservation(data, user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponseDto>> findMyReservations(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                reservationService.findMyReservations(user.getId())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponseDto> findById(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                reservationService.findById(id, user)
        );
    }
}
