// Json

export type Json_Primitive = string | number | boolean | null;

export interface Json_Object {
  [member: string]: Json_Value;
}

export interface Json_Arr extends Array<Json_Value> {}

export type Json_Value = Json_Primitive | Json_Object | Json_Arr;

// JsonApi

/**
 * A JSON object MUST be at the root of every JSON API request and responsecontaining data.
 * This object defines a document’s “top level”.
 * A document MUST contain at least one of the following top-level members:
 */

export type JsonApi_MetaObject = Json_Object;

/**
 * this type is no longer required, as the meta has been moved to the DocBase
 * this type can be safely removed in future versions
 */
// export interface JsonApi_DocWithMeta extends DocBase {
// 	meta: JsonApi_MetaObject; // a meta object that contains non-standard meta-information.
// }

export interface JsonApi_DocWithData<
  T extends JsonApi_PrimaryData = JsonApi_PrimaryData
> extends JsonApi_DocBase {
  data: T; // the document’s “primary data”
  included?: Included;
}

export interface JsonApi_DocWithErrors extends JsonApi_DocBase {
  errors: JsonApi_Errors; // an array of error objects
}
// The members data and errors MUST NOT coexist in the same document.
// ⛔️ NOT EXPRESSIBLE IN TYPESCRIPT
// If a document does not contain a top-level data key,
//    the included member MUST NOT be present either.
// ⛔️ NOT EXPRESSIBLE IN TYPESCRIPT

/* A document MAY contain any of these top-level members: */
export interface JsonApi_DocBase {
  jsonapi?: JsonApi_ImplementationInfo;
  links?: JsonApi_Links | JsonApi_PaginationLinks;
  meta?: JsonApi_MetaObject; // a meta object that contains non-standard meta-information.
}

export type JsonApi_Document = JsonApi_DocWithErrors | JsonApi_DocWithData;
export type JsonApi_SingleResourceDoc<
  T extends string = string,
  A extends { [k: string]: Json_Value } = { [k: string]: Json_Value }
> = JsonApi_DocWithData<JsonApi_ResourceObject<T, A>>;
export type JsonApi_CollectionResourceDoc<
  T extends string = string,
  A extends { [k: string]: Json_Value } = { [k: string]: Json_Value }
> = JsonApi_DocWithData<Array<JsonApi_ResourceObject<T, A>>>;

// an object describing the server’s implementation
export interface JsonApi_ImplementationInfo {
  version?: string;
  meta?: JsonApi_MetaObject;
}

export type JsonApi_Link = string | { href: string; meta?: JsonApi_MetaObject };

// The top-level links object MAY contain the following members:
export interface JsonApi_Links {
  self?: JsonApi_Link; // the link that generated the current response document.
  related?: JsonApi_Link; // a related resource link when the primary data represents a resource relationship.
  // TODO pagination links for the primary data.
}

export interface JsonApi_PaginationLinks {
  first?: JsonApi_Link | null; // the first page of data
  last?: JsonApi_Link | null; // the last page of data
  prev?: JsonApi_Link | null; // the previous page of data
  next?: JsonApi_Link | null; // the next page of data
}

export type Included = JsonApi_ResourceObject[];

export interface JsonApi_ErrorObject {
  id?: number | string;
  links?: JsonApi_Links;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: any;
    parameter?: string;
  };
  meta?: JsonApi_MetaObject;
}

export type JsonApi_PrimaryData<
  T extends string = string,
  A extends JsonApi_AttributesObject = JsonApi_AttributesObject
> = JsonApi_ResourceObject<T, A> | Array<JsonApi_ResourceObject<T, A>>;

export interface JsonApi_ResourceObject<
  T extends string = string,
  A extends JsonApi_AttributesObject = JsonApi_AttributesObject
> {
  id?: string;
  type: T;
  attributes?: JsonApi_AttributesObject<A>;
  relationships?: JsonApi_RelationshipsObject;
  links?: JsonApi_Links;
  meta?: JsonApi_MetaObject;
}

export interface JsonApi_ResourceIdentifierObject {
  id: string;
  type: string;
  meta?: JsonApi_MetaObject;
}

export type JsonApi_ResourceLinkage =
  | null
  | never[]
  | JsonApi_ResourceIdentifierObject
  | JsonApi_ResourceIdentifierObject[];

export interface JsonApi_RelationshipsWithLinks {
  links: JsonApi_Links;
}

export interface JsonApi_RelationshipsWithData {
  data: JsonApi_ResourceLinkage;
}

export interface JsonApi_RelationshipsWithMeta {
  meta: JsonApi_MetaObject;
}

export type JsonApi_RelationshipObject =
  | JsonApi_RelationshipsWithData
  | JsonApi_RelationshipsWithLinks
  | JsonApi_RelationshipsWithMeta;

export interface JsonApi_RelationshipsObject {
  [k: string]: JsonApi_RelationshipObject;
}

export type JsonApi_AttributesObject<
  ATTRS extends { [k: string]: Json_Value } = { [k: string]: Json_Value }
> = { [K in keyof ATTRS]: ATTRS[K] };

export type JsonApi_Errors = JsonApi_ErrorObject[];

let doc: JsonApi_Document = {
  data: {
    type: 'articles',
    id: '1',
  },
};
