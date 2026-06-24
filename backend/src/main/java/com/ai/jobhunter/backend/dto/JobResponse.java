package com.ai.jobhunter.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class JobResponse {

    // This matches the JSON structure JSearch API returns
    private String status;
    private List<JobData> data;

    @Data
    public static class JobData {
        private String job_id;
        private String job_title;
        private String employer_name;
        private String job_description;
        private String job_city;
        private String job_country;
        private String job_apply_link;
        private String[] job_required_skills;
        private String job_posted_at_datetime_utc;
    }
}
