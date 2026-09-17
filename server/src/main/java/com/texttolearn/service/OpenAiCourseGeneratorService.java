package com.texttolearn.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.texttolearn.dto.CourseOutline;
import com.texttolearn.dto.LessonGenerationResult;
import com.texttolearn.model.ContentBlock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Milestone 8: calls the OpenAI Chat Completions API with strict "return raw JSON only"
 * prompts and parses the response into the same CourseOutline / LessonGenerationResult
 * shapes the rule-based engine produces, so controllers don't care which provider is active.
 *
 * Activate with:
 *   AI_PROVIDER=openai
 *   OPENAI_API_KEY=sk-...
 */
@Service
@ConditionalOnProperty(name = "ai.provider", havingValue = "openai")
public class OpenAiCourseGeneratorService implements AiCourseGeneratorService {

    private final WebClient webClient;
    private final ObjectMapper mapper = new ObjectMapper();
    private final String model;

    public OpenAiCourseGeneratorService(
            @Value("${ai.openai.api-key}") String apiKey,
            @Value("${ai.openai.base-url}") String baseUrl,
            @Value("${ai.openai.model}") String model) {
        this.model = model;
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Override
    public CourseOutline generateCourseOutline(String topic) {
        String system = "You are a curriculum designer. Given a topic, output a JSON object with keys: " +
                "title (string), description (string), tags (array of strings), modules (array of objects " +
                "with keys: title (string), lessonTitles (array of 3-5 strings)). Produce 3-6 modules that " +
                "progress from foundational to advanced. Return raw JSON only. No markdown, no code fences, " +
                "no explanatory text.";
        String user = "Topic: " + topic;

        String raw = chat(system, user);
        JsonNode node = parseJson(raw);

        List<CourseOutline.ModuleOutline> modules = new ArrayList<>();
        for (JsonNode m : node.path("modules")) {
            List<String> lessonTitles = new ArrayList<>();
            for (JsonNode l : m.path("lessonTitles")) lessonTitles.add(l.asText());
            modules.add(new CourseOutline.ModuleOutline(m.path("title").asText(), lessonTitles));
        }
        List<String> tags = new ArrayList<>();
        for (JsonNode t : node.path("tags")) tags.add(t.asText());

        return new CourseOutline(node.path("title").asText(topic), node.path("description").asText(""), tags, modules);
    }

    @Override
    public LessonGenerationResult generateLessonContent(String courseTitle, String moduleTitle, String lessonTitle) {
        String system = "You are a curriculum author. Given a course title, module title, and lesson title, " +
                "output a JSON object with keys: title (string), objectives (array of 2-4 strings), " +
                "content (array of block objects). Each block has a \"type\" field which is one of: " +
                "heading {text}, paragraph {text}, code {language, text} (only if genuinely relevant), " +
                "video {query} (a good YouTube search query, not a URL), " +
                "mcq {question, options (array of 3-4 strings), answer (0-based index), explanation}. " +
                "Include 4-5 mcq blocks at the end. Return raw JSON only. No markdown, no code fences, no extra text.";
        String user = "Course: " + courseTitle + "\nModule: " + moduleTitle + "\nLesson: " + lessonTitle;

        String raw = chat(system, user);
        JsonNode node = parseJson(raw);

        List<String> objectives = new ArrayList<>();
        for (JsonNode o : node.path("objectives")) objectives.add(o.asText());

        List<ContentBlock> content = new ArrayList<>();
        for (JsonNode b : node.path("content")) {
            ContentBlock block = new ContentBlock();
            block.setType(b.path("type").asText());
            if (b.has("text")) block.setText(b.path("text").asText());
            if (b.has("language")) block.setLanguage(b.path("language").asText());
            if (b.has("query")) block.setQuery(b.path("query").asText());
            if (b.has("question")) block.setQuestion(b.path("question").asText());
            if (b.has("options")) {
                List<String> opts = new ArrayList<>();
                for (JsonNode opt : b.path("options")) opts.add(opt.asText());
                block.setOptions(opts);
            }
            if (b.has("answer")) block.setAnswer(b.path("answer").asInt());
            if (b.has("explanation")) block.setExplanation(b.path("explanation").asText());
            content.add(block);
        }

        return new LessonGenerationResult(node.path("title").asText(lessonTitle), objectives, content);
    }

    private String chat(String system, String user) {
        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", system),
                        Map.of("role", "user", "content", user)
                ),
                "temperature", 0.7
        );

        JsonNode response = webClient.post()
                .uri("/chat/completions")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response == null) {
            throw new IllegalStateException("Empty response from OpenAI");
        }
        return response.path("choices").get(0).path("message").path("content").asText();
    }

    private JsonNode parseJson(String raw) {
        // Defensive: strip markdown code fences if the model adds them despite instructions
        String cleaned = raw.trim()
                .replaceAll("^```(json)?", "")
                .replaceAll("```$", "")
                .trim();
        try {
            return mapper.readTree(cleaned);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to parse AI response as JSON: " + e.getMessage(), e);
        }
    }
}
