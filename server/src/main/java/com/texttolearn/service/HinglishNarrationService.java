package com.texttolearn.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

/**
 * Milestone 10: translates lesson text to Hinglish and synthesizes audio via the Gemini API.
 *
 * This is intentionally a thin, swappable wrapper: Gemini's exact TTS request/response shape
 * changes over time, so treat the two methods below as the integration points to wire up
 * against the current Gemini API docs when GEMINI_API_KEY is set, rather than a frozen contract.
 */
@Service
public class HinglishNarrationService {

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com/v1beta")
            .build();

    @Value("${gemini.api-key}")
    private String apiKey;

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    /** Step 1: translate English lesson text into Hinglish (romanized, code-mixed Hindi/English). */
    public String translateToHinglish(String englishText) {
        if (!isConfigured()) {
            throw new IllegalStateException("GEMINI_API_KEY is not configured");
        }

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of(
                                "text", "Translate the following lesson text into natural, conversational " +
                                        "Hinglish (romanized Hindi mixed with English), suitable for a student " +
                                        "who is more comfortable with spoken Hindi than written English. " +
                                        "Return only the translated text, nothing else.\n\n" + englishText))
                ))
        );

        JsonNode response = webClient.post()
                .uri(uriBuilder -> uriBuilder.path("/models/gemini-1.5-flash:generateContent")
                        .queryParam("key", apiKey).build())
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response == null) throw new IllegalStateException("Empty response from Gemini");
        return response.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
    }

    /**
     * Step 2: synthesize audio for the translated text via a Gemini TTS-capable model and return
     * base64-encoded audio bytes (frontend can play this directly or save as a .wav download).
     * voiceName lets the caller pick among Gemini's available prebuilt voices.
     */
    public String synthesizeSpeech(String text, String voiceName) {
        if (!isConfigured()) {
            throw new IllegalStateException("GEMINI_API_KEY is not configured");
        }

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", text)))),
                "generationConfig", Map.of(
                        "responseModalities", List.of("AUDIO"),
                        "speechConfig", Map.of(
                                "voiceConfig", Map.of(
                                        "prebuiltVoiceConfig", Map.of("voiceName", voiceName != null ? voiceName : "Kore")
                                )
                        )
                )
        );

        JsonNode response = webClient.post()
                .uri(uriBuilder -> uriBuilder.path("/models/gemini-2.5-flash-preview-tts:generateContent")
                        .queryParam("key", apiKey).build())
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response == null) throw new IllegalStateException("Empty response from Gemini TTS");
        // Base64 PCM/WAV audio bytes, ready to send straight to the frontend as a data URL.
        return response.path("candidates").get(0).path("content").path("parts").get(0)
                .path("inlineData").path("data").asText();
    }
}
