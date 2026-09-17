package com.texttolearn.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
 * Flexible content block used inside Lesson.content.
 * type drives which fields are relevant:
 *   heading   -> text
 *   paragraph -> text
 *   code      -> language, text
 *   video     -> query (a YouTube search query the frontend resolves via /api/youtube)
 *   mcq       -> question, options, answer (index), explanation
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ContentBlock {

    private String type;      // heading | paragraph | code | video | mcq
    private String text;      // heading / paragraph / code text
    private String language;  // for code blocks
    private String query;     // for video blocks (YouTube search query)
    private String question;  // for mcq blocks
    private List<String> options; // for mcq blocks
    private Integer answer;   // index into options, for mcq blocks
    private String explanation; // for mcq blocks

    public ContentBlock() {}

    public static ContentBlock heading(String text) {
        ContentBlock b = new ContentBlock();
        b.type = "heading";
        b.text = text;
        return b;
    }

    public static ContentBlock paragraph(String text) {
        ContentBlock b = new ContentBlock();
        b.type = "paragraph";
        b.text = text;
        return b;
    }

    public static ContentBlock code(String language, String text) {
        ContentBlock b = new ContentBlock();
        b.type = "code";
        b.language = language;
        b.text = text;
        return b;
    }

    public static ContentBlock video(String query) {
        ContentBlock b = new ContentBlock();
        b.type = "video";
        b.query = query;
        return b;
    }

    public static ContentBlock mcq(String question, List<String> options, int answer, String explanation) {
        ContentBlock b = new ContentBlock();
        b.type = "mcq";
        b.question = question;
        b.options = options;
        b.answer = answer;
        b.explanation = explanation;
        return b;
    }

    // --- getters / setters ---
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    public Integer getAnswer() { return answer; }
    public void setAnswer(Integer answer) { this.answer = answer; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
