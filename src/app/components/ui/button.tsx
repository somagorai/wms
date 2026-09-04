import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

export type ButtonTier =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive"
  | "error"
  | "warning"
  | "info"
  | "success";

// Backward-compatible alias
export type ButtonType = ButtonTier;

export type ButtonVisualVariant =
  | "filled"
  | "outlined"
  | "text"
  | "tonal"
  | "link"
  // Legacy shadcn aliases
  | "default"
  | "outline"
  | "ghost";

export type ButtonKind = "text" | "icon" | "text-icon";

export type ButtonSize =
  | "xs"
  | "sm"
  | "default"
  | "md"
  | "lg"
  | "xl"
  | "icon-xs"
  | "icon-sm"
  | "icon"
  | "icon-lg";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--use-primary,var(--primary))] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:bg-[var(--surface-container-high)] disabled:text-[var(--muted-foreground)] disabled:border-transparent disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      tier: {
        primary: "",
        secondary: "",
        tertiary: "",
        destructive: "",
        error: "",
        warning: "",
        info: "",
        success: "",
      },
      variant: {
        filled: "",
        outlined: "",
        text: "",
        tonal: "",
        link: "underline-offset-4 hover:underline p-0 h-auto bg-transparent border-0 shadow-none",
        // Legacy aliases
        default: "",
        outline: "",
        ghost: "",
      },
      size: {
        xs: "h-7 rounded-md gap-1 px-2.5 text-xs font-medium [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 rounded-lg gap-1.5 px-3 text-xs font-medium [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-9 rounded-lg px-4 py-2 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
        md: "h-9 rounded-lg px-4 py-2 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 rounded-lg px-6 text-base font-semibold gap-2.5 [&_svg:not([class*='size-'])]:size-5",
        xl: "h-12 rounded-xl px-7 text-base font-semibold gap-3 [&_svg:not([class*='size-'])]:size-5.5",
        "icon-xs": "size-7 p-0 rounded-md flex items-center justify-center [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 p-0 rounded-lg flex items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        icon: "size-9 p-0 rounded-lg flex items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-11 p-0 rounded-xl flex items-center justify-center [&_svg:not([class*='size-'])]:size-5",
      },
      kind: {
        text: "",
        icon: "aspect-square flex items-center justify-center p-0",
        "text-icon": "inline-flex items-center justify-center gap-2",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      // ── PRIMARY COMBINATIONS ──
      {
        tier: "primary",
        variant: ["filled", "default"],
        className:
          "bg-[var(--brand-primary,var(--primary))] text-[var(--brand-on-primary,var(--primary-foreground))] hover:opacity-90 active:opacity-95 border border-transparent shadow-xs data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--use-primary,var(--primary))] data-[selected=true]:ring-offset-1",
      },
      {
        tier: "primary",
        variant: ["outlined", "outline"],
        className:
          "border-2 border-[var(--use-primary,var(--primary))] bg-transparent text-[var(--use-primary,var(--primary))] hover:bg-[var(--use-primary,var(--primary))]/10 active:bg-[var(--use-primary,var(--primary))]/20 shadow-none data-[selected=true]:bg-[var(--brand-primary,var(--primary))] data-[selected=true]:text-[var(--brand-on-primary,var(--primary-foreground))]",
      },
      {
        tier: "primary",
        variant: ["text", "ghost"],
        className:
          "bg-transparent text-[var(--use-primary,var(--primary))] hover:bg-[var(--use-primary,var(--primary))]/10 active:bg-[var(--use-primary,var(--primary))]/20 border border-transparent data-[selected=true]:bg-[var(--use-primary,var(--primary))]/15 font-semibold",
      },
      {
        tier: "primary",
        variant: "tonal",
        className:
          "bg-[var(--brand-primary,var(--primary-container))] text-[var(--brand-on-primary,var(--on-primary-container))] hover:opacity-90 active:opacity-95 border border-transparent shadow-xs data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--use-primary,var(--primary))]",
      },
      {
        tier: "primary",
        variant: "link",
        className: "text-[var(--use-primary,var(--primary))] hover:underline",
      },

      // ── SECONDARY COMBINATIONS ──
      {
        tier: "secondary",
        variant: ["filled", "default"],
        className:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-90 active:opacity-95 border border-transparent shadow-xs data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--secondary)] data-[selected=true]:ring-offset-1",
      },
      {
        tier: "secondary",
        variant: ["outlined", "outline"],
        className:
          "border border-[var(--border)] bg-[var(--surface-container-low)] text-[var(--foreground)] hover:bg-[var(--surface-container-high)] hover:border-[var(--outline)] shadow-xs active:bg-[var(--surface-container-highest)] data-[selected=true]:border-[var(--use-primary,var(--primary))] data-[selected=true]:bg-[var(--surface-container-high)] data-[selected=true]:text-[var(--use-primary,var(--primary))]",
      },
      {
        tier: "secondary",
        variant: ["text", "ghost"],
        className:
          "bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-container-high)] border border-transparent active:bg-[var(--surface-container-highest)] data-[selected=true]:bg-[var(--surface-container-highest)] data-[selected=true]:text-[var(--use-primary,var(--primary))]",
      },
      {
        tier: "secondary",
        variant: "tonal",
        className:
          "bg-[var(--secondary-container)] text-[var(--on-secondary-container)] hover:opacity-90 active:opacity-95 border border-transparent shadow-xs data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--secondary)]",
      },

      // ── TERTIARY COMBINATIONS ──
      {
        tier: "tertiary",
        variant: ["filled", "default", "tonal"],
        className:
          "bg-[var(--surface-container-high)] text-[var(--foreground)] hover:bg-[var(--surface-container-highest)] active:bg-[var(--surface-container-highest)] border border-transparent data-[selected=true]:bg-[var(--surface-container-highest)] data-[selected=true]:text-[var(--use-primary,var(--primary))]",
      },
      {
        tier: "tertiary",
        variant: ["outlined", "outline"],
        className:
          "border border-[var(--border)] bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--outline)] active:bg-[var(--surface-container-low)] data-[selected=true]:border-[var(--use-primary,var(--primary))] data-[selected=true]:text-[var(--use-primary,var(--primary))]",
      },
      {
        tier: "tertiary",
        variant: ["text", "ghost"],
        className:
          "bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-container-high)] border border-transparent active:bg-[var(--surface-container-highest)] data-[selected=true]:bg-[var(--surface-container-highest)] data-[selected=true]:text-[var(--use-primary,var(--primary))]",
      },

      // ── DESTRUCTIVE / ERROR COMBINATIONS ──
      {
        tier: ["destructive", "error"],
        variant: ["filled", "default"],
        className:
          "bg-[var(--state-error)] text-[var(--state-error-foreground)] hover:opacity-90 active:opacity-95 border border-transparent shadow-xs data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--state-error)]",
      },
      {
        tier: ["destructive", "error"],
        variant: ["outlined", "outline"],
        className:
          "border-2 border-[var(--state-error)] bg-transparent text-[var(--state-error)] hover:bg-[var(--state-error)]/10 active:bg-[var(--state-error)]/20 shadow-none data-[selected=true]:bg-[var(--state-error)] data-[selected=true]:text-[var(--state-error-foreground)]",
      },
      {
        tier: ["destructive", "error"],
        variant: ["text", "ghost"],
        className:
          "bg-transparent text-[var(--state-error)] hover:bg-[var(--state-error)]/10 active:bg-[var(--state-error)]/20 border border-transparent data-[selected=true]:bg-[var(--state-error)]/15 font-semibold",
      },
      {
        tier: ["destructive", "error"],
        variant: "tonal",
        className:
          "bg-[var(--state-error-container)] text-[var(--state-on-error-container)] hover:opacity-90 active:opacity-95 border border-transparent shadow-xs data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--state-error)]",
      },

      // ── WARNING COMBINATIONS ──
      {
        tier: "warning",
        variant: ["filled", "default"],
        className:
          "bg-[var(--state-warning)] text-[var(--state-warning-foreground)] hover:opacity-90 active:opacity-95 border border-transparent shadow-xs data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--state-warning)]",
      },
      {
        tier: "warning",
        variant: ["outlined", "outline"],
        className:
          "border-2 border-[var(--state-warning)] bg-transparent text-[var(--state-warning)] hover:bg-[var(--state-warning)]/10 active:bg-[var(--state-warning)]/20 shadow-none data-[selected=true]:bg-[var(--state-warning)] data-[selected=true]:text-[var(--state-warning-foreground)]",
      },
      {
        tier: "warning",
        variant: ["text", "ghost"],
        className:
          "bg-transparent text-[var(--state-warning)] hover:bg-[var(--state-warning)]/10 active:bg-[var(--state-warning)]/20 border border-transparent data-[selected=true]:bg-[var(--state-warning)]/15 font-semibold",
      },
      {
        tier: "warning",
        variant: "tonal",
        className:
          "bg-[var(--state-warning-container)] text-[var(--state-on-warning-container)] hover:opacity-90 active:opacity-95 border border-transparent shadow-xs data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--state-warning)]",
      },

      // ── SUCCESS COMBINATIONS ──
      {
        tier: "success",
        variant: ["filled", "default"],
        className:
          "bg-[var(--state-success)] text-[var(--state-success-foreground)] hover:opacity-90 active:opacity-95 border border-transparent shadow-xs data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--state-success)]",
      },
      {
        tier: "success",
        variant: ["outlined", "outline"],
        className:
          "border-2 border-[var(--state-success)] bg-transparent text-[var(--state-success)] hover:bg-[var(--state-success)]/10 active:bg-[var(--state-success)]/20 shadow-none data-[selected=true]:bg-[var(--state-success)] data-[selected=true]:text-[var(--state-success-foreground)]",
      },
      {
        tier: "success",
        variant: ["text", "ghost"],
        className:
          "bg-transparent text-[var(--state-success)] hover:bg-[var(--state-success)]/10 active:bg-[var(--state-success)]/20 border border-transparent data-[selected=true]:bg-[var(--state-success)]/15 font-semibold",
      },
      {
        tier: "success",
        variant: "tonal",
        className:
          "bg-[var(--state-success-container)] text-[var(--state-on-success-container)] hover:opacity-90 active:opacity-95 border border-transparent shadow-xs data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--state-success)]",
      },

      // ── INFO COMBINATIONS ──
      {
        tier: "info",
        variant: ["filled", "default"],
        className:
          "bg-[var(--state-info)] text-[var(--state-info-foreground)] hover:opacity-90 active:opacity-95 border border-transparent shadow-xs data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--state-info)]",
      },
      {
        tier: "info",
        variant: ["outlined", "outline"],
        className:
          "border-2 border-[var(--state-info)] bg-transparent text-[var(--state-info)] hover:bg-[var(--state-info)]/10 active:bg-[var(--state-info)]/20 shadow-none data-[selected=true]:bg-[var(--state-info)] data-[selected=true]:text-[var(--state-info-foreground)]",
      },
      {
        tier: "info",
        variant: ["text", "ghost"],
        className:
          "bg-transparent text-[var(--state-info)] hover:bg-[var(--state-info)]/10 active:bg-[var(--state-info)]/20 border border-transparent data-[selected=true]:bg-[var(--state-info)]/15 font-semibold",
      },
      {
        tier: "info",
        variant: "tonal",
        className:
          "bg-[var(--state-info-container)] text-[var(--state-on-info-container)] hover:opacity-90 active:opacity-95 border border-transparent shadow-xs data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--state-info)]",
      },
    ],
    defaultVariants: {
      tier: "primary",
      variant: "filled",
      size: "default",
      kind: "text",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  type?: "button" | "submit" | "reset";
  /** Hierarchy tier (primary, secondary, tertiary, destructive, warning, success, info) */
  tier?: ButtonTier;
  /** Legacy alias for tier */
  btnType?: ButtonTier;
  /** Visual variant (filled, outlined, text/ghost, tonal, link) */
  variant?: ButtonVisualVariant;
  /** Layout kind (text, icon, text-icon) */
  kind?: ButtonKind;
  /** Size token */
  size?: ButtonSize;
  /** Whether the button is actively selected/pressed */
  isSelected?: boolean;
  /** Whether the button is in an asynchronous loading state */
  isLoading?: boolean;
  /** Text to show during loading */
  loadingText?: string;
  /** Leading icon (start of button) */
  startIcon?: React.ReactNode;
  /** Trailing icon (end of button) */
  endIcon?: React.ReactNode;
  /** Legacy icon prop (position controlled by iconPosition) */
  icon?: React.ReactNode;
  /** Legacy icon position prop */
  iconPosition?: "left" | "right";
  /** Stretch button to full container width */
  fullWidth?: boolean;
}

const SpinnerIcon = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      tier,
      btnType,
      variant,
      size,
      kind,
      fullWidth,
      isSelected,
      isLoading = false,
      loadingText,
      startIcon,
      endIcon,
      icon,
      iconPosition = "left",
      asChild = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // 1. Resolve Tier (Priority: explicit tier > btnType > variant if variant is a tier name > default "primary")
    let resolvedTier: ButtonTier = tier || btnType || "primary";
    let resolvedVariant: ButtonVisualVariant = variant || "filled";

    // Normalize legacy variant names
    if (variant) {
      if (variant === "default") {
        resolvedVariant = "filled";
      } else if (variant === "outline") {
        resolvedVariant = "outlined";
      } else if (variant === "ghost") {
        resolvedVariant = "text";
      } else if (
        variant === "primary" ||
        variant === "secondary" ||
        variant === "tertiary" ||
        variant === "destructive" ||
        variant === "error" ||
        variant === "warning" ||
        variant === "info" ||
        variant === "success"
      ) {
        resolvedTier = variant as ButtonTier;
        resolvedVariant = "filled";
      }
    }

    // Default secondary/tertiary variants if unspecified
    if (!variant) {
      if (resolvedTier === "secondary") resolvedVariant = "outlined";
      else if (resolvedTier === "tertiary") resolvedVariant = "text";
      else resolvedVariant = "filled";
    }

    // 2. Resolve Leading & Trailing Icons
    const leadingIcon = startIcon || (icon && iconPosition === "left" ? icon : null);
    const trailingIcon = endIcon || (icon && iconPosition === "right" ? icon : null);

    // 3. Resolve Kind
    let resolvedKind: ButtonKind = kind || "text";
    if (!kind) {
      if (size?.startsWith("icon")) {
        resolvedKind = "icon";
      } else if ((leadingIcon || trailingIcon) && children) {
        resolvedKind = "text-icon";
      } else if ((leadingIcon || trailingIcon) && !children) {
        resolvedKind = "icon";
      }
    }

    const isActionDisabled = disabled || isLoading;

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-tier={resolvedTier}
        data-variant={resolvedVariant}
        data-selected={isSelected ? "true" : undefined}
        aria-selected={isSelected}
        aria-busy={isLoading ? "true" : undefined}
        disabled={isActionDisabled}
        type={type}
        className={cn(
          buttonVariants({
            tier: resolvedTier,
            variant: resolvedVariant,
            size,
            kind: resolvedKind,
            fullWidth,
            className,
          })
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <SpinnerIcon />
            {loadingText || children}
          </>
        ) : (
          <>
            {leadingIcon && (
              <span className="inline-flex items-center justify-center shrink-0">
                {leadingIcon}
              </span>
            )}
            {children}
            {trailingIcon && (
              <span className="inline-flex items-center justify-center shrink-0">
                {trailingIcon}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
