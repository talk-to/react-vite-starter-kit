import { selectPropsFromTemplate } from '../utils';

describe('Test selectPropsFromTemplate method', () => {
  const targetObj = {
    a: {
      b: { c: 'c', d: 'd' },
      e: 'e',
    },
    f: ['f', 'ff', 'fff'],
    g: 50,
    h: null,
    i: undefined,
    j: [{ k: 'k', l: 'l' }],
  };

  test('Template obj is empty', () => {
    const templateObj = {};
    const expected = {};
    const filteredObj = selectPropsFromTemplate(targetObj, templateObj);
    expect(filteredObj).toEqual(expected);
  });

  test('Template obj is selecting null and undefined from target', () => {
    const templateObj = { h: '', i: '' };
    const expected = { h: targetObj.h, i: targetObj.i };
    const filteredObj = selectPropsFromTemplate(targetObj, templateObj);
    expect(filteredObj).toEqual(expected);
  });

  test('Template obj is selecting array from target', () => {
    const templateObj = { f: '' };
    const expected = { f: targetObj.f };
    const filteredObj = selectPropsFromTemplate(targetObj, templateObj);
    expect(filteredObj).toEqual(expected);
  });

  test('Template obj is selecting array of objects from target', () => {
    const templateObj = { j: '' };
    const expected = { j: targetObj.j };
    const filteredObj = selectPropsFromTemplate(targetObj, templateObj);
    expect(filteredObj).toEqual(expected);
  });

  test('Template obj is selecting some nested obj property from target', () => {
    const templateObj = { a: { b: { c: '', d: '' } } };
    const expected = { a: { b: { c: targetObj.a.b.c, d: targetObj.a.b.d } } };
    const filteredObj = selectPropsFromTemplate(targetObj, templateObj);
    expect(filteredObj).toEqual(expected);
  });

  test('Template obj is selecting some nested obj property from target', () => {
    const templateObj = { a: { b: '' } };
    const expected = { a: { b: { c: targetObj.a.b.c, d: targetObj.a.b.d } } };
    const filteredObj = selectPropsFromTemplate(targetObj, templateObj);
    expect(filteredObj).toEqual(expected);
  });

  test('Template obj is selecting whole target object', () => {
    const templateObj = targetObj;
    const expected = targetObj;
    const filteredObj = selectPropsFromTemplate(targetObj, templateObj);
    expect(filteredObj).toEqual(expected);
  });
});
