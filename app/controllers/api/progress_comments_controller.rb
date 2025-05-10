class Api::ProgressCommentsController < ApplicationController
    protect_from_forgery with: :null_session

    def index
      comments = ProgressComment.where(task_id: params[:task_id]).order(created_at: :desc)
      render json: comments
    end

    def create
      comment = ProgressComment.new(progress_comment_params)
      if comment.save
        render json: comment, status: :created
      else
        render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      comment = ProgressComment.find(params[:id])
      if comment.update(progress_comment_params)
        render json: comment
      else
        render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
      end
    end


    def destroy
      comment = ProgressComment.find(params[:id])
      comment.destroy
      head :no_content
    end


    private

    def progress_comment_params
      params.require(:progress_comment).permit(:task_id, :content)
    end
end
