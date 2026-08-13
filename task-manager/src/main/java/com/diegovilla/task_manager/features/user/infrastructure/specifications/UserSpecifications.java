package com.diegovilla.task_manager.features.user.infrastructure.specifications;

import com.diegovilla.task_manager.features.user.application.commands.UserFiltersCommand;
import com.diegovilla.task_manager.features.user.infrastructure.dto.request.UserFiltersDTO;
import com.diegovilla.task_manager.features.user.infrastructure.entity.UserEntity;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class UserSpecifications {

  public static Specification<UserEntity> withFilters(UserFiltersCommand filters) {
    return (root, query, criteriaBuilder) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (filters == null) {
        return criteriaBuilder.conjunction();
      }

      if (StringUtils.hasText(filters.search())) {
        String searchPattern = "%" + filters.search().toLowerCase() + "%";
        Predicate idMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("id")), searchPattern);
        Predicate nameMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern);
        Predicate lastnameMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("lastname")), searchPattern);
        Predicate emailMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern);
        predicates.add(criteriaBuilder.or(idMatch, nameMatch, lastnameMatch, emailMatch));
      }

      if (filters.userId() != null) {
        predicates.add(criteriaBuilder.equal(root.get("id"), filters.userId()));
      }

      return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    };
  }
}
