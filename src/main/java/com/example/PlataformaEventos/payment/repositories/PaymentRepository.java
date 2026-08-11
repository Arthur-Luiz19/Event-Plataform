package com.example.PlataformaEventos.payment.repositories;

import com.example.PlataformaEventos.payment.entities.Payment;
import com.example.PlataformaEventos.reservation.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByReservation(Reservation reservation);

    boolean existsByReservation(Reservation reservation);
}
