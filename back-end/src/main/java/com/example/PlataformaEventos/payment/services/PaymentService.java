package com.example.PlataformaEventos.payment.services;

import com.example.PlataformaEventos.exception.custom.ConflictException;
import com.example.PlataformaEventos.exception.custom.ForbiddenException;
import com.example.PlataformaEventos.exception.custom.ResourceNotFoundException;
import com.example.PlataformaEventos.payment.dtos.PaymentRequestDto;
import com.example.PlataformaEventos.payment.dtos.PaymentResponseDto;
import com.example.PlataformaEventos.payment.entities.Payment;
import com.example.PlataformaEventos.payment.enums.PaymentStatus;
import com.example.PlataformaEventos.payment.repositories.PaymentRepository;
import com.example.PlataformaEventos.reservation.entities.Reservation;
import com.example.PlataformaEventos.reservation.enums.ReservationStatus;
import com.example.PlataformaEventos.reservation.repositories.ReservationRepository;
import com.example.PlataformaEventos.ticket.services.TicketService;
import com.example.PlataformaEventos.user.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final TicketService ticketService;

    @Transactional
    public PaymentResponseDto process(
            PaymentRequestDto dto,
            User user
    ) {

        Reservation reservation =
                reservationRepository.findByIdForUpdate(dto.reservationId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Reserva não encontrada"
                                )
                        );

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException(
                    "Você não pode realizar o pagamento desta reserva"
            );
        }

        if (reservation.getStatus()
                != ReservationStatus.PENDING_PAYMENT) {

            throw new ConflictException(
                    "A reserva não está aguardando pagamento"
            );
        }

        if (paymentRepository.existsByReservation(reservation)) {
            throw new ConflictException(
                    "Esta reserva já possui um pagamento"
            );
        }

        BigDecimal amount =
                reservation.getEvent()
                        .getTicketPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        reservation.getQuantity()
                                )
                        );

        Payment payment = Payment.builder()
                .reservation(reservation)
                .amount(amount)
                .status(dto.status())
                .processedAt(LocalDateTime.now())
                .build();

        if (dto.status() == PaymentStatus.APPROVED) {

            reservation.setStatus(
                    ReservationStatus.CONFIRMED
            );

            ticketService.generateTickets(reservation);

        } else if (dto.status() == PaymentStatus.REFUSED) {

            reservation.setStatus(
                    ReservationStatus.CANCELLED
            );
        }

        payment = paymentRepository.save(payment);

        return new PaymentResponseDto(payment);
    }
}
