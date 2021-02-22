import type {
  StandardShorthandProperties,
  StandardLonghandProperties,
  VendorShorthandProperties,
  SimplePseudos,
} from 'csstype';

type Style = StyleProperties &
  {
    // Mixed keys not possible in TypeScript
    // https://github.com/microsoft/TypeScript/issues/17867
    // [key: string]: Style;
    [key in SimplePseudos]?: Style;
  };

export default Style;

type FixedStandardLonghandProperties = Omit<
  StandardLonghandProperties,
  | 'backgroundPosition'
  | 'inset'
  | 'insetBlock'
  | 'insetInline'
  | 'marginBlock'
  | 'marginInline'
  | 'overscrollBehavior'
  | 'paddingBlock'
  | 'paddingInline'
  | 'scrollMargin'
  | 'scrollMarginBlock'
  | 'scrollMarginInline'
  | 'scrollPadding'
  | 'scrollPaddingBlock'
  | 'scrollPaddingInline'
  | 'scrollMargin'
>;


export type StyleProperties = FixedStandardLonghandProperties &
  VendorShorthandProperties &
  ExpandedShorthands;

type ExpandedShorthands = Pick<
  StandardShorthandProperties,
  | 'borderColor'
  | 'borderRadius'
  | 'borderStyle'
  | 'borderWidth'
  | 'margin'
  | 'overflow'
  | 'padding'
  // Incorrectly classified as longhand in csstype
  // | 'overscrollBehavior'
>;

