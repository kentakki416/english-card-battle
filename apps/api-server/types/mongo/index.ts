export * from './user_collection'
export * from './english_word_collection'
export * from './study_history_collection'


export type Collection = {
  id?: string
  [key: string]: unknown
}
