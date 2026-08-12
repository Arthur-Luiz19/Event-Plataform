package com.example.PlataformaEventos.integration.tmdb.dto;

import java.util.List;

public record TmdbSearchResponseDto(
        List<TmdbMovieResponseDto> results
) {
}
