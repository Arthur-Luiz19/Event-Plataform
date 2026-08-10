package com.example.PlataformaEventos.integration.tmdb.services;

import com.example.PlataformaEventos.integration.tmdb.client.TmdbClient;
import com.example.PlataformaEventos.integration.tmdb.dto.TmdbMovieResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TmdbService {

    private final TmdbClient tmdbClient;

    @Value("${tmdb.image-base-url}")
    private String imageBaseUrl;

    public TmdbMovieResponseDto findMovie(Long movieId) {

        TmdbMovieResponseDto movie =
                tmdbClient.findMovieById(movieId);

        if (movie.posterPath() == null) {
            return movie;
        }

        return new TmdbMovieResponseDto(
                movie.id(),
                movie.title(),
                movie.overview(),
                imageBaseUrl + movie.posterPath()
        );
    }
}
