package br.com.rodrigofolha.urlshortener.url_shortener.dto.mapper;

import br.com.rodrigofolha.urlshortener.url_shortener.dto.ShortenerResponseDTO;
import br.com.rodrigofolha.urlshortener.url_shortener.dto.StatisticsResponseDTO;
import br.com.rodrigofolha.urlshortener.url_shortener.model.Shortener;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ShortenerMapper {

    ShortenerResponseDTO toShortenerDto(Shortener shortener);

    @Mapping(source = "accessCount", target = "accessCount")
    StatisticsResponseDTO toStatisticDto(Shortener shortener, Long accessCount);
}
