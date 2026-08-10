package com.example.PlataformaEventos.integration.tmdb.client;

import com.example.PlataformaEventos.integration.tmdb.dto.TmdbMovieResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class TmdbClient {

    private final WebClient tmdbWebClient;

    @Value("${tmdb.api-key}")
    private String apiKey;

    public TmdbMovieResponseDto findMovieById(Long movieId) {

        return tmdbWebClient
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/{movieId}")
                        .queryParam("api_key", apiKey)
                        .queryParam("language", "pt-BR")
                        .build(movieId)
                )
                .retrieve()
                .onStatus(
                        HttpStatusCode::is4xxClientError,
                        response -> response.createException()
                )
                .onStatus(
                        HttpStatusCode::is5xxServerError,
                        response -> response.createException()
                )
                .bodyToMono(TmdbMovieResponseDto.class)
                .block();
    }
}
