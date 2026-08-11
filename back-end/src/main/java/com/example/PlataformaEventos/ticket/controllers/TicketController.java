package com.example.PlataformaEventos.ticket.controllers;

import com.example.PlataformaEventos.ticket.dtos.TicketQrCodeResponseDto;
import com.example.PlataformaEventos.ticket.dtos.TicketResponseDto;
import com.example.PlataformaEventos.ticket.dtos.TicketShareResponseDto;
import com.example.PlataformaEventos.ticket.services.TicketService;
import com.example.PlataformaEventos.user.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public ResponseEntity<List<TicketResponseDto>> findMyTickets(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                ticketService.findMyTickets(user.getId())
        );
    }

    @GetMapping("/{ticketId}/qrcode")
    public ResponseEntity<TicketQrCodeResponseDto> generateQrCode(
            @PathVariable UUID ticketId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                ticketService.generateQrCode(
                        ticketId,
                        user.getId()
                )
        );
    }

    @GetMapping("/share/{shareToken}")
    public ResponseEntity<TicketShareResponseDto> getSharedTicket(
            @PathVariable String shareToken
    ) {
        return ResponseEntity.ok(
                ticketService.findByShareToken(shareToken)
        );
    }
}
