package com.example.weekly_report_generator.repository.spec;

import com.example.weekly_report_generator.entity.Report;
import com.example.weekly_report_generator.entity.ReportVersion;
import com.example.weekly_report_generator.enums.ReportStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

public class ReportSpecifications {

    public static Specification<Report> withFilters(
            Long userId, Long projectId, LocalDate weekStart, LocalDate weekEnd, ReportStatus status) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (userId != null) {
                predicates.add(cb.equal(root.get("user").get("id"), userId));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (weekStart != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("weekStartDate"), weekStart));
            }

            if (weekEnd != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("weekEndDate"), weekEnd));
            }

            if (projectId != null) {
                Join<Report, ReportVersion> versionJoin = root.join("versions", JoinType.INNER);
                predicates.add(cb.equal(versionJoin.get("project").get("id"), projectId));
            }

            query.distinct(true);

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
