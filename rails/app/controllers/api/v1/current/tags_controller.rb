class Api::V1::Current::TagsController < Api::V1::BaseController
  def index
    tags = Tag.where(is_default: true).or(Tag.where(user: current_user))
    render json: tags
  end

  def create
    tag = current_user.tags.create!(tag_params)
    render json: tag
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
