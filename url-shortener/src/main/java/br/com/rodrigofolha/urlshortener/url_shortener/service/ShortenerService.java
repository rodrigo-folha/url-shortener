package br.com.rodrigofolha.urlshortener.url_shortener.service;

import br.com.rodrigofolha.urlshortener.url_shortener.dto.ShortenerDTO;
import br.com.rodrigofolha.urlshortener.url_shortener.model.Acesso;
import br.com.rodrigofolha.urlshortener.url_shortener.model.Shortener;
import br.com.rodrigofolha.urlshortener.url_shortener.repository.ShortenerRepository;
import br.com.rodrigofolha.urlshortener.url_shortener.validation.NotFoundException;
import br.com.rodrigofolha.urlshortener.url_shortener.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class ShortenerService {

    private final ShortenerRepository repository;

    public Shortener salvar(ShortenerDTO dto) {
        Shortener shortener = new Shortener();
        shortener.setUrl(dto.url());
        shortener.setCreatedAt(LocalDateTime.now());
        shortener.setUpdatedAt(LocalDateTime.now());

        if (dto.urlPersonalizada() != null && !dto.urlPersonalizada().isBlank()) {
            verificarSeUrlPersonalizadaExiste(dto.urlPersonalizada());
            validarUrlPersonalizada(dto.urlPersonalizada());
            shortener.setShortCode(dto.urlPersonalizada());
        } else {
            shortener.setShortCode(gerarShortCode());
        }

        return repository.save(shortener);
    }

    public Shortener buscar(String shortUrl) {
        Shortener item = verificarSeShortCodeExiste(shortUrl);

        Acesso acesso = new Acesso();
        acesso.setDataAcesso(LocalDateTime.now());

        item.getAcessos().add(acesso);

        return repository.save(item);
    }

    public Page<Shortener> findAll(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        return repository.findAll(pageable);
    }

    public Shortener verificarSeShortCodeExiste(String shortUrl) {
        return repository.findByShortCode(shortUrl)
                .orElseThrow(() -> new NotFoundException("url", "url não encontrado: " + shortUrl));
    }

    public boolean verificarSeUrlPersonalizadaExiste(String urlPersonalizada) {
        if (repository.findByShortCode(urlPersonalizada).isPresent()) {
            throw new ValidationException("url personalizada", "A url personalizada já está sendo utilizada.");
        };

        return false;
    }

    public Long buscarEstatisticas(String shortUrl) {
        return repository.countAcessos(shortUrl);
    }

    public Shortener buscarSemAumentarAcessCount(String shortUrl) {
        return verificarSeShortCodeExiste(shortUrl);
    }

    public Shortener atualizar(String shortUrl, ShortenerDTO dto) {
        Shortener item = verificarSeShortCodeExiste(shortUrl);

        item.setUrl(dto.url());
        item.setUpdatedAt(LocalDateTime.now());
        return repository.save(item);
    }

    public void deletar(String shortUrl) {
        Shortener item = verificarSeShortCodeExiste(shortUrl);

        repository.delete(item);
    }

    private String gerarShortCode() {
        String alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int index = random.nextInt(alphanumeric.length());
            sb.append(alphanumeric.charAt(index));
        }

        if(repository.findByShortCode(sb.toString()).isPresent()) {
            return gerarShortCode();
        }

        return sb.toString();
    }

    private void validarUrlPersonalizada(String urlPersonalizada) {
        String limpa = urlPersonalizada.trim();
        if (!limpa.matches("^[A-Za-z0-9-]+$")) {
            throw new ValidationException("url personalizada", "a url '" + urlPersonalizada + "' não segue os padrões aceitos");
        }
    }

}
