package com.diegovilla.task_manager.features.user.infrastructure.exceptions;

import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import com.diegovilla.task_manager.core.errors.translators.DatabaseExceptionResolver;
import com.diegovilla.task_manager.features.user.domain.exceptions.UserAlreadyExistsException;
import com.diegovilla.task_manager.features.user.domain.exceptions.UserHasAssociatedTasksException;
import org.springframework.stereotype.Component;

/**
 * Infrastructure database exception resolver for user-related relational constraints.
 *
 * <p>Translates database unique key violations (e.g. duplicate email) and foreign key constraint
 * failures (e.g. deleting user with associated tasks) into domain exceptions.
 *
 * @since 1.0.0
 */
@Component
public class UserDatabaseExceptionResolver implements DatabaseExceptionResolver {
    private static final String UK_USERS_EMAIL = "uk_users_email";
    private static final String FK_TASKS_USER = "fk6s1ob9k4ihi75xbxe2w0ylsdh";

    /** {@inheritDoc} */
    @Override
    public ApiException resolve(String constraintName) {
        if (constraintName == null) {
            return null;
        }

        String lowerConstraint = constraintName.toLowerCase();
        if (lowerConstraint.contains(UK_USERS_EMAIL)) {
            return new UserAlreadyExistsException();
        }

        if (lowerConstraint.contains(FK_TASKS_USER)) {
            return new UserHasAssociatedTasksException();
        }

        return null;
    }
}
