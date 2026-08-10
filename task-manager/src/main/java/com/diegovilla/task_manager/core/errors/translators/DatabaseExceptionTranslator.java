package com.diegovilla.task_manager.core.errors.translators;

import com.diegovilla.task_manager.core.errors.exceptions.ApiException;
import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Translates database integrity exceptions into domain exceptions.
 *
 * <p>Iterates through all registered resolvers in the application
 * until finding one capable of translating the constraint that caused the error.</p>
 */
@Component
@RequiredArgsConstructor
public class DatabaseExceptionTranslator {

  private final List<DatabaseExceptionResolver> resolvers;

  /**
   * Translates a Spring Data exception into a domain exception.
   *
   * @param ex exception thrown during a persistence operation.
   * @return equivalent domain exception.
   */
  public ApiException translate(DataIntegrityViolationException ex) {

    Throwable cause = ex.getCause();

    if (cause instanceof ConstraintViolationException cve) {
      String constraint = cve.getConstraintName();

      for (DatabaseExceptionResolver resolver : resolvers) {
        ApiException apiException = resolver.resolve(constraint);

        if (apiException != null) {
          return apiException;
        }
      }
    }

    throw ex;
  }
}
