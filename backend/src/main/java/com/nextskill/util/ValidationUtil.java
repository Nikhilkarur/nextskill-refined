package com.nextskill.util;

import java.util.Set;

public final class ValidationUtil {
    private ValidationUtil() {}

    public static final String ROLE_SOFTWARE = "software-engineer";
    public static final String ROLE_DS = "data-scientist";
    public static final String ROLE_DE = "data-engineer";
    public static final String ROLE_DEVOPS = "devops-engineer";
    public static final String ROLE_PM = "product-manager";
    public static final String ROLE_UX = "ux-designer";

    public static final String EXP_JUNIOR = "junior";
    public static final String EXP_MID = "mid";
    public static final String EXP_SENIOR = "senior";

    public static final String PRI_SKILLS = "skills";
    public static final String PRI_PROJECTS = "projects";

    public static final String TIME_PART = "part-time";
    public static final String TIME_FULL = "full-time";

    private static final Set<String> ROLES = Set.of(
        ROLE_SOFTWARE, ROLE_DS, ROLE_DE, ROLE_DEVOPS, ROLE_PM, ROLE_UX
    );
    private static final Set<String> EXPERIENCES = Set.of(EXP_JUNIOR, EXP_MID, EXP_SENIOR);
    private static final Set<String> PRIORITIES = Set.of(PRI_SKILLS, PRI_PROJECTS);
    private static final Set<String> TIMES = Set.of(TIME_PART, TIME_FULL);

    public static String normalizeRole(String in) {
        if (in == null) return ROLE_SOFTWARE;
        String v = in.toLowerCase();
        return ROLES.contains(v) ? v : ROLE_SOFTWARE;
    }
    public static String normalizeExperience(String in) {
        if (in == null) return EXP_JUNIOR;
        String v = in.toLowerCase();
        return EXPERIENCES.contains(v) ? v : EXP_JUNIOR;
    }
    public static String normalizePriority(String in) {
        if (in == null) return PRI_SKILLS;
        String v = in.toLowerCase();
        return PRIORITIES.contains(v) ? v : PRI_SKILLS;
    }
    public static String normalizeTime(String in) {
        if (in == null) return TIME_PART;
        String v = in.toLowerCase();
        return TIMES.contains(v) ? v : TIME_PART;
    }

    public static boolean isAllowedResumeContentType(String ct) {
        if (ct == null) return false;
        String v = ct.toLowerCase();
        return v.equals("application/pdf")
                || v.equals("application/msword")
                || v.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                || v.equals("text/plain");
    }
}
