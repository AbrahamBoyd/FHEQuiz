// src/node.ts

import * as TFHEPkg from 'node-tfhe';
import * as TKMSPkg from 'node-tkms';

globalThis.TFHE = TFHEPkg;
globalThis.TKMS = TKMSPkg;

// ❗️Удаляем всё лишнее и оставляем только то, что реально нужно
export { createInstance } from './instance';
