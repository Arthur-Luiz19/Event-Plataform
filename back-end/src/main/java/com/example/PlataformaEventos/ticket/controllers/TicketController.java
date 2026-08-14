package com.example.PlataformaEventos.ticket.controllers;

import com.example.PlataformaEventos.ticket.dtos.TicketQrCodeResponseDto;
import com.example.PlataformaEventos.ticket.dtos.TicketResponseDto;
import com.example.PlataformaEventos.ticket.dtos.TicketShareResponseDto;
import com.example.PlataformaEventos.ticket.services.TicketService;
import com.example.PlataformaEventos.user.entities.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Tag(name = "Ingressos", description = "Ingressos 1:1 com assento, QR e link público de compartilhamento")
@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @Operation(
            summary = "Lista os ingressos do usuário autenticado",
            description = "Cada ingresso expõe código, assento (rótulo e tipo FULL/HALF) e dados do evento."
    )
    @GetMapping
    public ResponseEntity<List<TicketResponseDto>> findMyTickets(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                ticketService.findMyTickets(user.getId())
        );
    }

    @Operation(
            summary = "Gera o QR code de um ingresso próprio",
            description = "Alternativa de contrato: o front também renderiza o QR no cliente " +
                    "(qrcode.react) a partir do código do ingresso."
    )
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

    @Operation(
            summary = "Consulta pública de ingresso compartilhado",
            description = "Aberta sem login (permitAll): quem recebe o link vê QR, assento e tipo — " +
                    "espelha o comportamento da página de share no front."
    )
    @GetMapping("/share/{shareToken}")
    public ResponseEntity<TicketShareResponseDto> getSharedTicket(
            @PathVariable String shareToken
    ) {
        return ResponseEntity.ok(
                ticketService.findByShareToken(shareToken)
        );
    }
}
