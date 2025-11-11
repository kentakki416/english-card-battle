import { ERROR } from '../../constant'

/**
 * 英語学習関連のエラー型
 */
export type EnglishStudyError = typeof ERROR.ENGLISH_STUDY_ERRORS[keyof typeof ERROR.ENGLISH_STUDY_ERRORS]

