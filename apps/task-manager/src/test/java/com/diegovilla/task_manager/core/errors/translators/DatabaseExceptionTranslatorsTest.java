package com.diegovilla.task_manager.core.errors.translators;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import com.diegovilla.task_manager.features.task.domain.exceptions.TaskAlreadyExistsException;
import com.diegovilla.task_manager.features.task.infrastructure.exceptions.TaskDatabaseExceptionResolver;
import com.diegovilla.task_manager.features.user.domain.exceptions.UserAlreadyExistsException;
import com.diegovilla.task_manager.features.user.domain.exceptions.UserHasAssociatedTasksException;
import com.diegovilla.task_manager.features.user.infrastructure.exceptions.UserDatabaseExceptionResolver;
import java.sql.SQLException;
import java.util.List;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;

class DatabaseExceptionTranslatorsTest {

    private UserDatabaseExceptionResolver userResolver;
    private TaskDatabaseExceptionResolver taskResolver;
    private DatabaseExceptionTranslator translator;

    @BeforeEach
    void setUp() {
        userResolver = new UserDatabaseExceptionResolver();
        taskResolver = new TaskDatabaseExceptionResolver();
        translator = new DatabaseExceptionTranslator(List.of(userResolver, taskResolver));
    }

    @Test
    @DisplayName("UserDatabaseExceptionResolver: should resolve unique email and fk constraint")
    void testUserDatabaseExceptionResolver() {
        assertThat(userResolver.resolve(null)).isNull();
        assertThat(userResolver.resolve("unknown_constraint")).isNull();

        ApiException emailException = userResolver.resolve("UK_USERS_EMAIL");
        assertThat(emailException).isInstanceOf(UserAlreadyExistsException.class);

        ApiException fkException = userResolver.resolve("fk6s1ob9k4ihi75xbxe2w0ylsdh");
        assertThat(fkException).isInstanceOf(UserHasAssociatedTasksException.class);
    }

    @Test
    @DisplayName("TaskDatabaseExceptionResolver: should resolve unique title constraint")
    void testTaskDatabaseExceptionResolver() {
        assertThat(taskResolver.resolve(null)).isNull();
        assertThat(taskResolver.resolve("other_constraint")).isNull();

        ApiException titleException = taskResolver.resolve("UK_TASKS_TITLE");
        assertThat(titleException).isInstanceOf(TaskAlreadyExistsException.class);
    }

    @Test
    @DisplayName("DatabaseExceptionTranslator: should translate known constraint to ApiException")
    void testTranslatorWithKnownConstraint() {
        ConstraintViolationException cve =
                new ConstraintViolationException("duplicate", new SQLException(), "uk_users_email");
        DataIntegrityViolationException dive =
                new DataIntegrityViolationException("integrity violation", cve);

        ApiException result = translator.translate(dive);

        assertThat(result).isInstanceOf(UserAlreadyExistsException.class);
    }

    @Test
    @DisplayName("DatabaseExceptionTranslator: should throw original exception when unresolvable")
    void testTranslatorWithUnknownConstraint() {
        ConstraintViolationException cve =
                new ConstraintViolationException(
                        "duplicate", new SQLException(), "unknown_constraint");
        DataIntegrityViolationException dive =
                new DataIntegrityViolationException("integrity violation", cve);

        assertThatThrownBy(() -> translator.translate(dive)).isSameAs(dive);
    }

    @Test
    @DisplayName(
            "DatabaseExceptionTranslator: should throw original exception when cause is not CVE")
    void testTranslatorWithNonCveCause() {
        DataIntegrityViolationException dive =
                new DataIntegrityViolationException("integrity violation", new RuntimeException());

        assertThatThrownBy(() -> translator.translate(dive)).isSameAs(dive);
    }
}
