package br.com.rodrigofolha.urlshortener.url_shortener.repository;

import br.com.rodrigofolha.urlshortener.url_shortener.model.Shortener;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShortenerRepository extends JpaRepository<Shortener, Integer> {
    public Optional<Shortener> findByShortCode(String shortUrl);

    @Query("""
            SELECT COUNT(a)
            FROM Shortener s
            JOIN s.acessos a
            WHERE s.shortCode = :shortCode
           """)
    Long countAcessos(@Param("shortCode") String shortCode);
}
