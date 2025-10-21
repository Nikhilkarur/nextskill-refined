package com.nextskill.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class LearningPathMLService {

    private static final String YT_FREECODECAMP = "https://www.youtube.com/@freecodecamp";
    private static final String EXP_JUNIOR = "junior";
    private static final String EXP_MID = "mid";
    private static final String EXP_SENIOR = "senior";
    private static final String ROLE_DEVOPS = "devops-engineer";
    private static final String ROLE_DS = "data-scientist";
    private static final String PRI_PROJECTS = "projects";

    public String generate(String role, String experience, String priority, String timeCommitment) {
        int weeks = determineWeeks(experience, timeCommitment);
        List<Map<String, Object>> syllabus = new ArrayList<>();

    List<String> coreTopics = coreTopics(role, experience, priority);
        List<String> resources = resourceLinks(role);

        for (int w = 1; w <= weeks; w++) {
            Map<String, Object> week = new LinkedHashMap<>();
            week.put("week", w);
            String topic = coreTopics.get((w - 1) % coreTopics.size());
            week.put("topic", topic);

            Map<String, Object> content = new LinkedHashMap<>();
            content.put("videos", pick(resources, 2));
        content.put("reading", Arrays.asList(
            "https://developer.mozilla.org/",
            "https://www.geeksforgeeks.org/"
        ));
            content.put("assignment", defaultAssignment(role, topic, experience));
            week.put("content", content);
            syllabus.add(week);
        }

        Map<String, Object> root = new LinkedHashMap<>();
        root.put("role", role);
        root.put("experience", experience);
        root.put("priority", priority);
        root.put("timeCommitment", timeCommitment);
        root.put("weeks", weeks);
        root.put("syllabus", syllabus);

        return toJson(root);
    }

    // Overload: accepts signals from resume text and questionnaire answers
    public String generateWithSignals(String role, String experience, String priority, String timeCommitment,
                                      String resumeText, Map<String, String> answers) {
        role = applyResumeSignalsForRole(role, resumeText);
        priority = applyResumeSignalsForPriority(priority, resumeText);
        priority = applyAnswerSignalsForPriority(priority, answers);
        return generate(role, experience, priority, timeCommitment);
    }

    private String applyResumeSignalsForRole(String role, String resumeText) {
        if (resumeText == null || resumeText.isBlank()) return role;
        String t = resumeText.toLowerCase(Locale.ROOT);
        boolean devops = t.contains("kubernetes") || t.contains("docker") || t.contains("terraform");
        boolean ds = t.contains("pandas") || t.contains("sklearn") || t.contains("numpy");
        if ((role == null || role.isBlank()) && devops) return ROLE_DEVOPS;
        if ((role == null || role.isBlank()) && ds) return ROLE_DS;
        return role;
    }

    private String applyResumeSignalsForPriority(String priority, String resumeText) {
        if (resumeText == null || resumeText.isBlank()) return priority;
        String t = resumeText.toLowerCase(Locale.ROOT);
        boolean devops = t.contains("kubernetes") || t.contains("docker") || t.contains("terraform");
        if ((priority == null || priority.isBlank()) && devops) return PRI_PROJECTS;
        return priority;
    }

    private String applyAnswerSignalsForPriority(String priority, Map<String, String> answers) {
        if (answers == null || answers.isEmpty()) return priority;
        String f = answers.get("focus");
        if (f != null && PRI_PROJECTS.equalsIgnoreCase(f)) return PRI_PROJECTS;
        return priority;
    }

    private int determineWeeks(String experience, String timeCommitment) {
        int base;
        String exp = experience == null ? "" : experience.toLowerCase(Locale.ROOT);
        switch (exp) {
            case EXP_JUNIOR:
                base = 8;
                break;
            case EXP_MID:
                base = 10;
                break;
            case EXP_SENIOR:
                base = 12;
                break;
            default:
                base = 8;
        }
        boolean fullTime = (timeCommitment != null && timeCommitment.equalsIgnoreCase("full-time"));
        return fullTime ? base + 2 : base;
    }

    private List<String> coreTopics(String role, String experience, String priority) {
        String r = role == null ? "software-engineer" : role.toLowerCase(Locale.ROOT);
    List<String> topics;
    switch (r) {
            case ROLE_DS:
        topics = Arrays.asList(
            "Python for Data Science", "Statistics & Probability", "Pandas & NumPy",
            "Data Visualization", "Machine Learning Basics", "Model Evaluation",
            "Feature Engineering", "ML Pipelines", "Deep Learning Intro", "Deployment Basics"
        );
        break;
        case "data-engineer":
        topics = Arrays.asList(
            "Linux & Shell", "Python for ETL", "SQL Fundamentals",
            "Data Modeling", "Batch Processing (Spark)", "Streaming (Kafka)",
            "Data Warehousing", "Orchestration (Airflow)", "Cloud Storage", "Monitoring"
        );
        break;
            case ROLE_DEVOPS:
        topics = Arrays.asList(
            "Linux & Networking", "Git & CI/CD", "Containers (Docker)",
            "Orchestration (Kubernetes)", "Infrastructure as Code", "Cloud Fundamentals",
            "Monitoring & Logging", "Security Basics", "Scaling & HA", "Incident Response"
        );
        break;
        case "product-manager":
        topics = Arrays.asList(
            "Product Thinking", "User Research", "Roadmapping",
            "MVP & Experiments", "Analytics & Metrics", "Stakeholder Management",
            "Go-To-Market", "Pricing & Packaging", "Growth Loops", "Leadership"
        );
        break;
        case "ux-designer":
        topics = Arrays.asList(
            "Design Principles", "User Research", "Wireframing",
            "Prototyping", "Visual Design", "Design Systems",
            "Usability Testing", "Accessibility", "Handoff", "Portfolio"
        );
        break;
        default:
        topics = Arrays.asList(
            "Programming Fundamentals", "Data Structures", "Algorithms",
            "Version Control (Git)", "Web Basics", "Backend Basics",
            "APIs & REST", "Testing", "Security Basics", "Deployment"
        );
    }

        // If priority is "projects", emphasize project-oriented topics by rotating list
        if (priority != null && priority.equalsIgnoreCase(PRI_PROJECTS)) {
            topics = rotate(topics, 2);
        }
        // Lightly adjust based on experience: senior -> rotate further to advanced topics
        if (experience != null) {
            String exp = experience.toLowerCase(Locale.ROOT);
            if (EXP_SENIOR.equals(exp)) {
                topics = rotate(topics, 3);
            } else if (EXP_JUNIOR.equals(exp)) {
                topics = rotate(topics, 0); // no-op but marks param as used and keeps flow explicit
            }
        }
        return topics;
    }

    private List<String> resourceLinks(String role) {
    String r = role == null ? "software-engineer" : role.toLowerCase(Locale.ROOT);
    List<String> links;
    switch (r) {
            case ROLE_DS:
        links = Arrays.asList(
            YT_FREECODECAMP,
            "https://www.youtube.com/@krishnaik06",
            "https://www.youtube.com/@statquest"
        );
        break;
        case "data-engineer":
        links = Arrays.asList(
            "https://www.youtube.com/@DataEngineerOne",
            YT_FREECODECAMP,
            "https://www.youtube.com/@AlexTheAnalyst"
        );
        break;
            case ROLE_DEVOPS:
        links = Arrays.asList(
            "https://www.youtube.com/@TechWorldwithNana",
            YT_FREECODECAMP,
            "https://www.youtube.com/@kodekloud"
        );
        break;
        case "product-manager":
        links = Arrays.asList(
            "https://www.youtube.com/@PMExercises",
            "https://www.youtube.com/@LennyRachitsky",
            "https://www.youtube.com/@Slidebean"
        );
        break;
        case "ux-designer":
        links = Arrays.asList(
            "https://www.youtube.com/@DesignCourse",
            "https://www.youtube.com/@NNgroup",
            "https://www.youtube.com/@fluxwithranSegall"
        );
        break;
        default:
        links = Arrays.asList(
            "https://www.youtube.com/@WebDevSimplified",
            YT_FREECODECAMP,
            "https://www.youtube.com/@Fireship"
        );
    }
    return links;
    }

    private Map<String, Object> defaultAssignment(String role, String topic, String experience) {
        Map<String, Object> assignment = new LinkedHashMap<>();
        assignment.put("title", "Apply: " + topic);
        String exp = experience == null ? "" : experience.toLowerCase(Locale.ROOT);
        String difficulty;
        switch (exp) {
            case EXP_JUNIOR:
                difficulty = "easy";
                break;
            case EXP_MID:
                difficulty = "medium";
                break;
            case EXP_SENIOR:
                difficulty = "hard";
                break;
            default:
                difficulty = "medium";
        }
        assignment.put("difficulty", difficulty);
        assignment.put("description", "For role '" + (role == null ? "general" : role) + "': Build a small project or write a detailed summary demonstrating understanding of '" + topic + "'.");
        assignment.put("rubric", List.of("Completeness", "Correctness", "Clarity", "Performance/Security (if applicable)"));
        return assignment;
    }

    private <T> List<T> pick(List<T> list, int n) {
        if (list.isEmpty()) return List.of();
        List<T> out = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            out.add(list.get(i % list.size()));
        }
        return out;
    }

    private <T> List<T> rotate(List<T> list, int k) {
        if (list.isEmpty()) return list;
        int n = list.size();
        int shift = ((k % n) + n) % n;
        List<T> res = new ArrayList<>(n);
        res.addAll(list.subList(shift, n));
        res.addAll(list.subList(0, shift));
        return res;
    }

    private String toJson(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof String) return jsonString((String) obj);
        if (obj instanceof Number || obj instanceof Boolean) return String.valueOf(obj);
        if (obj instanceof Map) return jsonMap(obj);
        if (obj instanceof Collection) return jsonCollection((Collection<?>) obj);
        return jsonString(String.valueOf(obj));
    }

    private String jsonString(String s) {
        return '"' + s.replace("\\", "\\\\").replace("\"", "\\\"") + '"';
    }

    @SuppressWarnings("unchecked")
    private String jsonMap(Object obj) {
        Map<Object, Object> map = (Map<Object, Object>) obj;
        StringBuilder sb = new StringBuilder();
        sb.append('{');
        boolean first = true;
        for (Map.Entry<Object, Object> e : map.entrySet()) {
            if (!first) sb.append(',');
            first = false;
            sb.append(jsonString(String.valueOf(e.getKey())));
            sb.append(':');
            sb.append(toJson(e.getValue()));
        }
        sb.append('}');
        return sb.toString();
    }

    private String jsonCollection(Collection<?> col) {
        StringBuilder sb = new StringBuilder();
        sb.append('[');
        boolean first = true;
        for (Object o : col) {
            if (!first) sb.append(',');
            first = false;
            sb.append(toJson(o));
        }
        sb.append(']');
        return sb.toString();
    }
}
