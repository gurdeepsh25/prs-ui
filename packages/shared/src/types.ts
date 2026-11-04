/**
 * Platform-agnostic shared types for the PRS UI ecosystem.
 *
 * These enums/unions define the common component API vocabulary so that
 * `@prs/ui-web` and `@prs/ui-native` expose consistent prop values
 * (e.g. `variant="solid"`, `size="md"`).
 */

export type Size = 'sm' | 'md' | 'lg';

export type ColorVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'subtle' | 'link';

export type Orientation = 'horizontal' | 'vertical';

export type Alignment = 'start' | 'center' | 'end' | 'stretch' | 'between';

export type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export type TextAlignment = 'left' | 'center' | 'right' | 'justify';

export type Tone = ColorVariant | 'neutral';

export type Status = 'idle' | 'pending' | 'success' | 'error';

export type LoadingState = boolean | 'active' | 'idle';

export type Direction = 'ltr' | 'rtl';

export type Boundary = 'top' | 'right' | 'bottom' | 'left';

export type Side = Boundary;

export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/** Generic option descriptor used by Select, Combobox, RadioGroup, etc. */
export interface SelectOption<TValue = string> {
  value: TValue;
  label: string;
  description?: string;
  disabled?: boolean;
}

/** Common a11y props accepted by most components on both platforms. */
export interface BaseAccessibilityProps {
  /** Accessible label (maps to aria-label on web, accessibilityLabel on RN). */
  accessibilityLabel?: string;
  /** Human-readable role description. */
  accessibilityHint?: string;
  /** id of element(s) describing this one. */
  ariaDescribedBy?: string;
  /** id of element(s) labelling this one. */
  ariaLabelledBy?: string;
}

/** Props shared by all form controls. */
export interface BaseFieldProps<TValue = string> extends BaseAccessibilityProps {
  id?: string;
  name?: string;
  label?: string;
  description?: string;
  errorText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  value?: TValue;
  defaultValue?: TValue;
  onValueChange?: (value: TValue) => void;
}
