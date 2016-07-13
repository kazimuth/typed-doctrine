declare namespace doctrine {

  /**
   * Literal '?'.
   */
  export interface NullableLiteral {
    // '?'
    type: 'NullableLiteral';
  }

  /**
   * Literal '*'.
   */
  export interface AllLiteral {
    // '*'
    type: 'AllLiteral';
  }

  /**
   * Literal 'null'.
   */
  export interface NullLiteral {
    type: 'NullLiteral';
  }

  /**
   * Literal 'undefined'.
   */
  export interface UndefinedLiteral {
    type: 'UndefinedLiteral';
  }

  /**
   * A union of types, expressed as (type1 | type2 | type3)...
   */
  export interface UnionType {
    type: 'UnionType';
    elements: Array<Type>;
  }

  /**
   * An array of types. [1, 2, 'hello'] would be expressed as [Number, Number, String].
   */
  export interface ArrayType {
    type: 'ArrayType';
    elements: Array<Type>;
  }

  /**
   * A type that cannot be null. Expressed as !type or type!.
   */
  export interface NonNullableType {
    type: 'NonNullableType';
    expression: Type;
    prefix: boolean;
  }

  /**
   * A type that can be null. Expressed as ?type or type?.
   */
  export interface NullableType {
    type: 'NullableType';
    expression: Type;
    prefix: boolean;
  }

  /**
   * A type name.
   */
  export interface NameExpression {
    type: 'NameExpression';
    name: string;
  }

  /**
   * An application of a generic type, e.g. Array<string>.
   */
  export interface TypeApplication {
    type: 'TypeApplication';
    expression: Type;
    applications: Array<Type>;
  }

  /**
   * An anonymous record type, expressed as {key1:type1, key2:type2}.
   */
  export interface RecordType {
    type: 'RecordType';
    fields: Array<FieldType>;
  }

  /**
   * A field in a record type. expressed as fieldKey:type.
   */
  export interface FieldType {
    type: 'FieldType';
    key: string;
    value?: Type;
  }

  /**
   * A function type, expressed as function(arg1, arg2): returntype.
   */
  export interface FunctionType {
    type: 'FunctionType';
    params: Array<Type>;
    result?: Type;
  }

  /**
   * An optional function parameter, expressed as 'type='.
   * Only permitted in parameter locations, i.e. in a FunctionType
   * or a 'param' tag.
   */
  export interface OptionalType {
    type: 'OptionalType';
    expression: Type;
  }

  /**
   * A function parameter name with type, expressed as 'name:type'.
   * only permitted in parameter locations, i.e. in a functiontype
   * or a 'param' tag.
   */
  export interface ParameterType {
    type: 'ParameterType';
    name: string;
    expression: Type;
  }

  /**
   * A function parameter name permitted a variable number of times, expressed as ...type.
   * only permitted in parameter locations, i.e. in a functiontype
   * or a 'param' tag.
   */
  export interface RestType {
    type: 'RestType';
    expression: Type;
  }

  /**
   * A function returning 'void'.
   * Only allowed in the result field on a FunctionTag.
   */
  export interface VoidLiteral {
    // 'void'
    type: 'VoidLiteral';
  }

  /**
   * All possible types.
   */
  export type Type = NullableLiteral | AllLiteral | NullLiteral | UndefinedLiteral | UnionType | ArrayType | RecordType | FunctionType | NonNullableType | OptionalType | NullableType | NameExpression | TypeApplication | OptionalType | ParameterType | RestType | VoidLiteral;

  /**
   * An @-tag.
   * Note that the semantics of what titles go with what fields is somewhat complex;
   * see usejsdoc.org and/or doctrine's source code.
   */
  export interface Tag {
    /**
     * The title of the tag. What goes after the @.
     */
    title: string;
    /**
     * The description of the tag.
     */
    description?: string;
    /**
     * If the tag includes a 'namepath', it is included here.
     * e.g.: for 'param {string} bananas', this will include 'bananas'.
     */
    name?: string;
    /**
     * The type included in the tag, if any.
     */
    type?: Type;
    /**
     * Errors encountered during parsing, if 'recoverable' is set.
     */
    errors?: Array<string>;
    /**
     * The line number, if 'lineNumbers' is set
     */
    lineNumber?: number;
    /**
     * The caption of an 'example' tag.
     */
    caption?: string;
    /**
     * The variation index in a 'variation' tag.
     */
    variation?: string;
    /**
     * The access parameter in an 'access' tag.
     */
    access?: string;
  }

  /**
   * A comment.
   */
  export interface Comment {
    /**
     * The description of the comment.
     * NOTE: doctrine does not understand 'description' tags; you'll have to
     * look those up yourself.
     */
    description: string;
    /**
     * The tags in the comment, i.e. things starting with '@'.
     */
    tags: Array<Tag>;
  }

  /**
   * The library version.
   */
  export const version: '1.2.2';

  /**
   * Parse a doc comment.
   */
  export function parse(
    comment: string,
    options?: {
      /**
       * Set to true to delete the leading / *, any * that begins a line, and
       * the trailing * / from the source text. Default: false.
       */
      unwrap?: boolean,
      /**
       * An array of tags to return. When specified, Doctrine returns only tags
       * in this array. For example, if tags is ['param'], then only param tags will be returned. Default: null.
       */
      tags?: Array<string>,
      /**
       * Set to true to keep parsing even when syntax errors occur. Default: false.
       */
      recoverable?: boolean,
      /**
       * Set to true to allow optional parameters to be specified in brackets (@param {string} [foo]). Default: false.
       */
      sloppy?: boolean,
      /**
       * set to true to add lineNumber to each node, specifying the line on which the node is found in the source. Default: false.
       */
      lineNumbers?: boolean
    }
  ): Comment;

  // Work around the awkward repetition of functions in different modules
  type ParseTypeFn = (type: string) => Type;
  type ParseParamTypeFn = (type: string) => Type;

  /**
   * Parse a jsdoc type expression.
   */
  export const parseType: ParseTypeFn;

  /**
   * Parse a jsdoc parameter type expression.
   * Includes anything that can come out of {@link doctrine.parseType}, as well as
   */
  export const parseParamType: ParseParamTypeFn;

  type SyntaxType = {
    NullableLiteral: 'NullableLiteral';
    AllLiteral: 'AllLiteral';
    NullLiteral: 'NullLiteral';
    UndefinedLiteral: 'UndefinedLiteral';
    VoidLiteral: 'VoidLiteral';
    UnionType: 'UnionType';
    ArrayType: 'ArrayType';
    RecordType: 'RecordType';
    FieldType: 'FieldType';
    FunctionType: 'FunctionType';
    ParameterType: 'ParameterType';
    RestType: 'RestType';
    NonNullableType: 'NonNullableType';
    OptionalType: 'OptionalType';
    NullableType: 'NullableType';
    NameExpression: 'NameExpression';
    TypeApplication: 'TypeApplication'
  };

  /**
   * All possible 'type's in the type AST.
   */
  export const Syntax: SyntaxType;

  /**
   * The 'type' namespace, for functions relevant to jsdoc type expressions.
   */
  export namespace type {
    /**
     * Convert a type AST to a string.
     */
    export function stringify(
      node: Type,
      options?: {
        compact?: boolean,
        topLevel?: boolean
      }): string;
  }
}

export = doctrine;
