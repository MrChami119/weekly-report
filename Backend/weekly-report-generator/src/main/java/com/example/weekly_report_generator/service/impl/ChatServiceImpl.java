package com.example.weekly_report_generator.service.impl;

import com.example.weekly_report_generator.dto.response.ChatResponse;
import com.example.weekly_report_generator.entity.Report;
import com.example.weekly_report_generator.entity.ReportVersion;
import com.example.weekly_report_generator.repository.ReportRepository;
import com.example.weekly_report_generator.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ReportRepository reportRepository;
    private final RestClient restClient = RestClient.create();

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    @Value("${gemini.api-url}")
    private String apiUrl;

    @Override
    public ChatResponse ask(String question) {
        LocalDate lastWeekStart = LocalDate.now().minusWeeks(1).with(DayOfWeek.MONDAY);
        List<Report> recentReports = reportRepository.findAllForWeek(lastWeekStart);

        String context = buildContext(recentReports);
        String answer = callGemini(context, question);

        return new ChatResponse(answer);
    }

    private String buildContext(List<Report> reports) {
        StringBuilder sb = new StringBuilder();
        for (Report r : reports) {
            ReportVersion v = r.getCurrentVersion();
            if (v == null) continue;

            sb.append("Team member: ").append(r.getUser().getFullName()).append("\n");
            sb.append("Project: ").append(v.getProject() != null ? v.getProject().getName() : "N/A").append("\n");
            sb.append("Status: ").append(r.getStatus()).append("\n");

            sb.append("Tasks: ");
            v.getTaskEntries().forEach(t ->
                    sb.append(t.getTaskName()).append(" (").append(t.getStatus()).append(") "));
            sb.append("\n");

            sb.append("Blockers: ");
            v.getBlockers().forEach(b -> sb.append(b.getDescription()).append("; "));
            sb.append("\n");

            sb.append("Achievements: ");
            v.getAchievements().forEach(a -> sb.append(a.getDescription()).append("; "));
            sb.append("\n---\n");
        }
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private String callGemini(String context, String question) {
        String prompt = """
                You are an assistant helping an engineering manager understand their team's weekly reports.
                Answer ONLY using the report data provided below. If the data doesn't contain the answer, say so.
                Be concise and specific — mention team member names when relevant. Do not invent information.

                TEAM REPORT DATA:
                %s

                MANAGER'S QUESTION:
                %s
                """.formatted(context, question);

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        String url = apiUrl + "/" + model + ":generateContent?key=" + apiKey;

        Map<String, Object> response = restClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .body(body)
                .retrieve()
                .body(Map.class);

        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        return (String) parts.get(0).get("text");
    }
}
