package com.example.PlataformaEventos.reservation.controllers;

import com.example.PlataformaEventos.reservation.dtos.ReservationRequestDto;
import com.example.PlataformaEventos.reservation.dtos.ReservationResponseDto;
import com.example.PlataformaEventos.reservation.services.ReservationService;
import com.example.PlataformaEventos.user.entities.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Reservas", description = "Reserva por assento e ciclo de pagamento")
@RestController
@RequestMapping("/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @Operation(
            summary = "Cria reserva com os assentos selecionados",
            description = "Os assentos escolhidos ficam PENDING_PAYMENT e seguram o lugar até a " +
                    "aprovação ou recusa do pagamento. Cada assento recebe TicketType " +
                    "(FULL/HALF) e preço congelado no momento da compra."
    )
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

    @Operation(
            summary = "Lista as reservas do usuário autenticado",
            description = "Pendências de pagamento (para retomar o checkout) e histórico."
    )
    @GetMapping
    public ResponseEntity<List<ReservationResponseDto>> findMyReservations(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                reservationService.findMyReservations(user.getId())
        );
    }

    @Operation(
            summary = "Detalha uma reserva do usuário",
            description = "Retorna assentos, tipos de ingresso e total congelado da reserva."
    )
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
