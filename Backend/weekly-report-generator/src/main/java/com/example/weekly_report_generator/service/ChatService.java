package com.example.weekly_report_generator.service;

import com.example.weekly_report_generator.dto.response.ChatResponse;

public interface ChatService {
    ChatResponse ask(String question);
}
