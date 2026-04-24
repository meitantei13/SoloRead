class Api::V1::Current::TagsController < Api::V1::BaseController
  before_action :authenticate_user!
  
  def index
    tags = Tag.where(is_default: true).or(Tag.where(user: current_user))
    render json: tags
  end

  def create
    tag = current_user.tags.build(tag_params)
    if tag.save
      render json: tag
    else
      render json: { errors: tag.errors }, status: :unprocessable_content
    end
  end

  def destroy
    tag = current_user.tags.find(params[:id])
    tag.destroy!
    head :no_content
  end

  private

    def tag_params
      params.expect(tag: [:name])
    end
end
