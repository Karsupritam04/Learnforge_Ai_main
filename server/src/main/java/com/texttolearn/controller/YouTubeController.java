package com.texttolearn.controller;

import com.texttolearn.service.YouTubeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Milestone 9: resolves a lesson's video search query into embeddable YouTube results. */
@RestController
public class YouTubeController {

    private final YouTubeService youTubeService;

    public YouTubeController(YouTubeService youTubeService) {
        this.youTubeService = youTubeService;
    }

    @GetMapping("/api/youtube")
    public List<YouTubeService.VideoResult> search(@RequestParam String query,
                                                     @RequestParam(defaultValue = "1") int maxResults) {
        return youTubeService.search(query, maxResults);
    }
}
