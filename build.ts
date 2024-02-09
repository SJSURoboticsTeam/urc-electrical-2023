import * as cm from 'commonmark'
import * as fs from 'fs'
import tmp from 'tmp'
import * as cp from 'child_process';
import { once } from 'node:events'

const parse = new cm.Parser({ smart: true });
tmp.setGracefulCleanup();
const workdir = tmp.dirSync({ unsafeCleanup: true });
console.log(workdir.name);

if (!process.argv[2] || !process.argv[2]) {
    console.error("input or output not specified");
    process.exit(-1);
}

const file = process.argv[2];
const output = process.argv[3];
var number = 0;

var jobs: Promise<void[]>[] = [];

try {
    const data = fs.readFileSync(file, 'utf8');
    const ast = parse.parse(data);
    const walker = ast.walker();
    var event;
    while ((event = walker.next())) {
        var node = event.node;
        if (event.entering && node.type === 'code_block' && node.info === 'mermaid' && node.literal) {
            const out = workdir.name + "/" + `f-${number++}.svg`;
            const a = cp.spawn(`npx`, ['mmdc', '-i', '-', '-o', `${out}`, '-b', 'transparent', '-q']);
            a.stdin!.write(`${node.literal}\n`);
            a.stdin!.end();
            const html = new cm.Node('html_block');
            node.insertBefore(html);
            node.unlink
            jobs.push(once(a.on('close', () => {
                html.literal = fs.readFileSync(out, { encoding: 'utf-8' });
            }), 'close'));
        }

    }

    const render = new cm.HtmlRenderer();

    await Promise.all(jobs);
    const result = render.render(ast);
    fs.writeFileSync(output, result);
} catch (err) {
    console.error(err);
}