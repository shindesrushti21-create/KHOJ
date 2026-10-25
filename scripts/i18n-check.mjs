import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const srcRoot = path.join(root, 'src');
const translationsPath = path.join(srcRoot, 'translations.ts');
const translationText = fs.readFileSync(translationsPath, 'utf8');
const translationAst = ts.createSourceFile(translationsPath, translationText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const localeKeys = new Map([['en', new Set()], ['hi', new Set()], ['mr', new Set()]]);
const localeValues = new Map([['en', new Map()], ['hi', new Map()], ['mr', new Map()]]);

const propertyName = name => name && (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) ? String(name.text) : null;
function collectObject(object, prefix, keys, values) {
  for (const member of object.properties) {
    if (!ts.isPropertyAssignment(member)) continue;
    const name = propertyName(member.name);
    if (!name) continue;
    const key = prefix ? `${prefix}.${name}` : name;
    if (ts.isObjectLiteralExpression(member.initializer)) collectObject(member.initializer, key, keys, values);
    else if (ts.isStringLiteral(member.initializer) || ts.isNoSubstitutionTemplateLiteral(member.initializer)) {
      keys.add(key);
      values.set(key, member.initializer.text);
    }
  }
}
for (const statement of translationAst.statements) {
  if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) {
    const name = propertyName(declaration.name);
    if (['en', 'hi', 'mr'].includes(name) && declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) collectObject(declaration.initializer, '', localeKeys.get(name), localeValues.get(name));
  }
  if (ts.isExpressionStatement(statement) && ts.isCallExpression(statement.expression) && ts.isPropertyAccessExpression(statement.expression.expression) && statement.expression.expression.expression.getText(translationAst) === 'Object' && statement.expression.expression.name.text === 'assign') {
    const [target, object] = statement.expression.arguments;
    const locale = target && ts.isIdentifier(target) ? target.text : '';
    if (localeKeys.has(locale) && object && ts.isObjectLiteralExpression(object)) collectObject(object, '', localeKeys.get(locale), localeValues.get(locale));
  }
}

const errors = [];
const enKeys = localeKeys.get('en');
for (const key of enKeys) {
  for (const locale of ['hi', 'mr']) if (!localeKeys.get(locale).has(key)) errors.push(`Missing ${locale} translation for en key: ${key}`);
}
for (const locale of ['hi', 'mr']) for (const key of localeKeys.get(locale)) if (!enKeys.has(key)) errors.push(`Key exists in ${locale} but not en: ${key}`);
for (const [locale, values] of localeValues) for (const [key, value] of values) {
  if (value === key && (/^[a-z]+(?:\.[A-Za-z0-9_]+)+$/.test(key) || /[A-Z]/.test(key) && /^[a-z][A-Za-z0-9]*$/.test(key))) errors.push(`Raw i18n key used as ${locale} UI text: ${key}`);
}

function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(full) : /\.(tsx?|jsx?)$/.test(entry.name) && !/\.test\.[jt]sx?$/.test(entry.name) ? [full] : [];
  });
}
function possibleKeys(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return { keys: [node.text] };
  if (ts.isConditionalExpression(node)) {
    const yes = possibleKeys(node.whenTrue), no = possibleKeys(node.whenFalse);
    return yes && no ? { alternatives: [yes, no] } : null;
  }
  if (ts.isTemplateExpression(node)) {
    const prefix = node.head.text;
    const suffix = node.templateSpans.at(-1)?.literal.text || '';
    return { pattern: { prefix, suffix } };
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = possibleKeys(node.left), right = possibleKeys(node.right);
    if (left?.keys && right?.keys) return { keys: left.keys.flatMap(a => right.keys.map(b => a + b)) };
    if (left?.keys?.every(value => typeof value === 'string')) return { pattern: { prefix: left.keys[0] || '', suffix: '' } };
    if (right?.keys?.every(value => typeof value === 'string')) return { pattern: { prefix: '', suffix: right.keys[0] || '' } };
  }
  if (ts.isElementAccessExpression(node) && ts.isArrayLiteralExpression(node.expression)) {
    const values = node.expression.elements.filter(item => ts.isStringLiteral(item) || ts.isNoSubstitutionTemplateLiteral(item)).map(item => item.text);
    if (values.length) return { keys: values };
  }
  return null;
}
function verifyKey(file, value) {
  if (!value) return;
  if (value.alternatives) { for (const alternative of value.alternatives) verifyKey(file, alternative); return; }
  if (value.keys) for (const key of value.keys) if (!enKeys.has(key)) errors.push(`${path.relative(root, file)}: missing translation key '${key}'`);
  if (value.pattern) {
    const { prefix, suffix } = value.pattern;
    const matching = [...enKeys].filter(key => key.startsWith(prefix) && key.endsWith(suffix));
    if (!matching.length) errors.push(`${path.relative(root, file)}: dynamic translation key has no matches: ${prefix}…${suffix}`);
    for (const key of matching) for (const locale of ['hi', 'mr']) if (!localeKeys.get(locale).has(key)) errors.push(`${path.relative(root, file)}: dynamic key '${key}' is missing in ${locale}`);
  }
}
function extractKey(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return { kind: 'static', key: node.text };
  if (ts.isTemplateExpression(node)) {
    const prefix = node.head.text;
    const suffix = node.templateSpans.at(-1)?.literal.text || '';
    return { kind: 'pattern', prefix, suffix };
  }
  return { kind: 'dynamic', text: node.getText() };
}
for (const file of filesUnder(srcRoot)) {
  if (path.resolve(file) === path.resolve(translationsPath)) continue;
  const source = fs.readFileSync(file, 'utf8');
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function visit(node) {
    if (ts.isCallExpression(node)) {
      const callee = node.expression;
      const isTranslation = ts.isIdentifier(callee) && callee.text === 't' || ts.isPropertyAccessExpression(callee) && callee.name.text === 't';
      if (isTranslation && node.arguments.length) {
        verifyKey(file, possibleKeys(node.arguments[0]));
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
}

if (errors.length) {
  console.error(`i18n check failed with ${errors.length} issue(s):\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else console.log(`i18n check passed: ${enKeys.size} keys are present in en, hi, and mr; static and interpolated translation keys resolve.`);
