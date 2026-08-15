package com.diegovilla.task_manager.core.annotations.atleastonefield;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

/**
 * Validator for the {@link AtLeastOneField} constraint annotation.
 *
 * <p>Inspects the declared fields of the annotated object using a {@link BeanWrapper} and returns
 * {@code true} when at least one of the configured fields holds a non-{@code null}, non-blank
 * value.
 *
 * @since 1.0.0
 */
public class AtLeastOneFieldValidator implements ConstraintValidator<AtLeastOneField, Object> {

    private String[] fields;

    /**
     * Extracts the field names declared in the annotation.
     *
     * @param annotation constraint annotation instance.
     */
    @Override
    public void initialize(AtLeastOneField annotation) {
        this.fields = annotation.fields();
    }

    /**
     * Validates that at least one of the specified fields is present.
     *
     * <p>{@code null} objects are considered valid to allow composition with other constraints such
     * as {@code @NotNull}.
     *
     * @param value the object to validate.
     * @param context contextual data and operation when applying the constraint.
     * @return {@code true} if at least one field contains a value; {@code false} otherwise.
     * @throws IllegalArgumentException if a declared field does not exist on the target object.
     */
    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {

        if (value == null) {
            return true;
        }

        BeanWrapper wrapper = new BeanWrapperImpl(value);

        for (String field : fields) {

            if (!wrapper.isReadableProperty(field)) {
                throw new IllegalArgumentException("Unknown field: " + field);
            }

            Object fieldValue = wrapper.getPropertyValue(field);

            if (fieldValue instanceof String stringValue) {
                if (!stringValue.isBlank()) {
                    return true;
                }
            } else if (fieldValue != null) {
                return true;
            }
        }

        return false;
    }
}
