package com.texttolearn.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Milestone 9: resolves a lesson's { type: "video", query } block into real YouTube results
 * via the YouTube Data API v3 search endpoint.
 */
@Service
public class YouTubeService {

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://www.googleapis.com/youtube/v3")
            .build();

    @Value("${youtube.api-key}")
    private String apiKey;

    public record VideoResult(String videoId, String title, String embedUrl) {}

    public List<VideoResult> search(String query, int maxResults) {
        if (apiKey == null || apiKey.isBlank()) {
            // No key configured yet - return an empty list so the frontend can show a friendly
            // "video unavailable" state instead of failing the whole lesson render.
            return List.of();
        }

        JsonNode response = webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/search")
                        .queryParam("part", "snippet")
                        .queryParam("q", query)
                        .queryParam("maxResults", Math.max(1, Math.min(maxResults, 3)))
                        .queryParam("type", "video")
                        .queryParam("videoEmbeddable", "true")
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        List<VideoResult> results = new ArrayList<>();
        if (response == null) return results;

        for (JsonNode item : response.path("items")) {
            String videoId = item.path("id").path("videoId").asText();
            String title = item.path("snippet").path("title").asText();
            results.add(new VideoResult(videoId, title, "https://www.youtube.com/embed/" + videoId));
        }
        return results;
    }
}
