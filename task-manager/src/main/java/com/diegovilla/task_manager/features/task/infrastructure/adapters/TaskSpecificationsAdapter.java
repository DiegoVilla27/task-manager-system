package com.diegovilla.task_manager.features.task.infrastructure.adapters;

import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskFiltersDTO;
import com.diegovilla.task_manager.features.task.infrastructure.entity.TaskEntity;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Utility adapter constructing Spring Data JPA {@link Specification} instances for task queries.
 *
 * <p>Translates {@link TaskFiltersDTO} query parameters into JPA Criteria API predicates and
 * optimizes entity fetching using JOIN FETCH to eliminate N+1 query overhead.</p>
 *
 * @since 1.0.0
 */
public class TaskSpecificationsAdapter {

  /**
   * Constructs a JPA specification matching the provided task filters.
   *
   * @param filters query filter criteria.
   * @return a {@link Specification} for querying {@link TaskEntity}.
   */
  public static Specification<TaskEntity> withFilters(TaskFiltersDTO filters) {
    return (root, query, criteriaBuilder) -> {
      List<Predicate> predicates = new ArrayList<>();

      // 1. JOIN FETCH para traer el usuario en la misma consulta (Evita 1+N)
      if (Long.class != query.getResultType()) { // Evita el fetch en el countQuery de paginación
        root.fetch("user");
      }

      if (filters == null) {
        return criteriaBuilder.conjunction();
      }

      // 2. Filtro de búsqueda por texto en Título o Descripción (LIKE %search%)
      if (StringUtils.hasText(filters.search())) {
        String searchPattern = "%" + filters.search().toLowerCase() + "%";
        Predicate titleMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern);
        Predicate descMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern);
        predicates.add(criteriaBuilder.or(titleMatch, descMatch));
      }

      // 3. Filtro por Estado (Enum)
      if (filters.status() != null) {
        predicates.add(criteriaBuilder.equal(root.get("status"), filters.status()));
      }

      // 4. Filtro por Usuario (FK)
      if (filters.userId() != null) {
        predicates.add(criteriaBuilder.equal(root.get("user").get("id"), filters.userId()));
      }

      // 5. Filtro por Rango de Fechas
//      if (filters.createdFrom() != null) {
//        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), filters.createdFrom()));
//      }
//      if (filters.createdTo() != null) {
//        predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), filters.createdTo()));
//      }

      return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    };
  }
}
