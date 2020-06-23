import { Exporter } from "../Exporter";

test('can be created', () => expect(new Exporter()).toBeTruthy());

test('length starts from 0', () => expect(new Exporter().length).toBe(0));

test('can increase indentation', () => {
    const exporter = new Exporter();
    exporter.increaseIndent()
    expect(exporter.indentation).toBe(1);
    exporter.decraseIndent();
    expect(exporter.indentation).toBe(0);
});

test('can write string', () => {
    const exporter = new Exporter();
    exporter.write('abc').write('def');
    expect(exporter.toString()).toBe('abcdef');
});

test('indentation affects write', () => {
    const exporter = new Exporter();
    exporter.increaseIndent();
    exporter.write('abc').write('def');
    expect(exporter.toString()).toBe('    abcdef');
});

test('can add newline', () => {
    const exporter = new Exporter();
    exporter.increaseIndent();
    exporter.write('abc').newline().write('def').newline();
    expect(exporter.toString()).toBe('    abc\n    def\n');
});

test('can add newline', () => {
    const exporter = new Exporter();
    exporter.increaseIndent();
    exporter.write('abc').newline().write('def').newline();
    expect(exporter.toString()).toBe('    abc\n    def\n');
});

test('can do structured writing', () => {
    const exporter = new Exporter();
    exporter.write('test').increaseIndent().newline()
        .write('item').newline()
        .write('item').newline()
        .increaseIndent().write('subitem').decraseIndent().newline()
        .write('item').newline()
        .decraseIndent().write('end test').newline();
    expect(exporter.toString()).toBe(
        'test\n' +
        '    item\n' + 
        '    item\n' + 
        '       subitem\n' + 
        '    item\n' + 
        'end test\n'
    );
});