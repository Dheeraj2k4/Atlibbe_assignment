import React, { ButtonHTMLAttributes, ElementType, ComponentPropsWithoutRef } from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

type PolymorphicRef<C extends ElementType> = React.ComponentPropsWithRef<C>['ref'];

type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  as?: ElementType;
}

const getButtonStyles = (variant: ButtonVariant, theme: any) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${theme.colors.primary};
        color: white;
        border: 2px solid ${theme.colors.primary};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary}e6;
          border-color: ${theme.colors.primary}e6;
        }
      `;
    case 'secondary':
      return css`
        background-color: ${theme.colors.secondary};
        color: white;
        border: 2px solid ${theme.colors.secondary};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.secondary}e6;
          border-color: ${theme.colors.secondary}e6;
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary};
        border: 2px solid ${theme.colors.primary};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary}1a;
        }
      `;
    case 'text':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary};
        border: 2px solid transparent;
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary}1a;
        }
      `;
    default:
      return css``;
  }
};

const getButtonSize = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return css`
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      `;
    case 'medium':
      return css`
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      `;
    case 'large':
      return css`
        padding: 1rem 2rem;
        font-size: 1.125rem;
      `;
    default:
      return css``;
  }
};

const StyledButton = styled.button.attrs<ButtonProps>(({ as }) => ({
  as: as || 'button',
}))<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  transition: all ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  
  ${({ variant = 'primary', theme }) => getButtonStyles(variant, theme)}
  ${({ size = 'medium' }) => getButtonSize(size)}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme, variant = 'primary' }) => 
      variant === 'text' ? `${theme.colors.primary}40` : `${theme.colors.primary}40`};
  }
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button = <C extends ElementType = 'button'>(
  {
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    isLoading = false,
    icon,
    iconPosition = 'left',
    disabled,
    as,
    ...props
  }: PolymorphicComponentProp<C, ButtonProps>
) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && icon && iconPosition === 'left' && icon}
      {children}
      {!isLoading && icon && iconPosition === 'right' && icon}
    </StyledButton>
  );
};

export default Button;