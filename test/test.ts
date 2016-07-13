import * as d from 'doctrine';
import * as test from 'blue-tape';

test('parse no options', (t: test.Test) => {
  let res = d.parse('');
  t.plan(2)
  t.equal(res.description, '');
  t.equal(res.tags.length, 0);
});

test('parse empty options', (t: test.Test) => {
  let res = d.parse('', {});
  t.equal(res.description, '');
  t.equal(res.tags.length, 0);
  t.end();
});

test('parse all options', (t: test.Test) => {
  let res = d.parse('/* this is a test\n * @param {number} bees the number of bees\n */', {
    unwrap: true,
    tags: null,
    recoverable: true,
    sloppy: true,
    lineNumbers: true
  });
  t.plan(10);
  t.equal(res.description, 'this is a test');
  t.equal(res.tags.length, 1);
  t.equal(res.tags[0].title, 'param');
  t.equal(res.tags[0].name, 'bees');
  t.equal(res.tags[0].description, 'the number of bees');
  t.equal(res.tags[0].type.type, d.Syntax.NameExpression);
  let resType = res.tags[0].type as d.NameExpression;
  t.equal(resType.name, 'number');
  t.equal(res.tags[0].lineNumber, 1);
  t.false(res.tags[0].errors);
  t.false(res.tags[0].caption);
  t.end();
});

test('parseType all types', (t: test.Test) => {
  let res = d.parseType('(undefined|null|*|?|Dog|Dog?|Dog!|Dog[]|Array<Dog>|[Dog,Cat]|function(Bird=):void|{rex:Dog}|function(...Dog))');
  t.equal(res.type, d.Syntax.UnionType);
  let u = res as d.UnionType;
  t.equal(u.elements.length, 13);
  t.equal(u.elements[0].type, d.Syntax.UndefinedLiteral);
  t.equal(u.elements[1].type, d.Syntax.NullLiteral);
  t.equal(u.elements[2].type, d.Syntax.AllLiteral);
  t.equal(u.elements[3].type, d.Syntax.NullableLiteral);
  t.equal(u.elements[4].type, d.Syntax.NameExpression);
  t.equal(u.elements[5].type, d.Syntax.NullableType);
  t.equal(u.elements[6].type, d.Syntax.NonNullableType);
  t.equal(u.elements[7].type, d.Syntax.TypeApplication);
  t.equal(u.elements[8].type, d.Syntax.TypeApplication);
  t.equal(u.elements[9].type, d.Syntax.ArrayType);
  t.equal(u.elements[10].type, d.Syntax.FunctionType);
  t.equal(u.elements[11].type, d.Syntax.RecordType);

  t.equal((u.elements[4] as d.NameExpression).name, 'Dog');

  t.equal((u.elements[5] as d.NullableType).prefix, false);
  t.equal((u.elements[5] as d.NullableType).expression.type, d.Syntax.NameExpression);
  t.equal(((u.elements[5] as d.NullableType).expression as d.NameExpression).name, 'Dog');

  t.equal((u.elements[6] as d.NonNullableType).prefix, false);
  t.equal((u.elements[6] as d.NonNullableType).expression.type, d.Syntax.NameExpression);
  t.equal(((u.elements[6] as d.NonNullableType).expression as d.NameExpression).name, 'Dog');

  t.equal((u.elements[7] as d.TypeApplication).expression.type, d.Syntax.NameExpression);
  t.equal(((u.elements[7] as d.TypeApplication).expression as d.NameExpression).name, 'Array');
  t.equal((u.elements[7] as d.TypeApplication).applications.length, 1);
  t.equal((u.elements[7] as d.TypeApplication).applications[0].type, d.Syntax.NameExpression);
  t.equal(((u.elements[7] as d.TypeApplication).applications[0] as d.NameExpression).name, 'Dog');

  t.equal((u.elements[8] as d.TypeApplication).expression.type, d.Syntax.NameExpression);
  t.equal(((u.elements[8] as d.TypeApplication).expression as d.NameExpression).name, 'Array');
  t.equal((u.elements[8] as d.TypeApplication).applications.length, 1);
  t.equal((u.elements[8] as d.TypeApplication).applications[0].type, d.Syntax.NameExpression);
  t.equal(((u.elements[8] as d.TypeApplication).applications[0] as d.NameExpression).name, 'Dog');

  let a = u.elements[9] as d.ArrayType;
  t.equal(a.elements.length, 2);
  t.equal(a.elements[0].type, d.Syntax.NameExpression);
  t.equal(a.elements[1].type, d.Syntax.NameExpression);
  t.equal((a.elements[0] as d.NameExpression).name, 'Dog');
  t.equal((a.elements[1] as d.NameExpression).name, 'Cat');

  let f = u.elements[10] as d.FunctionType;
  t.equal(f.result.type, d.Syntax.VoidLiteral);
  t.equal(f.params.length, 1);
  t.equal(f.params[0].type, d.Syntax.OptionalType);
  t.equal(f.params[0].type, d.Syntax.OptionalType);
  t.end();
});
