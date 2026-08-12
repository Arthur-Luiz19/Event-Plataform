package com.example.PlataformaEventos.integration.tmdb.dto;

public record CatalogMovieDto(
        Long tmdbMovieId,
        String title,
        String posterUrl,
        String overview,
        String releaseDate
) {
}
