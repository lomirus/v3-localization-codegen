import * as XLSX from "xlsx"
import { save } from '@tauri-apps/api/dialog';
import { writeBinaryFile } from '@tauri-apps/api/fs';

import { KeywordRow, LocalizationSheet } from '../types'

export async function selectFile(): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const fileSelector = document.createElement('input');
        fileSelector.type = 'file'

        fileSelector.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files![0];

            const reader = new FileReader();
            reader.readAsArrayBuffer(file)
            reader.onload = () => {
                resolve(reader.result as ArrayBuffer)
            }
            reader.onerror = () => {
                reject(reader.result as ArrayBuffer)
            }
        }

        fileSelector.click();
    })
}

export function parseLocalization(file: ArrayBuffer): LocalizationSheet[] {
    const workbook = XLSX.read(file);
    return workbook.SheetNames.map(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet) as KeywordRow[];
        return {
            name: sheetName,
            data: json
        }
    });
}

export function localizeSM(sheets: LocalizationSheet[]) {
    const text = sheets.map(({ name, data }) => (
        `  # ${name}\n  ${data.map(row => `${row['标识符']}:${row['标号']} "${row['中文文本']}"`).join('\n  ')}`
    )).join('\n\n')
    return `l_simp_chinese:\n${text}`
}

export function localizeEN(sheets: LocalizationSheet[]) {
    const text = sheets.map(({ name, data }) => (
        `  # ${name}\n  ${data.map(row => `${row['标识符']}:${row['标号']} "${row['英文文本']}"`).join('\n  ')}`
    )).join('\n\n')
    return `l_english:\n${text}`
}

export async function saveTextFile(title: string, text: string) {
    const filePath = await save({
        filters: [{
            name: 'Yaml',
            extensions: ['yml']
        }],
        defaultPath: title
    });

    if (!filePath) return;
    const encoder = new TextEncoder();
    const arr = encoder.encode(text);
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), arr]);
    const buffer = await blob.arrayBuffer();
    await writeBinaryFile(filePath, buffer);
}