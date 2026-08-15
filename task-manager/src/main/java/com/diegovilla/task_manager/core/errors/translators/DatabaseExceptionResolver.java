package com.diegovilla.task_manager.core.errors.translators;

import com.diegovilla.task_manager.core.errors.exceptions.ApiException;

/**
 * Contract for translating database constraints into domain exceptions.
 *
 * <p>Each module implements this contract to register the constraints it handles.
 */
public interface DatabaseExceptionResolver {

    /**
     * Translates a database constraint into a domain exception.
     *
     * @param constraintName name of the constraint that triggered the error.
     * @return corresponding domain exception, or {@code null} if this resolver does not handle the
     *     constraint.
     */
    ApiException resolve(String constraintName);
}
