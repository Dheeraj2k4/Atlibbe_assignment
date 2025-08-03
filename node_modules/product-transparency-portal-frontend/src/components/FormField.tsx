import React from 'react';
import styled from 'styled-components';
import { Field, ErrorMessage, useField } from 'formik';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  as?: string;
  options?: { value: string; label: string }[];
  tooltip?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Required = styled.span`
  color: ${({ theme }) => theme.colors.error};
  margin-left: 0.25rem;
`;

const TooltipIcon = styled.div`
  position: relative;
  margin-left: 0.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightText};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  cursor: help;

  &:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipText = styled.div`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.text};
  color: white;
  text-align: center;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  width: 200px;
  z-index: 1;
  transition: opacity ${({ theme }) => theme.transitions.default};
  font-weight: normal;
  font-size: 0.875rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.text} transparent transparent transparent;
  }
`;

const StyledInput = styled(Field)`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  font-size: 1rem;
  transition: border-color ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}40;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.lightBg};
    cursor: not-allowed;
  }
`;

const StyledTextarea = styled(StyledInput)`
  min-height: 100px;
  resize: vertical;
`;

const StyledSelect = styled.select`
  appearance: none;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  font-size: 1rem;
  transition: border-color ${({ theme }) => theme.transitions.default};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}40;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.lightBg};
    cursor: not-allowed;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const StyledCheckbox = styled.input`
  margin-right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
  user-select: none;
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const HelperText = styled.div`
  color: ${({ theme }) => theme.colors.lightText};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  as,
  options,
  tooltip,
  required = false,
  disabled = false,
  className,
}) => {
  const [field, meta] = useField(name);
  
  const renderField = () => {
    // Determine if this is an AI-generated question by checking if the name contains a question
    const isAIQuestion = name.includes('q_') || label.includes('?');
    
    // For AI-generated questions, use textarea by default for more detailed answers
    if (isAIQuestion && type === 'text') {
      return (
        <StyledTextarea
          as="textarea"
          id={name}
          name={name}
          placeholder={placeholder || 'Enter your answer here...'}
          disabled={disabled}
        />
      );
    }
    
    switch (type) {
      case 'textarea':
        return (
          <StyledTextarea
            as="textarea"
            id={name}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
          />
        );
      case 'select':
        return (
          <Field as={StyledSelect} id={name} name={name} disabled={disabled}>
            <option value="" disabled>Select an option</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field>
        );
      case 'checkbox':
        return (
          <CheckboxContainer>
            <StyledCheckbox
              type="checkbox"
              id={name}
              {...field}
              checked={field.value}
              disabled={disabled}
            />
            <CheckboxLabel htmlFor={name}>{label}</CheckboxLabel>
          </CheckboxContainer>
        );
      case 'radio':
        return (
          <div>
            {options?.map((option) => (
              <CheckboxContainer key={option.value}>
                <StyledCheckbox
                  type="radio"
                  id={`${name}-${option.value}`}
                  name={name}
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={disabled}
                />
                <CheckboxLabel htmlFor={`${name}-${option.value}`}>
                  {option.label}
                </CheckboxLabel>
              </CheckboxContainer>
            ))}
          </div>
        );
      default:
        return (
          <StyledInput
            type={type}
            id={name}
            name={name}
            placeholder={placeholder || 'Enter your answer...'}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <FormGroup className={className}>
      {type !== 'checkbox' && (
        <Label htmlFor={name}>
          {label}
          {required && <Required>*</Required>}
          {tooltip && (
            <TooltipIcon>
              ?
              <TooltipText className="tooltip-text">{tooltip}</TooltipText>
            </TooltipIcon>
          )}
        </Label>
      )}

      {renderField()}

      {meta.touched && meta.error ? (
        <ErrorText>
          <ErrorMessage name={name} />
        </ErrorText>
      ) : null}
    </FormGroup>
  );
};

export default FormField;