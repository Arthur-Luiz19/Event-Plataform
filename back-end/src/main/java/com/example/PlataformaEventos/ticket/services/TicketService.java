package com.example.PlataformaEventos.ticket.services;

import com.example.PlataformaEventos.exception.custom.ConflictException;
import com.example.PlataformaEventos.exception.custom.ResourceNotFoundException;
import com.example.PlataformaEventos.exception.custom.WrongEventException;
import com.example.PlataformaEventos.reservation.entities.Reservation;
import com.example.PlataformaEventos.reservation.entities.ReservationSeat;
import com.example.PlataformaEventos.ticket.dtos.TicketQrCodeResponseDto;
import com.example.PlataformaEventos.ticket.dtos.TicketResponseDto;
import com.example.PlataformaEventos.ticket.dtos.TicketShareResponseDto;
import com.example.PlataformaEventos.ticket.entities.Ticket;
import com.example.PlataformaEventos.ticket.enums.TicketStatus;
import com.example.PlataformaEventos.ticket.repositories.TicketRepository;
import com.example.PlataformaEventos.utils.QrCodeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static final int CODE_LENGTH = 32;

    private final TicketRepository ticketRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    public List<Ticket> generateTickets(Reservation reservation) {

        List<Ticket> tickets = new ArrayList<>();

        for (ReservationSeat reservationSeat : reservation.getReservationSeats()) {

            Ticket ticket = Ticket.builder()
                    .reservation(reservation)
                    .reservationSeat(reservationSeat)
                    .code(generateUniqueCode())
                    .build();

            tickets.add(ticket);
        }

        return ticketRepository.saveAll(tickets);
    }

    private String generateUniqueCode() {

        String code;

        do {
            code = generateCode();
        } while (ticketRepository.existsByCode(code));

        return code;
    }

    private String generateCode() {

        StringBuilder code = new StringBuilder(CODE_LENGTH);

        for (int i = 0; i < CODE_LENGTH; i++) {
            int index = secureRandom.nextInt(CHARACTERS.length());
            code.append(CHARACTERS.charAt(index));
        }

        return code.toString();
    }

    @Transactional
    public Ticket validate(String code, UUID eventId) {

        Ticket ticket = ticketRepository.findByCodeForUpdate(code)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Ingresso não encontrado"
                        )
                );

        if (!ticket.getReservation().getEvent().getId().equals(eventId)) {
            throw new WrongEventException(
                    "Ingresso válido para outro evento: " + ticket.getReservation().getEvent().getTitle()
            );
        }

        if (ticket.getStatus() == TicketStatus.USED) {
            throw new ConflictException(
                    "Ingresso já utilizado"
            );
        }

        ticket.setStatus(TicketStatus.USED);
        ticket.setUsedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    public TicketQrCodeResponseDto generateQrCode(UUID ticketId, UUID userId) {

        Ticket ticket = ticketRepository
                .findByIdAndReservationUserId(ticketId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Ingresso não encontrado"
                        )
                );

        String qrCode = QrCodeUtils.generate(ticket.getCode());

        return new TicketQrCodeResponseDto(
                ticket.getId(),
                ticket.getCode(),
                qrCode
        );
    }

    @Transactional
    public List<TicketResponseDto> findMyTickets(UUID userId) {

        return ticketRepository
                .findByReservationUserIdWithDetails(userId)
                .stream()
                .map(TicketResponseDto::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public TicketShareResponseDto findByShareToken(String shareToken) {
        return ticketRepository.findByShareTokenWithDetails(shareToken)
                .map(TicketShareResponseDto::new)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Link inválido ou expirado"));
    }
}
