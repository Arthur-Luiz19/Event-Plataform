package com.example.PlataformaEventos.gate.services;

import com.example.PlataformaEventos.gate.dtos.GateValidationResponseDto;
import com.example.PlataformaEventos.ticket.entities.Ticket;
import com.example.PlataformaEventos.ticket.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GateService {

    private final TicketService ticketService;

    public GateValidationResponseDto validateTicket(String code) {
        Ticket ticket = ticketService.validate(code);

        return new GateValidationResponseDto(ticket);
    }
}
