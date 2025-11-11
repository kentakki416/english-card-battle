import { Router } from 'express'

import { Controller } from '../../../types'
import { DIContainer } from '../di/di_container'
import { SubmitEnglishAnswersSerializer } from '../../adapter/serializer/study/submit_english_answers_serializer'

/**
 * 英語学習ルーター
 */
export class StudyRouter {
  private _router: Router
  private _container: DIContainer

  constructor(router: Router, container: DIContainer) {
    this._router = router
    this._container = container
    this._setupRoutes()
  }

  /**
   * 英語学習系のルーティングを設定
   */
  private _setupRoutes() {
    this._setupGetQuestions()
    this._setupSubmitAnswers()
  }

  /**
   * 英語問題取得エンドポイント
   * POST /study/english
   */
  private _setupGetQuestions() {
    this._router.post('/english', async (req, res) => {
      try {
        const controller = this._container.getGetEnglishQuestionsController()
        const response = await controller.execute()

        res.status(response.status).send(response)
        return
      } catch {
        return res.status(500).json({ error: 'Internal server error' })
      }
    })
  }

  /**
   * 英語回答送信エンドポイント
   * POST /study/english/answer
   */
  private _setupSubmitAnswers() {
    this._router.post('/english/answer', async (req, res) => {
      try {
        // リクエストボディをパース
        const parsedRequest = SubmitEnglishAnswersSerializer.parseRequest(req.body)
        
        if (!parsedRequest) {
          return res.status(400).json({ 
            error: 'Invalid request body',
            message: 'userId and answers are required'
          })
        }

        const controller = this._container.getSubmitEnglishAnswersController()
        
        const submitRequest: Controller.SubmitEnglishAnswersRequest = {
          userId: parsedRequest.userId,
          results: parsedRequest.results
        }
        
        const response = await controller.execute(submitRequest)

        res.status(response.status).send(response)
        return
      } catch {
        return res.status(500).json({ error: 'Internal server error' })
      }
    })
  }

  /**
   * ルーターを返す
   */
  public getRouter(): Router {
    return this._router
  }
}

