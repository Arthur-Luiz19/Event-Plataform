package com.example.PlataformaEventos.seat.dto;

import com.example.PlataformaEventos.seat.entities.Seat;

import java.util.UUID;

public record SeatResponseDto(
        UUID id,
        String row,
        Integer number,
        String label,
        boolean reserved
) {
    public SeatResponseDto(Seat seat, boolean reserved) {
        this(seat.getId(), seat.getRow(), seat.getNumber(), seat.getLabel(), reserved);
    }
}
