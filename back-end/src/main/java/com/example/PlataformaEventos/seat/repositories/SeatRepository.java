package com.example.PlataformaEventos.seat.repositories;

import com.example.PlataformaEventos.event.entities.Event;
import com.example.PlataformaEventos.seat.entities.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SeatRepository extends JpaRepository<Seat, UUID> {

    List<Seat> findByEvent(Event event);
}
