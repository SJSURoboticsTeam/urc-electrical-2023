import * as cm from 'commonmark'
import { promises as fs } from 'fs';
import tmp from 'tmp'
import * as cp from 'child_process';
import { once } from 'node:events'
import path from 'path';

const parse = new cm.Parser({ smart: true });
tmp.setGracefulCleanup();
const workdir = tmp.dirSync({ unsafeCleanup: true });
console.log(workdir.name);

if (!process.argv[2] || !process.argv[2]) {
    console.error("input or output not specified");
    process.exit(-1);
}

const input = process.argv[2];
const output = process.argv[3];
const depscan = process.argv[4] == '-M';
var number = 0;

var jobs: Promise<void[]>[] = [];
var embeds = new Set<string>();

try {
    const data = await fs.readFile(input, 'utf8');
    const ast = parse.parse(data);
    const walker = ast.walker();
    var event;
    while ((event = walker.next())) {
        var node = event.node;
        if (!event.entering) {
            continue;
        }
        if (!depscan) {
            if (node.type === 'code_block' && node.info === 'mermaid' && node.literal) {
                const out = workdir.name + "/" + `f-${number++}.svg`;
                const a = cp.spawn(`npx`, ['mmdc', '-i', '-', '-o', `${out}`, '-b', 'transparent', '-q']);
                a.stdin!.write(`${node.literal}\n`);
                a.stdin!.end();
                const html = new cm.Node('html_block');
                node.insertBefore(html);
                node.unlink
                jobs.push(once(a.on('close', async () => {
                    html.literal = await fs.readFile(out, { encoding: 'utf-8' });
                }), 'close'));
            }
        } else {
            if (node.type === 'image') {
                embeds.add(node.destination!)
            }
        }

    }

    const render = new cm.HtmlRenderer();

    if (!depscan) {
        await Promise.all(jobs);
        const result = render.render(ast);
        fs.writeFile(output, result);
    } else {
        const pwd = path.dirname(input) + '/';
        const deps = Array.from(embeds).map((x) => pwd + x);
        const rule = deps.map((x) => `build/${x}: ${x}\n\tcp ${x} build/${x}`).reduce((old, new_val) => old + '\n' + new_val, '');
        const depdata = `${output.slice(0, -2)} ${output}: ${input} ${deps.map((x) => 'build/' + x).reduce((prev, new_val) => prev + ' ' + new_val, '')}`;
        fs.writeFile(output, `${rule}\n${depdata}`);
    }
} catch (err) {
    console.error(err);
}