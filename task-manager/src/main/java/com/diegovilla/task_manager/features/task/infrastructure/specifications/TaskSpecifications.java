package com.diegovilla.task_manager.features.task.infrastructure.specifications;

import com.diegovilla.task_manager.features.task.application.commands.TaskFiltersCommand;
import com.diegovilla.task_manager.features.task.infrastructure.dto.request.TaskFiltersDTO;
import com.diegovilla.task_manager.features.task.infrastructure.entity.TaskEntity;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

/**
 * Utility adapter constructing Spring Data JPA {@link Specification} instances for task queries.
 *
 * <p>Translates {@link TaskFiltersDTO} query parameters into JPA Criteria API predicates and
 * optimizes entity fetching using JOIN FETCH to eliminate N+1 query overhead.
 *
 * @since 1.0.0
 */
public class TaskSpecifications {

    /**
     * Constructs a JPA specification matching the provided task filters.
     *
     * @param filters query filter criteria.
     * @return a {@link Specification} for querying {@link TaskEntity}.
     */
    public static Specification<TaskEntity> withFilters(TaskFiltersCommand filters) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. JOIN FETCH para traer el usuario en la misma consulta (Evita 1+N)
            if (Long.class
                    != query.getResultType()) { // Evita el fetch en el countQuery de paginación
                root.fetch("user");
            }

            if (filters == null) {
                return criteriaBuilder.conjunction();
            }

            // 2. Filtro de búsqueda global (ID, Título o Descripción)
            if (StringUtils.hasText(filters.search())) {
                String searchTerm = filters.search().trim();
                String searchPattern = "%" + searchTerm.toLowerCase() + "%";

                List<Predicate> searchPredicates = new ArrayList<>();

                // Búsqueda parcial por Título
                searchPredicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("title")), searchPattern));

                // Búsqueda parcial por Descripción
                searchPredicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("description")), searchPattern));

                // Búsqueda exacta por ID (solo si el string ingresado tiene formato válido de UUID)
                try {
                    UUID uuidSearch = UUID.fromString(searchTerm);
                    searchPredicates.add(criteriaBuilder.equal(root.get("id"), uuidSearch));
                } catch (IllegalArgumentException ignored) {
                    // Si el texto de búsqueda no es un UUID válido (ej. "comprar"), simplemente se
                    // omite este predicado
                }

                // Combinamos los criterios de búsqueda con un OR (Título OR Descripción OR ID)
                predicates.add(criteriaBuilder.or(searchPredicates.toArray(new Predicate[0])));
            }

            // 3. Filtro por Estado (Enum)
            if (filters.status() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filters.status()));
            }

            // 4. Filtro por Usuario (FK)
            if (filters.userId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("user").get("id"), filters.userId()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
