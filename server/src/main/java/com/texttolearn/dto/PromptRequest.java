package com.texttolearn.dto;

import jakarta.validation.constraints.NotBlank;

public class PromptRequest {

    @NotBlank(message = "topic must not be blank")
    private String topic;

    public PromptRequest() {}
    public PromptRequest(String topic) { this.topic = topic; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
}
