import * as cp from 'child_process';
import { promisify } from 'util';
import { Readable } from "stream";

const spawn = promisify(cp.spawn);

var input = Readable.from(['string\n']);

var a = spawn('cat', { stdio: ['pipe', 'pipe', 'pipe'], shell: true });