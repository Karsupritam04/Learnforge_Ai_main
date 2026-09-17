package com.texttolearn.service;

import com.texttolearn.dto.CourseOutline;
import com.texttolearn.dto.LessonGenerationResult;
import com.texttolearn.model.ContentBlock;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Default generator: a deterministic, rule-based "template engine" that turns any topic string
 * into a well-formed course outline and lesson content, with no external API dependency.
 * Active whenever ai.provider=rule-based (the default). Swap to ai.provider=openai once you
 * add an OPENAI_API_KEY to use OpenAiCourseGeneratorService instead.
 */
@Service
@ConditionalOnProperty(name = "ai.provider", havingValue = "rule-based", matchIfMissing = true)
public class RuleBasedCourseGeneratorService implements AiCourseGeneratorService {

    private static final List<String> MODULE_STAGES = Arrays.asList(
            "Foundations of %s",
            "Core Concepts in %s",
            "Practical %s",
            "Intermediate %s Techniques",
            "%s in the Real World",
            "Advanced %s"
    );

    private static final List<String> LESSON_ANGLES = Arrays.asList(
            "What is %s?",
            "Key Terminology in %s",
            "How %s Works",
            "Common Patterns in %s",
            "Hands-on with %s",
            "Pitfalls to Avoid in %s"
    );

    @Override
    public CourseOutline generateCourseOutline(String topic) {
        String clean = topic.trim();
        String title = capitalize(clean);

        String description = String.format(
                "A structured, self-paced course covering %s from first principles through to " +
                "practical application, designed to take a motivated beginner to a confident practitioner.",
                clean);

        List<String> tags = Arrays.asList(clean.toLowerCase().split("\\s+"));

        // 4 modules by default (spec allows 3-6)
        int moduleCount = 4;
        List<CourseOutline.ModuleOutline> modules = new ArrayList<>();
        for (int m = 0; m < moduleCount; m++) {
            String moduleTitle = String.format(MODULE_STAGES.get(m % MODULE_STAGES.size()), title);

            // 4 lessons per module by default (spec allows 3-5)
            List<String> lessonTitles = new ArrayList<>();
            int lessonCount = 4;
            for (int l = 0; l < lessonCount; l++) {
                String angle = LESSON_ANGLES.get((m * lessonCount + l) % LESSON_ANGLES.size());
                lessonTitles.add(String.format(angle, moduleTitle));
            }
            modules.add(new CourseOutline.ModuleOutline(moduleTitle, lessonTitles));
        }

        return new CourseOutline(title, description, tags, modules);
    }

    @Override
    public LessonGenerationResult generateLessonContent(String courseTitle, String moduleTitle, String lessonTitle) {
        List<String> objectives = Arrays.asList(
                "Understand the core idea behind \"" + lessonTitle + "\"",
                "Identify how this fits within \"" + moduleTitle + "\"",
                "Apply the concept through a worked example"
        );

        List<ContentBlock> content = new ArrayList<>();
        content.add(ContentBlock.heading(lessonTitle));
        content.add(ContentBlock.paragraph(
                "This lesson is part of \"" + moduleTitle + "\" in the course \"" + courseTitle + "\". " +
                "It introduces the essential ideas behind \"" + lessonTitle + "\", building on prior lessons " +
                "and preparing you for what comes next."));

        content.add(ContentBlock.heading("Key Points"));
        content.add(ContentBlock.paragraph(
                "Focus on the definitions, the reasoning behind them, and one concrete example you could " +
                "explain back to someone else. Concepts in \"" + lessonTitle + "\" build directly on the " +
                "fundamentals covered earlier in \"" + moduleTitle + "\"."));

        content.add(ContentBlock.code("text",
                "// Example placeholder related to: " + lessonTitle + "\n" +
                "// Replace ai.provider=openai (or another provider) to generate real, topic-specific code."));

        content.add(ContentBlock.video(lessonTitle + " explained"));

        content.add(ContentBlock.mcq(
                "What is the main focus of \"" + lessonTitle + "\"?",
                Arrays.asList(
                        "An unrelated topic",
                        "The core idea introduced in this lesson",
                        "A future module's content",
                        "None of the above"),
                1,
                "This lesson is specifically about \"" + lessonTitle + "\", so option 2 is correct."));

        content.add(ContentBlock.mcq(
                "Which module does this lesson belong to?",
                Arrays.asList(moduleTitle, "A different module", "No module", "All modules"),
                0,
                "The lesson belongs to \"" + moduleTitle + "\"."));

        content.add(ContentBlock.mcq(
                "True or False: understanding this lesson helps with later lessons in the module.",
                Arrays.asList("True", "False"),
                0,
                "Lessons are sequenced so each one builds on the last."));

        content.add(ContentBlock.mcq(
                "What should you do after finishing this lesson?",
                Arrays.asList(
                        "Skip ahead without reviewing",
                        "Review the objectives and attempt the example yourself",
                        "Ignore the MCQs",
                        "Nothing"),
                1,
                "Reviewing objectives and practicing reinforces retention."));

        return new LessonGenerationResult(lessonTitle, objectives, content);
    }

    private String capitalize(String s) {
        if (s.isEmpty()) return s;
        String[] words = s.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String w : words) {
            if (w.isEmpty()) continue;
            sb.append(Character.toUpperCase(w.charAt(0))).append(w.substring(1)).append(" ");
        }
        return sb.toString().trim();
    }
}
