package br.com.rodrigofolha.urlshortener.url_shortener.dto;

import java.time.LocalDateTime;

public record StatisticsResponseDTO(
        int id,
        String url,
        String shortCode,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long accessCount
) {

}
