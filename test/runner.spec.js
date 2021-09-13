const Lab = require('@hapi/lab');
const Code = require('@hapi/code');

const { compile } = require('..');

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('runner', () => {
    it('should output text', () => {
        const text = 'Hello World!';
        const template = compile(text);
        expect(template({})).to.equal(text);
    });

    it('should parse code', () => {
        const text = '{{ 1 + 1 }}';
        const template = compile(text);
        expect(template({})).to.equal('2');
    });

    it('should ignore comments', () => {
        const text = '{{ 1 + 1 }}{{! comment }}';
        const template = compile(text);
        expect(template({})).to.equal('2');
    });

    it('should execute in context', () => {
        const text = 'Hello, {{name}}!';
        const template = compile(text);
        expect(template({ name: 'Alice' })).to.equal('Hello, Alice!');
    });

    it('should share context between mustaches', () => {
        const text = 'Hello, {{foo = "bar"; name}}! {{foo}}';
        const template = compile(text);
        expect(template({ name: 'Alice' })).to.equal('Hello, Alice! bar'); 
    });
});
