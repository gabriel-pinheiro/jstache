import Pr, { Parser } from 'pierrejs';

// Lab and typescript ¬¬"
/* $lab:coverage:off$ */
export enum NodeType {
    TEXT = 'TEXT',
    CODE = 'CODE',
    COMMENT = 'COMMENT',
}
export type Node = {
    type: NodeType,
    value: string,
};
/* $lab:coverage:on$ */

const tag = (type: NodeType) => (value: string) => ({ type, value });
const join = (arr: string[]) => arr.join('');
const middle = ([_open, value, _close]: string[]) => value;


const openComment = Pr.string('{{!');
const openMustache = Pr.string('{{');
const closeMustache = Pr.string('}}');
const escapedOpenMustache = Pr.string('\\{{').map(() => '{{');
const escapedCloseMustache = Pr.string('\\}}').map(() => '}}');
const escapedSlash = Pr.string('\\\\').map(() => '\\');

// Content inside {{ and }}
const inside: Parser<string> = Pr.many(Pr.either(
    escapedCloseMustache,
    Pr.except(closeMustache),
)).map(join)
  .withName('code');

const comment: Parser<Node> = Pr.all(
    openComment,
    inside.withName('comment text'),
    closeMustache
).map(middle)
 .map(tag(NodeType.COMMENT))
 .withName('comment');

const mustache: Parser<Node> = Pr.all(
    openMustache,
    inside.withName('JavaScript code'),
    closeMustache
).map(middle)
 .map(tag(NodeType.CODE))
 .withName('mustache');

const text: Parser<Node> = Pr.oneOrMany(Pr.either(
    escapedSlash,
    escapedOpenMustache,
    Pr.except(openMustache),
)).map(join)
  .map(tag(NodeType.TEXT))
  .withName('text');

const token: Parser<Node> = Pr.either(
    comment,
    mustache,
    text,
);

export const parser: Parser<Node[]> = Pr.manyUntilEnd(token);
