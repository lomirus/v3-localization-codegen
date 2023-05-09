export type KeywordRow = {
    "标识符": string
    "标号": string
    "英文文本": string
    "中文文本": string
}

export type LocalizationSheet = {
    name: string,
    data: KeywordRow[]
}