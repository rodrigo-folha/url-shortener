package br.com.rodrigofolha.urlshortener.url_shortener.controller;

import br.com.rodrigofolha.urlshortener.url_shortener.dto.ShortenerDTO;
import br.com.rodrigofolha.urlshortener.url_shortener.dto.ShortenerResponseDTO;
import br.com.rodrigofolha.urlshortener.url_shortener.dto.StatisticsResponseDTO;
import br.com.rodrigofolha.urlshortener.url_shortener.dto.mapper.ShortenerMapper;
import br.com.rodrigofolha.urlshortener.url_shortener.model.Shortener;
import br.com.rodrigofolha.urlshortener.url_shortener.service.ShortenerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/shorten")
@RequiredArgsConstructor
@Slf4j
public class ShortenerController {

    private final ShortenerService service;
    private final ShortenerMapper mapper;

    @PostMapping
    public ResponseEntity<ShortenerResponseDTO> salvar(@RequestBody @Valid ShortenerDTO dto) {
        log.info("Criando shortCode");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapper.toShortenerDto(service.salvar(dto)));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<ShortenerResponseDTO>> findAll(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {

        Page<Shortener> responses = service.findAll(pageNo, pageSize);
        return ResponseEntity.ok(responses.map(mapper::toShortenerDto));
    }

    @GetMapping("/{short}/stats")
    public ResponseEntity<StatisticsResponseDTO> buscarEstatisticas(@PathVariable("short") String shortUrl) {
        log.info("Buscando estatisticas do url, shortUrl: {}", shortUrl);
        Long accessCount = service.buscarEstatisticas(shortUrl);
        return ResponseEntity.ok(mapper.toStatisticDto(service.buscarSemAumentarAcessCount(shortUrl), accessCount));
    }

    @GetMapping("/{short}")
    public ResponseEntity<ShortenerResponseDTO> buscar(@PathVariable("short") String shortUrl) {
        log.info("Buscando url, shortUrl: {}", shortUrl);
        return ResponseEntity.ok(mapper.toShortenerDto(service.buscar(shortUrl)));
    }


    @PutMapping("/{short}")
    public ResponseEntity<ShortenerResponseDTO> atualizar(
            @PathVariable("short") String shortUrl, @RequestBody @Valid ShortenerDTO dto) {
        log.info("Atualizando url, shortUrl: {}", shortUrl);
        return ResponseEntity.ok(ShortenerResponseDTO.valueOf(service.atualizar(shortUrl, dto)));
    }

    @DeleteMapping("/{short}")
    public ResponseEntity<Void> deletar(@PathVariable("short") String shortUrl) {
        log.info("Deletando url, shortUrl: {}", shortUrl);
        service.deletar(shortUrl);
        return ResponseEntity.noContent().build();
    }
}
